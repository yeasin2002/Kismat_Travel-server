import { db } from "@db";
import { Op } from "sequelize";
import { Service } from "typedi";

@Service()
export class AirportsService {
  public async getAirports(search = "", limit = 10) {
    const resArray = await db.Airports.findAll({
      where: { [Op.or]: { name: { [Op.like]: `%${search}%` }, code: { [Op.like]: `%${search}%` } } },
      limit,
      order: [
        ["name", "ASC"],
        ["id", "ASC"],
      ],
    });

    return resArray.map(_ => _.toJSON());
  }
}
