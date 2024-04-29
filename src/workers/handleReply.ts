import { Worker, Job } from 'bullmq'
import discord from '../services/discord'
import { TextChannel } from 'discord.js'
import {
  getFullCustomerInfo,
  getThreadByThreadChannelId,
} from '../services/dbAccess'
import redis from '../config/redis'
import { createCompletion } from '../services/mistral'
import prompt from '../prompts/generateCustomerInfoSQL'

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
      const threadModel = await getThreadByThreadChannelId(threadChannelId)
      if (threadModel) {
        const customer = await getFullCustomerInfo(threadModel.facilityRecnum)

        const thread = (await discord.channel(threadChannelId)) as TextChannel
        thread.sendTyping()
        thread.send(
          `Tack för ditt svar, kunden har ${customer.events.length} händelser och ${customer.facility.AntTj} tjänster.`
        )

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

        thread.send(sqlQuery)
      } else {
        job.log('Kunde inte hitta tråd-koppling till facility')
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
