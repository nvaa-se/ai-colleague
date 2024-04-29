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
  const possibleCustomers = db
    .table('vwAnlaggning')
    .where('strAnlnr', phoneNumber)

  return possibleCustomers
}

export const getEventsByFacility = async (facilityStrAnlnr: string) => {
  return []
  //return db.events.filter((event) => event.strAnlnr === facilityStrAnlnr)
}

export const getTariffs = async () => {
  return []
  //return db.tariffs
}

export const getDeviations = async () => {
  return []
  //return db.deviations
}

export const getFullCustomerInfo = async (facilityRecnum: number) => {
  return {}
  /*const facility = db.facilities.find(
    (facility) => facility.intRecnum === facilityRecnum
  )
  const events = await getEventsByFacility(facility.strAnlnr)
  const tariffs = await getTariffs()
  const deviations = await getDeviations()
  return {
    facility,
    events,
    tariffs,
    deviations,
  }*/
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
