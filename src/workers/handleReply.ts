import { Worker, Job } from 'bullmq'
import discord from '../services/discord'
import { TextChannel } from 'discord.js'
import {
  getFullCustomerInfo,
  getThreadByThreadChannelId,
  addReplyToThread,
  getFacilityThreadByThreadChannelId,
} from '../services/dbAccess'
import redis from '../config/redis'
import { createCompletion } from '../services/mistral'
import prompt from '../prompts/generateCustomerInfoSQL'
import { answerReply } from '../queues'

class JobData extends Job {
  data: {
    threadChannelId: string
    reply: string
  }
}

const worker = new Worker(
  'handleReply',
  async (job: JobData) => {
    const { threadChannelId, reply } = job.data
    try {
      job.log(`handleReply: ${reply}`)
      const thread = (await discord.channel(threadChannelId)) as TextChannel
      thread.sendTyping()

      const threadModel = await getFacilityThreadByThreadChannelId(
        threadChannelId
      )
      if (threadModel) {
        await addReplyToThread(threadChannelId, reply)
        answerReply.add('answer reply in thread ' + threadChannelId, {
          threadChannelId,
        })

        // Embeddings
        // 1. Prompten
        // 2. Exempel på data
        // Message array
        // system
        // user
        // mistral svarar med sql-fråga som vi kör
        thread.sendTyping()
        console.log('Mistral completion')

        const sqlQueryResponse = await createCompletion([
          {
            role: 'system',
            content: prompt,
          },
        ])

        const sqlQuery = sqlQueryResponse.choices?.[0].message?.content

        console.log('Mistral response', sqlQuery)
      } else {
        job.log('Kunde inte hitta tråd-koppling till facility')
        thread.send('Tråden för gammal, starta en ny tråd')
      }
      return 'fake text'
    } catch (error) {
      job.log(
        `Fel vid handleReply av svar ${reply} för tråd ${threadChannelId}`
      )
      throw error
    }
  },
  {
    connection: redis,
    autorun: false,
  }
)

export default worker
