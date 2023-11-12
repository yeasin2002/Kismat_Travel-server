import { payment_gateway_service } from "@services/payment_gateway.service";
import { ParseBites } from "@utils/encryption";
import { Controller, Post, Get, UseBefore } from "routing-controllers";
import { Service } from "typedi";
import { isAdmin } from "@middlewares/isAdmin.middleware";
import { HttpException } from "@exceptions/http.exception";

@Controller("/payment_gateway")
@Service()
export class Payment_gatewayController {
  constructor(public payment_gateway_service: payment_gateway_service) {}
  @Post("/get_information")
  @UseBefore(isAdmin)
  public async seedPaymentsGateway() {
    try {
      const resDB = await this.payment_gateway_service.getInformation();
      const information = resDB.toJSON();
      information.store_id = ParseBites(information.store_id);
      information.merchant_id = ParseBites(information.merchant_id);
      information.signature_key = ParseBites(information.signature_key);
      return information;
    } catch (error) {
      return error;
    }
  }
}
