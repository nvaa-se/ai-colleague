import { Worker, Job } from 'bullmq'
import redis from '../config/redis'
import OpenAI from 'openai'
import previousPrompt from '../prompts/parsePDF'
import prompt from '../prompts/reflect'
import { discordReview } from '../queues'
import discord from '../services/discord'
import { TextChannel } from 'discord.js'

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
})

class JobData extends Job {
  data: {
    url: string
    paragraphs: string[]
    answer: string
    channelId: string
    messageId: string
    pdfHash: string
  }
}

const worker = new Worker(
  'reflectOnAnswer',
  async (job: JobData) => {
    const pdfParagraphs = job.data.paragraphs
    const answer = job.data.answer
    const channel = (await discord.client.channels.fetch(
      job.data.channelId
    )) as TextChannel
    const message = await channel.messages.fetch(job.data.messageId)
    await message.edit(`Verifierar information...`)
    job.log(`Reflecting on: 
${answer}
--- Prompt:
${prompt}`)

    const stream = await openai.chat.completions.create({
      messages: [
        { role: 'user', content: pdfParagraphs.join('\n\n') },
        {
          role: 'user',
          content: 'From URL: ' + job.data.url,
        },
        { role: 'user', content: previousPrompt },
        { role: 'system', content: job.data.answer },
        { role: 'user', content: prompt },
      ],
      model: 'gpt-4-1106-preview',
      stream: true,
    })
    let response = ''
    let progress = 0
    for await (const part of stream) {
      progress += 1
      response += part.choices[0]?.delta?.content || ''
      job.updateProgress(Math.min(100, (100 * progress) / 400))
    }

    const json =
      response
        .match(/```json(.|\n)*```/)[0]
        ?.replace(/```json|```/g, '')
        .trim() || '{}'

    const parsedJson = JSON.parse(json) // we want to make sure it's valid JSON- otherwise we'll get an error which will trigger a new retry

    const companyName = parsedJson.companyName

    job.updateData({ title: companyName })

    await message.edit(`Klart! Skickar till Discord för granskning`)
    discordReview.add(companyName, {
      json: JSON.stringify(parsedJson, null, 2) || '{"Error": "No JSON found"}',
      url: job.data.url,
      channelId: job.data.channelId,
      messageId: job.data.messageId,
      pdfHash: job.data.pdfHash,
    })

    // Do something with job
    return response
  },
  {
    concurrency: 10,
    connection: redis,
    autorun: false,
  }
)

export default worker
