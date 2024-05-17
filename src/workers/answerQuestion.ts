import { Worker, Job } from 'bullmq'
import discord from '../services/discord'
import { TextChannel } from 'discord.js'
import {
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
    try {
      const thread = (await discord.channel(threadChannelId)) as TextChannel
      const msg = await thread.messages.fetch(msgId)
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
        { max_tokens: 256 }
      )
      clearInterval(typingHandle)

      const answer = sqlQueryResponse.choices?.[0].message?.content
      console.log('## MISTRAL ANSWER: ', answer)

      if (answer) {
        await msg.edit(answer)
      } else {
        await msg.edit(msg.content + '\nKunde inte förstå frågan, försök igen')
      }
      return 'fake text'
    } catch (error) {
      clearInterval(typingHandle)
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
