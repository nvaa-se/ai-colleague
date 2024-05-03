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
    distilledQuestion: string
  }
}

const worker = new Worker(
  'planAnswer',
  async (job: JobData) => {
    const { threadChannelId, msgId, distilledQuestion } = job.data
    let typingHandle: NodeJS.Timeout
    try {
      const thread = (await discord.channel(threadChannelId)) as TextChannel
      const msg = await thread.messages.fetch(msgId)
      await msg.edit(distilledQuestion + '\n\nFunderar över frågan...')
      const threadModel = await getFacilityThreadByThreadChannelId(
        threadChannelId
      )
      if (threadModel) {
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
        msg.edit(distilledQuestion + '\n\nPlanering klar: \n' + plan)
        dataFetcher.add('dataFetcher', {
          threadChannelId,
          msgId,
          distilledQuestion,
          plan,
        })
        return plan
      } else {
        job.log(
          'Kunde inte hitta tråd-koppling till facility, förmodligen timeout'
        )
        msg.edit(
          'Den här konversationen har tagit för lång tid, börja om igen.'
        )
      }
      return 'n/a'
    } catch (error) {
      clearInterval(typingHandle)
      job.log(`Fel vid answerReply för tråd ${threadChannelId}`)
      throw error
    }
  },
  {
    connection: redis,
    autorun: false,
  }
)

export default worker
