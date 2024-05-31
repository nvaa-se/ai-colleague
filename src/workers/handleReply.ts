import { Worker, Job } from 'bullmq'
import discordConfig from '../config/discord'
import discord from '../services/discord'
import { TextChannel } from 'discord.js'
import {
  addReplyToThread,
  getFacilityThreadByThreadChannelId,
} from '../services/dbAccess'
import redis from '../config/redis'
import { summarizeAsk } from '../queues'

class JobData extends Job {
  data: {
    threadChannelId: string
    reply: string
    messageId: string
  }
}

const worker = new Worker(
  'handleReply',
  async (job: JobData) => {
    const { threadChannelId, reply, messageId } = job.data
    try {
      job.log(`handleReply: ${reply}`)

      const thread = (await discord.channel(threadChannelId)) as TextChannel

      const threadModel = await getFacilityThreadByThreadChannelId(
        threadChannelId
      )

      if (threadModel) {
        const mentions = gatherMentions(reply)
        if (
          mentions.length > 0 &&
          !mentions.includes(discordConfig.botUserId)
        ) {
          const message = await thread.messages.fetch(messageId)
          message.react('😎')
          return false
        }
        thread.sendTyping()
        await addReplyToThread(threadChannelId, reply, 'user')
        const msg = await thread.send('Sparar frågan...')
        summarizeAsk.add('answer reply in thread ' + threadChannelId, {
          threadChannelId,
          strAnlNr: threadModel.facilityRecnum,
          msgId: msg.id,
        })
      } else {
        job.log('Kunde inte hitta tråd-koppling till facility')
        const message = await thread.messages.fetch(messageId)
        message.react('😴')
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

const gatherMentions = (reply: string): string[] => {
  const regex = new RegExp('<@(?<userid>\\d+)>', 'gm')

  const result: string[] = []
  let m

  while ((m = regex.exec(reply)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }

    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      if (groupIndex === 1) {
        result.push(match)
      }
    })
  }
  return result
}

export default worker
