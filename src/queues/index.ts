import { Queue, QueueOptions } from 'bullmq'
import redis from '../config/redis'

const options: QueueOptions = {
  connection: redis,
  defaultJobOptions: { removeOnComplete: false },
}

const handleCommandSamtal = new Queue('handleCommandSamtal', options)
const handleReply = new Queue('handleReply', options)
const answerReply = new Queue('answerReply', options)

export { handleCommandSamtal, handleReply, answerReply };
