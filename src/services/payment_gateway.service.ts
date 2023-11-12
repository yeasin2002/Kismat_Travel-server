import { db } from "@db";
import { Service } from "typedi";

@Service()
export class payment_gateway_service {
  public async getInformation() {
    try {
      return await db.Payment_gateway.findOne();
    } catch (error) {
      throw error;
    }
  }
}
