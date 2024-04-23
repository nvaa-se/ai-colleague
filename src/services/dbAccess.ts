import { ThreadModelFields } from "../models/threadModel";
import db from "./db";
import redis from "./redis";

export const getFacilityByPhone = async (phoneNumber: string) => {
  const possibleCustomers = db.facilities.filter((facility) => (
    facility.strTelefonMobil === phoneNumber ||
      facility.strTelefon === phoneNumber ||
      facility.strTelefonArbete === phoneNumber
  ));
  return possibleCustomers;
}

export const getEventsByFacility = async (facilityStrAnlnr: string) => {
  return db.events.filter((event) => event.strAnlnr === facilityStrAnlnr);
}

export const getTariffs = async () => {
  return db.tariffs;
}

export const getDeviations = async () => {
  return db.deviations;
}

export const getFullCustomerInfo = async (facilityRecnum: number) => {
  const facility = db.facilities.find((facility) => facility.intRecnum === facilityRecnum);
  const events = await getEventsByFacility(facility.strAnlnr);
  const tariffs = await getTariffs();
  const deviations = await getDeviations()
  return {
    facility,
    events,
    tariffs,
    deviations,
  };
}

export const addThread = async (threadChannelId: string, facilityRecnum: number) => {
  try {
    const redisClient = await redis.getClient()
    const res = await redisClient.setEx(`threadFacilityRecnum:${threadChannelId}`, 1440 ,String(facilityRecnum))
    console.log("addThread", res)
    return res
  } catch (error) {
    console.error("addThread", error)
    return error
  }
}

export const getThreadByThreadChannelId = async (threadChannelId: string) => {
  try {
    const redisClient = await redis.getClient();
    const res = await redisClient.get(`threadFacilityRecnum:${threadChannelId}`);
    await redisClient.expire(`threadFacilityRecnum:${threadChannelId}`, 1440)
    const result: ThreadModelFields = {
      facilityRecnum: +res,
      threadChannelId,
    }
    return result
  } catch (error) {
    console.error("getThreadByThreadChannelId", error)
    return error
  }
}

