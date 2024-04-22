import { parse } from 'csv-parse'
import fs from 'fs/promises'
import path from "path";

import {
  DeviationsModel,
  DeviationsFields,
  TariffsModel,
  TariffsFields,
  EventsModel,
  EventsFields,
  FacilitiesModel,
  FacilitiesFields,
} from "./dbModels"

const fields = {
  deviations: DeviationsFields,
  tariffs: TariffsFields,
  events: EventsFields,
  facilities: FacilitiesFields,
}

const files = {
  deviations: '../../data/deviations.csv',
  tariffs: '../../data/tariffs.csv',
  events: '../../data/one_customer_events.csv',
  facilities: '../../data/one_customer_facilities.csv',
}

type InMemDB = {
  deviations: DeviationsModel[]
  tariffs: TariffsModel[]
  events: EventsModel[]
  facilities: FacilitiesModel[]
}
type InMemDBKey = keyof InMemDB
export class DB {
  db: InMemDB = {
    deviations: [],
    tariffs: [],
    events: [],
    facilities: [],
  };

  constructor() {}

  get deviations() {
    return this.db.deviations;
  }
  get tariffs() {
    return this.db.tariffs;
  }
  get events() {
    return this.db.events;
  }
  get facilities() {
    return this.db.facilities;
  }

  async init() {
    console.log("DB Init");
    await this.copyRawToDB("deviations", files.deviations);
    await this.copyRawToDB("tariffs", files.tariffs);
    await this.copyRawToDB("events", files.events);
    await this.copyRawToDB("facilities", files.facilities);
    console.log("DB Init done");
  }

  async copyRawToDB(dbName: InMemDBKey, csvRawFile: string) {
    const absFilePath = path.resolve(__dirname, csvRawFile);
    console.log("Initializing DB", dbName);
    const content = await fs.readFile(absFilePath);
    const records = parse(content, {
      bom: true,
      encoding: "utf-8",
      delimiter: ";",
      columns: true,
    });
    const fieldsDef = fields[dbName];
    await records.forEach(async (record) => {
      fieldsDef.forEach((field) => {
        if(record[field] === 'NULL') {
          record[field] = null;
        } else {
          const fieldType = field.substring(0, 3);
          switch (fieldType) {
            case "Ant":
            case "rec":
            case "cur":
            case "int":
              record[field] = parseInt(record[field]);
              break;
            case "dec":
              record[field] = parseFloat(record[field]);
              break;
            case "lng":
              record[field] = BigInt(record[field]);
              break;
            case "bol":
              record[field] = record[field] === "1";
              break;
            case "dat":
              record[field] = new Date(record[field]);
              break;
            case "str":
            case "Anl":
              break;
            default:
              // console.error("Unknown field type", fieldType, field, record[field]);
              break;
          }
        }
      });
      this.db[dbName].push(record);
    });
  }
}


export default new DB()

