import { Worker, Job } from 'bullmq'
import discord from '../services/discord'
import { TextChannel } from 'discord.js'
import { addReplyToThread, getFullCustomerInfo, getFacilityThreadByThreadChannelId, getThreadContents } from '../services/dbAccess'
import redis from "../config/redis";

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
        const botReply = `Tack för ditt svar, kunden har ${customer.events.length} händelser och ${customer.facility.AntTj} tjänster. Tråden har nu ${fullThread.length} meddelanden.`;
        thread.send(botReply)
        await addReplyToThread(threadChannelId, botReply)
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
