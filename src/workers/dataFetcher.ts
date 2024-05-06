import { Worker, Job } from 'bullmq'
import z from 'zod'
import discord from '../services/discord'
import { TextChannel } from 'discord.js'
import {
  getFacilityThreadByThreadChannelId,
  runQuery,
} from '../services/dbAccess'
import redis from '../config/redis'
import { createCompletion } from '../services/mistral'
import prompt from '../prompts/generateCustomerInfoSQL'
import { answerQuestion, dataFetcher } from '../queues'
import knex from 'knex'
// import { answerQuestion } from '../queues'

class JobData extends Job {
  data: {
    threadChannelId: string
    msgId: string
    strAnlNr: string
    distilledQuestion: string
    plan: string
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
    const { threadChannelId, distilledQuestion, plan, strAnlNr, msgId } =
      job.data
    let typingHandle: NodeJS.Timeout
    try {
      const thread = (await discord.channel(threadChannelId)) as TextChannel
      const msg = await thread.messages.fetch(msgId)
      await msg.edit(msg.content + '\nSkapar databasfrågor')

      typingHandle = setInterval(() => {
        thread.sendTyping()
      }, 8000)

      const json_mode = false
      const sqlQueryResponse = await createCompletion(
        [
          {
            role: 'system',
            content: prompt,
          },
          {
            role: 'user',
            content: distilledQuestion + plan,
          },
        ],
        json_mode
      )
      clearInterval(typingHandle)

      const paramValues = {
        strAnlNr,
      }

      const sqlQuery = sqlQueryResponse.choices?.[0].message?.content
      await msg.edit(msg.content + '\nVerifierar databasfrågor...')
      console.log('## MISTRAL DATAFETCHER: ', sqlQuery, '###')

      const json = JSON.parse(sqlQuery)
      console.log('JSON: ', json)
      const parsed = queryStruct.safeParse(json)
      let sql = ''
      if (!parsed.success) {
        if (job.attemptsMade < 3) {
          msg.edit(
            msg.content + '\nAI genererade en felaktig SQL-fråga, försöker igen'
          )
        } else {
          msg.edit(
            msg.content +
              '\nAI genererade en felaktig SQL-fråga, slutar försöka igen'
          )
        }
        throw new Error(String(parsed.error))
      } else {
        const { paramsToReplace } = parsed.data
        sql = parsed.data.sql
        paramsToReplace.forEach((param) => {
          sql = sql.replace(param.placeholder, paramValues[param.param])
        })
        msg.edit(msg.content + '\nKör databasfrågor...')
        console.log('RUNNING THIS SQL:\n\n\n', sql, '\n\n\n')
        const results = await runQuery(sql)
        if (results.length === 0) {
          msg.edit(msg.content + '\nInga resultat hittades')
          answerQuestion.add('answer in thread ' + threadChannelId, {
            threadChannelId,
            msgId,
            strAnlNr,
            distilledQuestion,
            plan,
            sql,
            results: 'Inga resultat hittades: ```json\n[]```',
          })
        } else {
          msg.edit(msg.content + '\nÖversätter resultat...')
          answerQuestion.add('answer in thread ' + threadChannelId, {
            threadChannelId,
            msgId,
            strAnlNr,
            distilledQuestion,
            plan,
            sql,
            results,
          })
        }
        return { sql, distilledQuestion, plan, results }
      }
    } catch (error) {
      clearInterval(typingHandle)
      job.log(`Fel vid dataFetcher för tråd ${threadChannelId}`)
      throw error
    }
  },
  {
    connection: redis,
    autorun: false,
  }
)

export default worker
