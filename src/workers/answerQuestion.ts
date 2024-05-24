import { Worker, Job } from 'bullmq'
import discord from '../services/discord'
import { TextChannel } from 'discord.js'
import {
  addReplyToThread,
  getFacilityThreadByThreadChannelId,
  getThreadContents,
} from '../services/dbAccess'
import redis from '../config/redis'
import { createCompletion } from '../services/mistral'
import prompt from '../prompts/answerQuestion'

class JobData extends Job {
  data: {
    threadChannelId: string
    msgId: string
    distilledQuestion: string
    plan: string
    sql
    results
  }
}

const worker = new Worker(
  'answerQuestion',
  async (job: JobData) => {
    const { threadChannelId, msgId, distilledQuestion, plan, sql, results } =
      job.data
    let typingHandle: NodeJS.Timeout
    const thread = (await discord.channel(threadChannelId)) as TextChannel
    const msg = await thread.messages.fetch(msgId)
    try {
      typingHandle = setInterval(() => {
        thread.sendTyping()
      }, 8000)

      const systemPrompt = prompt(results, plan, sql)
      console.log('## MISTRAL PROMPT: ', systemPrompt, distilledQuestion)
      const sqlQueryResponse = await createCompletion(
        [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: distilledQuestion,
          },
        ],
        false,
        2048
        // , 'open-mixtral-8x22b'
      )
      clearInterval(typingHandle)
      if (sqlQueryResponse) {
        switch (sqlQueryResponse.object) {
          case 'error':
            msg.edit('Kunde inte svara på frågan: ' + sqlQueryResponse.message)
            break
          case 'chat.completion':
            const answer = sqlQueryResponse.choices?.[0]?.message?.content
            if (!answer) {
              console.log(JSON.stringify(sqlQueryResponse, null, 2))
              throw new Error('No answer in completion')
            }
            console.log('## MISTRAL ANSWER: ', answer)
            await msg.edit(answer)
            await addReplyToThread(thread.id, answer, 'assistant')
            break
          default:
            msg.edit(
              `Förstod inte formatet på svaret. {object: '${sqlQueryResponse.object}'} är inte implementerat. Kontakta utvecklare.`
            )
            job.log('Unhandled response from Mistral:')
            job.log(JSON.stringify(sqlQueryResponse, null, 2))
            throw new Error('Unhandled response from Mistral')
        }
      }

      return 'fake text'
    } catch (error) {
      clearInterval(typingHandle)
      msg.edit('Kraschade när jag skulle svara på frågan, försök igen')
      job.log(`Fel vid answerQuestion för tråd ${threadChannelId}`)
      throw error
    }
  },
  {
    connection: redis,
    autorun: false,
  }
)

export default worker
