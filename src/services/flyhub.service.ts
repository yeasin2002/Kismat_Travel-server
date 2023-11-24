import { db } from "@db";
import { Service } from "typedi";
import { SearchResultOptions, Prebook_res_options } from "@interfaces/flyhub.interface";
import { User } from "@interfaces/users.interface";
import { FlightBooking, Passenger } from "@interfaces/flyhub.interface";
import axios from "axios";
import { ENV } from "@config";
import { getAuthorizeHeader } from "@utils/authorize";
import Payment from "@/payment/Payment";
import { HttpException } from "@exceptions/http.exception";
import { ParseBites } from "@utils/encryption";

function generateUniqueTransactionId(string: string): string {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  const transactionId = `${timestamp}${string}${random}`;
  return transactionId;
}

function calculateSumWithPercentage(percentage, amount) {
  const percentageNumber = typeof percentage === "string" ? parseFloat(percentage) : percentage;
  const amountNumber = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(percentageNumber) || isNaN(amountNumber)) {
    throw new Error("Invalid input. Please Provide a valid number to the calculateSumWithPercentage");
  }

  const percentageDecimal = percentageNumber / 100;
  const sum = amountNumber + amountNumber * percentageDecimal;
  return sum;
}

@Service()
export class FlyhubService {
  public async AirPreBook(body: SearchResultOptions, _user: User) {
    try {
      const token = await getAuthorizeHeader();

      const axiosResponse = await axios.post<Prebook_res_options>(`${ENV.FLY_HUB_API_BASE_URL}/AirPreBook`, body, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      console.log("🚀 ~ file: flyhub.service.ts:41 ~ FlyhubService ~ AirPreBook ~ axiosResponse:", axiosResponse);

      if (axiosResponse.data.Error) {
        throw new HttpException(400, axiosResponse.data.Error.ErrorMessage);
      }
      if (axiosResponse.data.Results[0].Availabilty < 1) {
        throw new HttpException(400, "The Ticket is not available");
      }
      const profitDB = await db.Profit.findOne();
      const Profit = profitDB.toJSON();
      // user_profit
      const DBres = await db.PreBookings.create({
        searchId: body.SearchID,
        userId: _user.id,
        resultId: body.ResultID,
        response: JSON.stringify(axiosResponse.data),
        passengers: JSON.stringify(body.Passengers),
      });
      const paymentRes = await Payment({
        amount: `${calculateSumWithPercentage(ParseBites(Profit.user_profit), axiosResponse.data.Results[0].TotalFare)}`,
        currency: axiosResponse.data.Results[0].Currency as "BDT" | "USD",
        cus_email: body.Passengers[0].Email,
        cus_name: body.Passengers[0].FirstName + " " + body.Passengers[0].LastName,
        cus_phone: body.Passengers[0].ContactNumber,
        desc: "Buy plane ticket Online",
        success_url: "bookings",
        tran_id: generateUniqueTransactionId(body.Passengers[0].FirstName.slice(0, 3)),
        opt_a: DBres.id,
      });
      return paymentRes;
    } catch (error) {
      console.log("🚀 ~ file: flyhub.service.ts:69 ~ FlyhubService ~ AirPreBook ~ error:", error);
      throw error;
    }
  }
  public async AirBook(id: string): Promise<{
    data: FlightBooking;
    User: string;
  }> {
    try {
      const dataInDatabase = await db.PreBookings.findByPk(id);
      const ParseData = dataInDatabase.toJSON();
      const token = await getAuthorizeHeader();
      const axiosResponse = await axios.post<FlightBooking>(
        `${ENV.FLY_HUB_API_BASE_URL}/AirBook`,
        {
          SearchID: ParseData.searchId,
          ResultID: ParseData.resultId,
          Passengers: [...ParseData.passengers],
        },
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        },
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return { data: axiosResponse.data, User: ParseData.user.id as string };
    } catch (error) {
      throw error;
    }
  }

  public async CreateBook(amount: string, passengers: Passenger[], response: FlightBooking, payment: string, userId: string, payment_ID: string) {
    try {
      const resNew = await db.Bookings.create({
        amount: amount,
        passengers: JSON.stringify(passengers),
        response: JSON.stringify(response),
        bookingId: response.BookingID,
        payment: payment,
        userId: userId,

        //TODO: check make relation on user data
        payment_id: payment_ID,
      });
      return resNew;
    } catch (error) {
      throw error;
    }
  }
}
