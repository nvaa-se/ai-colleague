import { Queue, QueueOptions } from 'bullmq'
import redis from '../config/redis'

const options: QueueOptions = {
  connection: redis,
  defaultJobOptions: { removeOnComplete: false },
}

const getCustomer = new Queue('getCustomer', options)

// -- KLIMATKOLLEN BELOW --
const downloadPDF = new Queue('downloadPDF', options)
const parseText = new Queue('parseText', options)
const splitText = new Queue('splitText', options)
const indexParagraphs = new Queue('indexParagraphs', options)
const searchVectors = new Queue('searchVectors', options)
const reflectOnAnswer = new Queue('reflectOnAnswer', options)
const discordReview = new Queue('discordReview', options)
const userFeedback = new Queue('userFeedback', options)

export {
  getCustomer,
  // -- KLIMATKOLLEN BELOW --
  downloadPDF,
  parseText,
  splitText,
  indexParagraphs,
  searchVectors,
  reflectOnAnswer,
  discordReview,
  userFeedback,
}
