import { db } from "@db";
import { Service } from "typedi";
import { HttpException } from "@exceptions/http.exception";

@Service()
export class profit_service {
  public async getInformation() {
    try {
      const dbRes = await db.Profit.findOne();
      return dbRes.toJSON();
    } catch (error) {
      throw error;
    }
  }

  public async changeStatus(Body: any) {
    try {
      const { status, id } = Body;

      if (!["LIVE", "SANDBOX", "OFF"].includes(status)) {
        throw new HttpException(400, "not valid input ");
      }

      const DBres = await db.Payment_gateway.update(
        {
          status: status,
        },
        {
          where: {
            id: id,
          },
        },
      );
      return DBres;
    } catch (error) {
      throw error;
    }
  }
  public async changeInformation(Body: any) {
    try {
      const { id, value_profit, update } = Body;

      const updated: any = {};
      if (!value_profit) {
        return { msg: "not able to update" };
      }

      if (!["User", "Agent"].includes(update)) {
        throw new HttpException(400, "not valid input ");
      }
      if (update === "User") {
        updated.user_profit = value_profit;
      }

      if (update === "Agent") {
        updated.agent_profit = value_profit;
      }

      const DbRes = await db.Profit.update(updated, {
        where: {
          id: id,
        },
      });

      return DbRes;
    } catch (error) {
      throw error;
    }
  }
}
