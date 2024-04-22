import db from "./db";

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

