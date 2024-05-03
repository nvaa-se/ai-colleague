import { ThreadModelFields } from '../models/threadModel'
//import db from './db'
import redis from './redis'
import knex from 'knex'
import config from '../config/sqlserver'

console.log({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  port: config.port,
  timezone: 'UTC',
  dateStrings: true,
})

const db = knex({
  client: 'mssql',
  connection: {
    type: 'ntlm',
    server: config.host,
    domain: 'KOMMUN',
    userName: config.user,
    password: config.password,
    database: config.database,
    port: config.port,
  },
})

const redisPrefixes = {
  threadFacilityRecnum: 'threadFacilityRecnum',
  threadReplies: 'threadReplies',
}
const EXPIRY = 1440

export const getFacilityByPhone = async (phoneNumber: string) => {
  const possibleCustomers = await db
    .table('vwAnlaggning')
    .where('strAnlnr', phoneNumber)

  return possibleCustomers
}

export const getEventsByFacility = async (facilityStrAnlnr: string) => {
  const events = await db
    .table('tbFuHandelse')
    .where('strAnlnr', facilityStrAnlnr)
  return events
}

export const getTariffs = async () => {
  return await db.table('tbFuTaxa')
}

export const getDeviations = async () => {
  return await db.table('tbFuRenhAvvikelse')
}

export const getFullCustomerInfo = async (facilityRecnum: number) => {
  const facility = (
    await db.table('vwAnlaggning').where('intRecnum', facilityRecnum)
  )[0]

  const events = await getEventsByFacility(facility)
  const tariffs = await getTariffs()
  const deviations = await getDeviations()
  return {
    facility,
    events,
    tariffs,
    deviations,
  }
}

export const addReplyToThread = async (
  threadChannelId: string,
  reply: string
) => {
  const redisClient = await redis.getClient()
  const res = await redisClient.rPush(
    `${redisPrefixes.threadReplies}:${threadChannelId}`,
    reply
  )
  const res2 = await redisClient.expire(
    `${redisPrefixes.threadReplies}:${threadChannelId}`,
    EXPIRY
  )
  console.log('addReplyToThread', reply, res)
  return res
}

export const getThreadContents = async (threadChannelId: string) => {
  const redisClient = await redis.getClient()
  const res = await redisClient.lRange(
    `${redisPrefixes.threadReplies}:${threadChannelId}`,
    0,
    -1
  )
  if (!res) {
    return []
  }
  const res2 = await redisClient.expire(
    `${redisPrefixes.threadReplies}:${threadChannelId}`,
    EXPIRY
  )
  console.log('getThreadContent', res.length)
  return res
}

export const addThread = async (
  threadChannelId: string,
  facilityRecnum: number
) => {
  const redisClient = await redis.getClient()
  const res = await redisClient.setEx(
    `${redisPrefixes.threadFacilityRecnum}:${threadChannelId}`,
    EXPIRY,
    String(facilityRecnum)
  )
  console.log('addThread', res)
  return res
}

export const getFacilityThreadByThreadChannelId = async (
  threadChannelId: string
) => {
  const redisClient = await redis.getClient()
  const res = await redisClient.get(
    `${redisPrefixes.threadFacilityRecnum}:${threadChannelId}`
  )
  console.log('getFacilityThreadByThreadChannelId', res)
  await redisClient.expire(
    `${redisPrefixes.threadFacilityRecnum}:${threadChannelId}`,
    EXPIRY
  )
  if (!res) {
    return null
  }
  const result: ThreadModelFields = {
    facilityRecnum: +res,
    threadChannelId,
  }
  return result
}
