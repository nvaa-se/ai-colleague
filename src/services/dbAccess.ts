import { ThreadModelFields } from '../models/threadModel'
import redis from './redis'
import knex from 'knex'
import config from '../config/sqlserver'

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
const EXPIRY = 1440 * 60 // 24 hours

export const runQuery = async (query: string) => {
  return db.raw(query)
}

export const getFacilityByStrAnlNr = async (strAnlNr: string) => {
  const possibleCustomers = await db
    .table('vwAnlaggning')
    .where('strAnlnr', strAnlNr)

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

  const events = await getEventsByFacility(facility.strAnlnr)
  const tariffs = await getTariffs()
  const deviations = await getDeviations()
  return {
    facility,
    events,
    tariffs,
    deviations,
  }
}

type Role = 'assistant' | 'user' | 'system'

export const addReplyToThread = async (
  threadChannelId: string,
  reply: string,
  role: Role = 'assistant'
) => {
  const redisClient = await redis.getClient()
  const res = await redisClient.rPush(
    `${redisPrefixes.threadReplies}:${threadChannelId}`,
    JSON.stringify({ role, content: reply })
  )
  await extendThreadLifeTime(threadChannelId)
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
  await extendThreadLifeTime(threadChannelId)
  return res
}

export const addThread = async (threadChannelId: string, strAnlNr: string) => {
  console.log('ADDING THREAD TO REDIS', threadChannelId, strAnlNr)
  const redisClient = await redis.getClient()
  const res = await redisClient.setEx(
    `${redisPrefixes.threadFacilityRecnum}:${threadChannelId}`,
    EXPIRY,
    strAnlNr
  )
  return res
}

export const extendThreadLifeTime = async (threadChannelId: string) => {
  const redisClient = await redis.getClient()
  const threadKey = `${redisPrefixes.threadFacilityRecnum}:${threadChannelId}`
  const contextKey = `${redisPrefixes.threadReplies}:${threadChannelId}`
  await redisClient.expire(threadKey, EXPIRY)
  await redisClient.expire(contextKey, EXPIRY)
}

export const getFacilityThreadByThreadChannelId = async (
  threadChannelId: string
) => {
  const redisClient = await redis.getClient()
  const res = await redisClient.get(
    `${redisPrefixes.threadFacilityRecnum}:${threadChannelId}`
  )
  await extendThreadLifeTime(threadChannelId)
  if (!res) {
    return null
  }
  const result: ThreadModelFields = {
    facilityRecnum: res,
    threadChannelId,
  }
  return result
}
