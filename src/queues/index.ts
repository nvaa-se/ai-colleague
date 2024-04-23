import { Queue, QueueOptions } from 'bullmq'
import redis from '../config/redis'

const options: QueueOptions = {
  connection: redis,
  defaultJobOptions: { removeOnComplete: false },
}

const handleCall = new Queue('handleCall', options)
const handleReply = new Queue('handleReply', options)

export {
  handleCall,
  handleReply,
}
