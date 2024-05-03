import { Worker, Job } from 'bullmq'
import discord from '../services/discord'
import { TextChannel } from 'discord.js'
import { getFacilityThreadByThreadChannelId } from '../services/dbAccess'
import redis from '../config/redis'
import { createCompletion } from '../services/mistral'
import prompt from '../prompts/generateCustomerInfoSQL'
// import { answerQuestion } from '../queues'

class JobData extends Job {
  data: {
    threadChannelId: string
    msgId: string
    distilledQuestion: string
    plan: string
  }
}

const worker = new Worker(
  'dataFetcher',
  async (job: JobData) => {
    console.log('DATAFETCHER JOB: ', job.data)
    const { threadChannelId, msgId, distilledQuestion, plan } = job.data
    let typingHandle: NodeJS.Timeout
    try {
      const thread = (await discord.channel(threadChannelId)) as TextChannel
      const msg = await thread.send('Testkör planen i steg...')
      const threadModel = await getFacilityThreadByThreadChannelId(
        threadChannelId
      )
      if (threadModel) {
        const { facilityRecnum } = threadModel
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
            content: distilledQuestion + plan,
          },
        ])
        clearInterval(typingHandle)

        const sqlQueries = sqlQueryResponse.choices?.[0].message?.content
        console.log('## MISTRAL DATAFETCHER: ', sqlQueries)
        msg.edit(msg.content + '\n\n`' + sqlQueries + '`')

        if (sqlQueries) {
          // RUN QUERIES
          // const queries = sqlQueries.split('\n')
          // const results = await Promise.all(
          //   queries.map(async (query) => {
          //     const result = await runQuery(query, facilityRecnum)
          //     return result
          //   })
          // )
          // answerQuestion.add('answerQuestion', {
          //   threadChannelId,
          //   msgId,
          //   distilledQuestion,
          //   plan,
          //   data: results,
          // })
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
