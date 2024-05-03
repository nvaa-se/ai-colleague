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
    data: string
    distilledQuestion: string
    plan: string
  }
}

const worker = new Worker(
  'answerQuestion',
  async (job: JobData) => {
    const { threadChannelId, msgId, data, distilledQuestion, plan } = job.data
    let typingHandle: NodeJS.Timeout
    try {
      const thread = (await discord.channel(threadChannelId)) as TextChannel
      const msg = await thread.messages.fetch(msgId)
      await msg.edit('Funderar över frågan...')
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
            content: prompt(distilledQuestion, plan),
          },
          {
            role: 'user',
            content: distilledQuestion + plan + data,
          },
        ])
        clearInterval(typingHandle)

        const answer = sqlQueryResponse.choices?.[0].message?.content
        console.log('## MISTRAL ANSWER: ', answer)

        if (answer) {
          thread.send(answer)
        } else {
          msg.edit('Kunde inte förstå frågan, försök igen')
        }
      } else {
        job.log(
          'Kunde inte hitta tråd-koppling till facility, förmodligen timeout'
        )
        msg.edit(
          'Den här konversationen har tagit för lång tid, börja om igen.'
        )
      }
      return 'fake text'
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
