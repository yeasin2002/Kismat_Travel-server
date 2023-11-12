import { db } from "@db";
import { Service } from "typedi";
import { HttpException } from "@exceptions/http.exception";

@Service()
export class payment_gateway_service {
  public async getInformation() {
    try {
      return await db.Payment_gateway.findOne();
    } catch (error) {
      throw error;
    }
  }
  public async changeStatus(Body: any) {
    try {
      const { status, id } = Body;
      console.log("🚀 ~ file: payment_gateway.service.ts:17 ~ payment_gateway_service ~ changeStatus ~ Body:", Body);

      if (!["LIVE", "SANDBOX", "OFF"].includes(status)) {
        throw new HttpException(400, "not valid input ");
      }

      let dbres = await db.Payment_gateway.update(
        {
          status: status,
        },
        {
          where: {
            id: id,
          },
        },
      );
      return dbres;
    } catch (error) {
      throw error;
    }
  }
}
