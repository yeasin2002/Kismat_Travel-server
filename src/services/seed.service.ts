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
        resolve("all ready gateway data seeded");
      });
    }
    await db.Payment_gateway.create({
      status: "SANDBOX",
      store_id: "aamarpaytest",
      merchant_id: "aamarpaytest",
      signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
    });
    return new Promise((resolve, reject) => {
      resolve("all gateway data seeded");
    });
  }
  public async profit_init() {
    const profitDb = await db.Profit.findAll();
    if (profitDb.length > 0) {
      return new Promise((resolve, reject) => {
        resolve("all ready profit data seeded");
      });
    }
    await db.Profit.create({
      agent_profit: "20",
      user_profit: "10",
    });

    return new Promise((resolve, reject) => {
      resolve("all profit data seeded");
    });
  }
}
