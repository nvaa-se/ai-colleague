import { parse } from 'csv-parse'
import fs from 'fs/promises'
import path from "path";

import {
  DeviationModel,
  DeviationFields,
  TariffModel,
  TariffFields,
  EventModel,
  EventFields,
  FacilityModel,
  FacilityFields,
} from "../models"
import { ThreadModel } from '../models/threadModel';

const fields = {
  deviations: DeviationFields,
  tariffs: TariffFields,
  events: EventFields,
  facilities: FacilityFields,
}

const files = {
  deviations: '../../data/deviations.csv',
  tariffs: '../../data/tariffs.csv',
  events: '../../data/one_customer_events.csv',
  facilities: '../../data/one_customer_facilities.csv',
}

type CSVMemDB = {
  // CSV data
  deviations: DeviationModel[]
  tariffs: TariffModel[]
  events: EventModel[]
  facilities: FacilityModel[]
}
type CSVMemDBKey = keyof CSVMemDB

type InMemDB = {
  threads: ThreadModel
}
export class DB {
  csvDb: CSVMemDB = {
    // CSV Read Only DB
    deviations: [],
    tariffs: [],
    events: [],
    facilities: [],
  };

  memDb: InMemDB = {
    // In Memory Mutable DB
    threads: {}
  }

  constructor() {}

  get deviations() {
    return this.csvDb.deviations as readonly DeviationModel[];
  }
  get tariffs() {
    return this.csvDb.tariffs as readonly TariffModel[];
  }
  get events() {
    return this.csvDb.events as readonly EventModel[];
  }
  get facilities() {
    return this.csvDb.facilities as readonly FacilityModel[];
  }

  get threads() {
    return this.memDb.threads;
  }

  async init() {
    console.log("DB Init");
    await this.copyRawToDB("deviations", files.deviations);
    await this.copyRawToDB("tariffs", files.tariffs);
    await this.copyRawToDB("events", files.events);
    await this.copyRawToDB("facilities", files.facilities);
    console.log("DB Init done");
  }

  async copyRawToDB(dbName: CSVMemDBKey, csvRawFile: string) {
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
      this.csvDb[dbName].push(record);
    });
  }
}


export default new DB()

