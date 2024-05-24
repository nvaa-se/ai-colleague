import { Queue, QueueOptions } from 'bullmq'
import redis from '../config/redis'

const options: QueueOptions = {
  connection: redis,
  defaultJobOptions: { removeOnComplete: false },
}

const handleCommandSamtal = new Queue('handleCommandSamtal', options)
const handleReply = new Queue('handleReply', options)
const summarizeAsk = new Queue('summarizeAsk', options)
const planAnswer = new Queue('planAnswer', options)
const dataFetcher = new Queue('dataFetcher', options)
const answerQuestion = new Queue('answerQuestion', options)
const reflectToMemory = new Queue('reflectToMemory', options)

export {
  handleCommandSamtal,
  handleReply,
  summarizeAsk,
  planAnswer,
  dataFetcher,
  answerQuestion,
  reflectToMemory,
}
