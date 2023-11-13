import { profit_service } from "@services/profit.service";
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
@Controller("/profit")
@Service()
export class ProfitController {
  constructor(public profit_service: profit_service) {}
  @Post("/get_information")
  public async getInformation() {
    try {
      const information: any = await this.profit_service.getInformation();
      information.user_profit = ParseBites(information.user_profit);
      information.agent_profit = ParseBites(information.agent_profit);
      delete information.createdAt;
      delete information.updatedAt;
      return information;
    } catch (error) {
      return error;
    }
  }

  // @Post("/changes_status")
  // @UseBefore(isAdmin)
  // public async changeStatus(@Body() BodyData: any, @Req() request: CustomRequest) {
  //   try {
  //     if (request.AdminPassCheck) {
  //       return await this.payment_gateway_service.changeStatus(BodyData);
  //     } else {
  //       throw new HttpException(400, "Invalid request");
  //     }
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  @Post("/change_information")
  @UseBefore(isAdmin)
  public async changeInformation(@Body() BodyData: any, @Req() request: CustomRequest) {
    try {
      if (request.AdminPassCheck) {
        return await this.profit_service.changeInformation(BodyData);
      } else {
        throw new HttpException(400, "Invalid request");
      }
    } catch (error) {
      throw error;
    }
  }
}
