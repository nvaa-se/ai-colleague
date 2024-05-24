import { Worker, Job } from 'bullmq'
import discord from '../services/discord'
import { TextChannel } from 'discord.js'
import {
  addReplyToThread,
  getFacilityThreadByThreadChannelId,
  getThreadContents,
  runQuery,
} from '../services/dbAccess'
import redis from '../config/redis'
import { createCompletion } from '../services/openai'
import prompt from '../prompts/reflectToMemory'
import databaseLayout from '../prompts/databaseLayout'
import fieldsDescription from '../prompts/fieldsDescription'
import { z } from 'zod'

class JobData extends Job {
  data: {
    threadChannelId: string
    msgId: string
    distilledQuestion: string
    plan: string
    sql: string
    results: string
    answer: string
  }
}

type ResponseJson = {
  accuracy?: number
  risks?: { description?: string; severity?: string }[]
  improvements?: { description?: string; severity?: string }[]
  improved_sql?: string
}

const queryStruct = z.object({
  accuracy: z.number(),
  risks: z.array(
    z.object({
      description: z.string(),
      severity: z.string(),
    })
  ),
  improvements: z.array(
    z.object({
      description: z.string(),
      severity: z.string(),
    })
  ),
  improved_sql: z.string(),
})

const worker = new Worker(
  'reflectToMemory',
  async (job: JobData) => {
    const { threadChannelId, distilledQuestion, plan, sql, results, answer } =
      job.data
    const thread = (await discord.channel(threadChannelId)) as TextChannel

    const systemPrompt = prompt(distilledQuestion, sql)
    console.log('## MISTRAL PROMPT: ', systemPrompt, distilledQuestion)

    const ai_response = await createCompletion(
      [
        {
          role: 'system',
          content: `Du är en T-SQL-expert och skall analysera och identifiera risker med AI-genererade SQL-frågor. Du kommer få lite information om databasen, frågan från användaren och en SQL-fråga att analyser.`
        },
        {
          role: 'user',
          content: databaseLayout,
        },
        {
          role: 'user',
          content: fieldsDescription,
        },
        {
          role: 'user',
          content: systemPrompt,
        },
      ]
    )

    if (ai_response) {
          if (!ai_response) {
            console.log(JSON.stringify(ai_response, null, 2))
            throw new Error('No ai_response in completion')
          }
          let result: ResponseJson | undefined
          try {
            result = JSON.parse(ai_response)
            result = queryStruct.parse(result)
          } catch(err) {
            throw new Error('Kunde inte tolka svaret från Mistral\n' + err)
          }



          console.log('## MISTRAL ANSWER: ', JSON.stringify(result, null, 2))
          job.log('## MISTRAL ANSWER: ' + JSON.stringify(result, null, 2))
          return result
    } else {
      return 'No response from Mistral'
    }
  },
  {
    connection: redis,
    autorun: false,
  }
)

export default worker
