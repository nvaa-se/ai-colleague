import { Worker, Job } from 'bullmq'
import z from 'zod'
import discord from '../services/discord'
import { TextChannel } from 'discord.js'
import { runQuery } from '../services/dbAccess'
import redis from '../config/redis'
import { createCompletion } from '../services/mistral'
import sqlPrompt from '../prompts/generateCustomerInfoSQL'
import { answerQuestion, dataFetcher } from '../queues'
import { resultToCsv } from '../lib/resultToCsv'
class JobData extends Job {
  data: {
    threadChannelId: string
    msgId: string
    strAnlNr: string
    distilledQuestion: string
    plan: string
    brokenSql?: string
    sqlError?: string
  }
}

const queryStruct = z.object({
  sql: z.string(),
  paramsToReplace: z.array(
    z.object({
      param: z.string(),
      placeholder: z.string(),
    })
  ),
})

const worker = new Worker(
  'dataFetcher',
  async (job: JobData) => {
    console.log(`DATAFETCHER JOB, Attempt #${job.attemptsMade}`, job.data)
    job.log(`DATAFETCHER JOB, Attempt #${job.attemptsMade}` + job.data)
    const {
      threadChannelId,
      distilledQuestion,
      plan,
      strAnlNr,
      msgId,
      brokenSql,
      sqlError,
    } = job.data
    let typingHandle: NodeJS.Timeout
    try {
      const thread = (await discord.channel(threadChannelId)) as TextChannel
      const msg = await thread.messages.fetch(msgId)
      await msg.edit('Skapar databasfrågor')
      job.log('Skapar databasfrågor')

      typingHandle = setInterval(() => {
        thread.sendTyping()
      }, 8000)

      const json_mode = true
      const systemPrompt = sqlPrompt(brokenSql, sqlError)
      const userPrompt = distilledQuestion + plan
      job.log('System prompt: ' + systemPrompt)
      job.log('User prompt: ' + userPrompt)
      const sqlQueryResponse = await createCompletion(
        [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        json_mode
      )
      clearInterval(typingHandle)

      const paramValues = {
        strAnlNr,
      }

      const sqlQuery = sqlQueryResponse.choices?.[0].message?.content
      job.log('mistral answer: ' + sqlQuery)
      await msg.edit('Verifierar databasfrågor...')
      console.log('## MISTRAL DATAFETCHER: ', sqlQuery, '###')

      const json = JSON.parse(sqlQuery)
      console.log('JSON: ', json)
      const parsed = queryStruct.safeParse(json)
      let sql = ''
      job.log('Korrekt formaterat svar: ' + parsed.success)
      if (!parsed.success) {
        if (job.attemptsMade < 3) {
          msg.edit('AI genererade en felaktig SQL-fråga, försöker igen')
        } else {
          msg.edit('AI genererade en felaktig SQL-fråga, slutar försöka igen')
        }
        throw new Error(String(parsed.error))
      } else {
        const { paramsToReplace } = parsed.data
        sql = parsed.data.sql
        job.log('SQL: ' + sql)
        paramsToReplace.forEach((param) => {
          if (param.param.startsWith('str')) {
            sql = sql.replace(param.placeholder, paramValues[param.param])
          } else {
            console.error(
              "ERROR: param name doesn't start with 'str' in dataFetcher"
            )
          }
        })
        job.log('SQL med parametrar: ' + sql)
        msg.edit(msg.content + '\nKör databasfrågor...')
        console.log('RUNNING THIS SQL:\n\n\n', sql, '\n\n\n')
        job.log('Kör databasfrågor...')
        let results = []
        try {
          results = await runQuery(sql)
          job.log('SQL-Resultat: ' + JSON.stringify(results))
        } catch (error) {
          job.log('Fel vid databasfrågor' + error.message)
          clearInterval(typingHandle)
          console.log('ERROR:', error)
          msg.edit('Fel vid databasfrågor')
          dataFetcher.add('dataFetcher in thread ' + threadChannelId, {
            threadChannelId,
            msgId,
            strAnlNr,
            distilledQuestion,
            plan,
            brokenSql: sql,
            sqlError: error.message,
          })
          return
        }
        if (results.length === 0) {
          msg.edit('Inga resultat hittades')
          answerQuestion.add('answer in thread ' + threadChannelId, {
            threadChannelId,
            msgId,
            strAnlNr,
            distilledQuestion,
            plan,
            sql,
            results: 'Inga resultat hittades från databasen',
          })
        } else {
          msg.edit('Översätter resultat...')
          answerQuestion.add('answer in thread ' + threadChannelId, {
            threadChannelId,
            msgId,
            strAnlNr,
            distilledQuestion,
            plan,
            sql,
            results: JSON.stringify(results, null, 2),
          })
        }
        return { sql, distilledQuestion, plan, results }
      }
    } catch (error) {
      clearInterval(typingHandle)
      console.error(`Fel vid dataFetcher för tråd ${threadChannelId}`, error)
      job.log(`Fel vid dataFetcher för tråd ${threadChannelId}` + error)
      throw error
    }
  },
  {
    connection: redis,
    autorun: false,
  }
)

export default worker
