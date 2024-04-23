// import { Worker, Job } from 'bullmq'
// import redis from '../config/redis'
// import OpenAI from 'openai'
// import prompt from '../prompts/parsePDF'
// import { reflectOnAnswer } from '../queues'

// const openai = new OpenAI(config)

// class JobData extends Job {
//   data: {
//     url: string
//     paragraphs: string[]
//     channelId: string
//     messageId: string
//     pdfHash: string
//   }
// }

// const worker = new Worker(
//   'parseText',
//   async (job: JobData) => {
//     const pdfParagraphs = job.data.paragraphs
//     job.log(`Asking AI for following context and prompt: ${pdfParagraphs.join(
//       '\n\n'
//     )}
//     ${prompt}`)

//     const stream = await openai.chat.completions.create({
//       messages: [
//         { role: 'system', content: prompt },
//         { role: 'user', content: pdfParagraphs.join('\n\n') },
//       ],
//       model: 'gpt-4-1106-preview',
//       stream: true,
//     })
//     let response = ''
//     let progress = 0
//     for await (const part of stream) {
//       response += part.choices[0]?.delta?.content || ''
//       job.updateProgress(Math.min(1, progress / 400))
//     }

//     job.log(response)

//     reflectOnAnswer.add(
//       'reflect on answer ' + response.slice(0, 20),
//       {
//         answer: response,
//         url: job.data.url,
//         paragraphs: pdfParagraphs,
//         channelId: job.data.channelId,
//         messageId: job.data.messageId,
//         pdfHash: job.data.pdfHash,
//       },
//       {
//         attempts: 3,
//       }
//     )

//     // Do something with job
//     return response
//   },
//   {
//     concurrency: 10,
//     connection: redis,
//     autorun: false,
//   }
// )

// export default worker
