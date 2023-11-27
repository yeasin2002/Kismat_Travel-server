import airports from "@data/airports-data.json";
import { db } from "@db";
import { literal } from "sequelize";
import { Service } from "typedi";

@Service()
export class SeedService {
  public async seedAirports() {
    await db.Airports.destroy({ truncate: true });
    await db.Airports.bulkCreate(airports, { validate: true });
  }

  public async seedPayments_gateway() {
    const data_gateway = await db.Payment_gateway.findAll();
    if (data_gateway.length > 0) {
      return new Promise(resolve => {
        resolve("all ready gateway data seeded");
      });
    }

    await db.Payment_gateway.create({
      status: "SANDBOX",
      store_id: "aamarpaytest",
      merchant_id: "aamarpaytest",
      signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
    });
    return new Promise(resolve => {
      resolve("all gateway data seeded");
    });
  }

  public async profit_init() {
    const profitDb = await db.Profit.findAll();
    if (profitDb.length > 0) {
      return new Promise(resolve => {
        resolve("all ready profit data seeded");
      });
    }
    await db.Profit.create({
      agent_profit: "20",
      user_profit: "10",
    });

    return new Promise(resolve => {
      resolve("all profit data seeded");
    });
  }

  public async test() {
    try {
      const nahid = await db.Bookings.findAll({
        include: [db.Users, db.Payment_Online],
      });
      // console.log("🚀 ~ file: seed.service.ts:51 ~ SeedService ~ test ~ nahid:", nahid.toJSON());
      return nahid.map(e => e.toJSON());
    } catch (error) {
      console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀");
      console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀");
      console.log("🚀 file: seed.service.ts:53 ~ SeedService ~ test ~ error:", error);
      console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀");
      console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀");
      throw error;
    }
  }
}
