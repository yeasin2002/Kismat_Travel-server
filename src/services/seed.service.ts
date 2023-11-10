import airports from "@data/airports-data.json";
import { db } from "@db";
import { Service } from "typedi";

@Service()
export class SeedService {
  public async seedAirports() {
    await db.Airports.bulkCreate(airports, { validate: true });
  }
  public async seedPayments_gateway() {
    const data_gateway = await db.Payment_gateway.findAll();
    if (data_gateway.length > 0) {
      return new Promise((resolve, reject) => {
        reject("all ready data seeded");
      });
    }
    await db.Payment_gateway.create({
      status: "SANDBOX",
      store_id: "NONE",
    });
  }
}
