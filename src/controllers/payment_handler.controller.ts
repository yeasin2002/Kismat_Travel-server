import { payment_gateway_service } from "@services/payment_gateway.service";
import { Controller, Post, Body, Get } from "routing-controllers";
import { Service } from "typedi";
import Payment from "@/payment/Payment";

@Controller("/payment_handler")
@Service()
export class Payment_Handler {
  constructor(public payment_gateway_service: payment_gateway_service) {}
  @Post("/bookings")
  public async success(@Body() body: any) {
    console.log(body);
    return body;
  }
  @Get("/")
  public async test() {
    try {
      const payment_res = await Payment({
        amount: "100",
        currency: "BDT",
        cus_email: "nahid@gmail.com",
        cus_name: "Nahid Hasan",
        cus_phone: "01741013363",
        desc: "Nahid buy a test",
        tran_id: "47836576HAS123",
        success_url: "bookings",
      });
      console.log("🚀 ~ file: payment_handler.controller.ts:27 ~ Payment_Handler ~ test ~ payment_res:", payment_res);

      return payment_res;
    } catch (error) {
      throw error;
    }
  }
}
