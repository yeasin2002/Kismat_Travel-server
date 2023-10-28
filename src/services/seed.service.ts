import airports from "@data/airports-data.json";
import { db } from "@db";
import { Service } from "typedi";

@Service()
export class SeedService {
  public async seedAirports() {
    await db.Airports.bulkCreate(airports, { validate: true });
  }
}
