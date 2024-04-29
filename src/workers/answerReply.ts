import { Worker, Job } from 'bullmq'
import discord from '../services/discord'
import { TextChannel } from 'discord.js'
import { addReplyToThread, getFullCustomerInfo, getFacilityThreadByThreadChannelId, getThreadContents } from '../services/dbAccess'
import redis from "../config/redis";
import { createCompletion } from '../services/mistral'
import prompt from '../prompts/generateCustomerInfoSQL'

class JobData extends Job {
  data: {
    threadChannelId: string
  }
}

const worker = new Worker(
  'answerReply',
  async (job: JobData) => {
    const { threadChannelId } = job.data
    try {
      const thread = await discord.channel(threadChannelId) as TextChannel
      const threadModel = await getFacilityThreadByThreadChannelId(threadChannelId)
      if(threadModel) {
        const customer = await getFullCustomerInfo(threadModel.facilityRecnum)
        thread.sendTyping()
        const fullThread = await getThreadContents(threadChannelId)
        // const botReply = `Tack för ditt svar, kunden har ${customer.events.length} händelser och ${customer.facility.AntTj} tjänster. Tråden har nu ${fullThread.length} meddelanden.`
        // Embeddings
        // 1. Prompten
        // 2. Exempel på data
        // Message array
        // system
        // user
        // mistral svarar med sql-fråga som vi kör
        console.log('Mistral completion')

        const sqlQueryResponse = await createCompletion([
          {
            role: 'system',
            content: prompt,
          },
          {
            role: 'user',
            content: JSON.stringify(fullThread)
          }
        ])

        const mistralResponse = sqlQueryResponse.choices?.[0].message?.content

        console.log('Mistral response', mistralResponse)


        thread.send(mistralResponse)
        await addReplyToThread(threadChannelId, mistralResponse)
      } else {
        job.log("Kunde inte hitta tråd-koppling till facility, förmodligen timeout")
        thread.send('Den här konversationen har tagit för lång tid, börja om igen.')
      }
      return 'fake text'
    } catch (error) {
      job.log(
        `Fel vid answerReply för tråd ${threadChannelId}`
      );
      throw error
    }
  },
  {
    connection: redis,
    autorun: false,
  }
)

export default worker
