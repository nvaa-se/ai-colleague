import { Worker, Job } from 'bullmq'
import discord from '../services/discord'
import { TextChannel } from 'discord.js'
import {
  getFacilityThreadByThreadChannelId,
  getThreadContents,
} from '../services/dbAccess'
import redis from '../config/redis'
import { createCompletion } from '../services/mistral'
import prompt from '../prompts/summarizeAsk'
import { planAnswer } from '../queues'

class JobData extends Job {
  data: {
    threadChannelId: string
    strAnlNr: string
    msgId: string
  }
}

const worker = new Worker(
  'summarizeAsk',
  async (job: JobData) => {
    const { threadChannelId, msgId, strAnlNr } = job.data
    let typingHandle: NodeJS.Timeout
    try {
      const thread = (await discord.channel(threadChannelId)) as TextChannel
      const msg = await thread.messages.fetch(msgId)
      await msg.edit('Funderar över frågan...')

      typingHandle = setInterval(() => {
        thread.sendTyping()
      }, 8000)

      const fullThread = await getThreadContents(threadChannelId)

      const partThread = JSON.stringify([
        fullThread[0],
        fullThread[1],
        fullThread[fullThread.length - 1],
      ])

      const sqlQueryResponse = await createCompletion([
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: partThread,
        },
      ])
      clearInterval(typingHandle)

      const distilledQuestion = sqlQueryResponse.choices?.[0].message?.content
      console.log('## MISTRAL SUMMARIZE: ', distilledQuestion)

      if (distilledQuestion) {
        planAnswer.add('answer in thread ' + threadChannelId, {
          threadChannelId,
          msgId,
          strAnlNr,
          distilledQuestion,
        })
        return { distilledQuestion }
      } else {
        msg.edit('Kunde inte förstå frågan, försök igen')
      }
    } catch (error) {
      clearInterval(typingHandle)
      job.log(`Fel vid summarizeAsk för tråd ${threadChannelId}`)
      throw error
    }
  },
  {
    connection: redis,
    autorun: false,
  }
)

export default worker
