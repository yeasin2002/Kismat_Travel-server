import { payment_gateway_service } from "@services/payment_gateway.service";
import { FlyhubService } from "@services/flyhub.service";
import { Controller, Post, Body, Get, Res } from "routing-controllers";
import { Service } from "typedi";
import Payment, { PaymentResponse } from "@/payment/Payment";
import { Response } from "express";

@Controller("/payment_handler")
@Service()
export class Payment_Handler {
  constructor(public payment_gateway_service: payment_gateway_service, public FlyhubService: FlyhubService) {}
  @Post("/bookings")
  public async success(@Body() body: PaymentResponse, @Res() res: Response) {
    try {
      // create payment record in database
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const CreteNewInvoice = await this.payment_gateway_service.createPaymentInvoice(
        {
          all_data: body,
          amount_original: body.amount_original,
          currency_merchant: body.currency_merchant,
          cus_email: body.cus_email,
          name: body.cus_name,
          status: body.status_code,
          store_amount: body.store_amount,
        },
        body.opt_a,
      );
      // make booking route call to api
      const BookingRes = await this.FlyhubService.AirBook(body.opt_b);
      // make the booking record table to the database
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const NewBookingRecord = await this.FlyhubService.CreateBook(
        body.store_amount,
        BookingRes.data.Passengers,
        BookingRes.data,
        body.amount_original,
        BookingRes.User,
        CreteNewInvoice.id,
      );

      res.redirect("/bookings/" + CreteNewInvoice.id);
    } catch (error) {
      throw error;
    }
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
