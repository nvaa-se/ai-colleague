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
})

const worker = new Worker(
  'dataFetcher',
  async (job: JobData) => {
    console.log(`DATAFETCHER JOB, Attempt #${job.attemptsMade}`, job.data)
    console.log(`DATAFETCHER JOB, Attempt #${job.attemptsMade}` + job.data)
    const { threadChannelId, distilledQuestion, plan, strAnlNr, msgId } =
      job.data
    let typingHandle: NodeJS.Timeout
    try {
      const thread = (await discord.channel(threadChannelId)) as TextChannel
      const msg = await thread.messages.fetch(msgId)
      console.log('Skapar databasfrågor')

      typingHandle = setInterval(() => {
        thread.sendTyping()
      }, 8000)

      const json_mode = true
      let brokenSql = ''
      let sqlError = ''
      let userPrompt = distilledQuestion
      let sql = undefined
      let json = undefined
      let results = []
      let parsed: z.SafeParseReturnType<any, any> | undefined = undefined
      let queryGenerationAttempts = 0
      const attemptLimit = 10
      while (!json || !parsed?.success) {
        // ESCAPE LOOP IF TOO MANY ATTEMPTS
        if (queryGenerationAttempts >= attemptLimit) {
          msg.edit(`För många försök... kunde inte skapa en korrekt SQL-fråga`)
          throw new Error('Too many attempts')
        }

        // GENERATE SQL QUERY RESPONSE
        try {
          let attempt = ` försök ${queryGenerationAttempts + 1}/${attemptLimit}`
          let systemPrompt = sqlPrompt(brokenSql, sqlError)

          await msg.edit(`Skapar databasfrågor... ${attempt}`)
          const sqlQueryJsonResponse = await createCompletion(
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
          await msg.edit(`Verifierar databasfrågor... ${attempt}`)

          // VERIFY VALID JSON
          const sqlQueryJson =
            sqlQueryJsonResponse.choices?.[0].message?.content
          json = JSON.parse(sqlQueryJson)
          console.log('JSON: ', json)

          // EXTRACT SQL FROM JSON
          parsed = queryStruct.safeParse(json)
          if (!parsed?.success) {
            msg.edit(`Felaktig JSON... ${attempt}`)
            console.log('Felaktig JSON: ' + JSON.stringify(parsed.error))
            userPrompt =
              userPrompt +
              '\n\nFelaktig JSON, försök igen: ' +
              JSON.stringify(parsed.error) +
              '\n\n' +
              'JSONförsöket: \n' +
              json
            throw new Error('Felaktig JSON, försök igen')
          }
          sql = parsed.data.sql
          console.log('SQL: ' + sql)

          // VERIFY SQL CONTAINS PARAMETER STRANLNR
          if (!sql.includes('@strAnlnr') && !sql.includes(strAnlNr)) {
            throw new Error(
              'SQL does not contain @strAnlnr or ' +
                strAnlNr +
                ' as a parameter: ' +
                sql
            )
          }

          // REPLACE PARAMETER STRANLNR WITH ACTUAL VALUE
          sql = sql.replaceAll('@strAnlnr', strAnlNr)
          console.log('SQL med parametrar: ' + sql)
          msg.edit(`Kör databasfrågor... ${attempt}`)
          console.log('Kör databasfrågor...')
          console.log('RUNNING THIS SQL:\n\n\n', sql, '\n\n\n')

          // TEST SQL BY RUNNING QUERY IN SERVER
          brokenSql = ''
          sqlError = ''
          try {
            results = await runQuery(sql)
            console.log('SQL-Resultat: ' + JSON.stringify(results))
          } catch (error) {
            // HANDLE SQL ERROR
            sqlError = String(error)
            brokenSql = sql
            console.log('Fel vid databasfrågor' + sqlError)
            msg.edit(`Fel vid databasfrågor... ${attempt}`)
            throw new Error('Fel vid databasfrågor')
          }
        } catch (error) {
          queryGenerationAttempts++
          console.log('Fel vid databasfrågor: ' + error)
          json = undefined
          parsed = undefined
          sql = undefined
          results = []
        }
      }
      clearInterval(typingHandle)
      console.log('Klar med databasfrågor')
      msg.edit(`Fått ett resultat från databasen...`)
      if (results.length === 0) {
        msg.edit(
          'Hittade inga relevanta rader i databasen för SQL-frågan\n\n' + sql
        )
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
    } catch (error) {
      clearInterval(typingHandle)
      console.error(`Fel vid dataFetcher för tråd ${threadChannelId}`, error)
      console.log(`Fel vid dataFetcher för tråd ${threadChannelId}` + error)
      throw error
    }
  },
  {
    connection: redis,
    autorun: false,
  }
)

export default worker
