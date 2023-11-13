import { payment_gateway_service } from "@services/payment_gateway.service";
import { ParseBites } from "@utils/encryption";
import { Controller, Post, Body, UseBefore, Req } from "routing-controllers";
import { Service } from "typedi";
import { isAdmin } from "@middlewares/isAdmin.middleware";
import { HttpException } from "@exceptions/http.exception";

import { Request } from "express";
interface CustomRequest extends Request {
  CurrentAdmin: any;
  AdminPassCheck: boolean;
}
@Controller("/payment_gateway")
@Service()
export class Payment_gatewayController {
  constructor(public payment_gateway_service: payment_gateway_service) {}
  @Post("/get_information")
  @UseBefore(isAdmin)
  public async getInformation() {
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

  @Post("/changes_status")
  @UseBefore(isAdmin)
  public async changeStatus(@Body() BodyData: any, @Req() request: CustomRequest) {
    try {
      if (request.AdminPassCheck) {
        return await this.payment_gateway_service.changeStatus(BodyData);
      } else {
        throw new HttpException(400, "Invalid request");
      }
    } catch (error) {
      throw error;
    }
  }

  @Post("/change_information")
  @UseBefore(isAdmin)
  public async changeInformation(@Body() BodyData: any, @Req() request: CustomRequest) {
    try {
      if (request.AdminPassCheck) {
        return await this.payment_gateway_service.changeInformation(BodyData);
      } else {
        throw new HttpException(400, "Invalid request");
      }
    } catch (error) {
      throw error;
    }
  }
}
