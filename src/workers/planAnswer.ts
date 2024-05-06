import { Worker, Job } from 'bullmq'
import discord from '../services/discord'
import { TextChannel } from 'discord.js'
import { getFacilityThreadByThreadChannelId } from '../services/dbAccess'
import redis from '../config/redis'
import { createCompletion } from '../services/mistral'
import prompt from '../prompts/planAnswer'
import { dataFetcher } from '../queues'

class JobData extends Job {
  data: {
    threadChannelId: string
    msgId: string
    strAnlNr: string
    distilledQuestion: string
  }
}

const worker = new Worker(
  'planAnswer',
  async (job: JobData) => {
    const { threadChannelId, msgId, distilledQuestion, strAnlNr } = job.data
    let typingHandle: NodeJS.Timeout
    try {
      const thread = (await discord.channel(threadChannelId)) as TextChannel
      const msg = await thread.messages.fetch(msgId)
      await msg.edit(
        msg.content + '\nPlanerar hur jag kan komma fram till svaret...'
      )
      typingHandle = setInterval(() => {
        thread.sendTyping()
      }, 8000)

      const sqlQueryResponse = await createCompletion([
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: distilledQuestion,
        },
      ])
      clearInterval(typingHandle)

      const plan = sqlQueryResponse.choices?.[0].message?.content
      console.log('## MISTRAL PLAN: ', plan)
      msg.edit(msg.content + '\nPlanering klar.')
      dataFetcher.add(
        'dataFetcher',
        {
          threadChannelId,
          msgId,
          distilledQuestion,
          plan,
          strAnlNr,
        },
        {
          attempts: 3,
        }
      )
      return { plan }
    } catch (error) {
      clearInterval(typingHandle)
      job.log(`Fel vid planAnswer för tråd ${threadChannelId}`)
      throw error
    }
  },
  {
    connection: redis,
    autorun: false,
  }
)

export default worker
