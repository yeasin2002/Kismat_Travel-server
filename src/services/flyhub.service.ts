import { db } from "@db";
import { Service } from "typedi";
import { SearchResultOptions } from "@interfaces/flyhub.interface";
import { User } from "@interfaces/users.interface";
import axios from "axios";
import { ENV } from "@config";
import { getAuthorizeHeader } from "@utils/authorize";
import Payment from "@/payment/Payment";

function generateUniqueTransactionId(string: string): string {
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  const transactionId = `${timestamp}${string}${random}`;
  return transactionId;
}

@Service()
export class FlyhubService {
  public async AirPreBook(body: SearchResultOptions, _user: User) {
    try {
      const token = await getAuthorizeHeader();
      const axiosResponse = await axios.post(`${ENV.FLY_HUB_API_BASE_URL}/AirPreBook`, body, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      const DBres = await db.PreBookings.create({
        searchId: body.SearchID,
        userId: _user.id,
        resultId: body.ResultID,
        response: JSON.stringify(axiosResponse.data),
        passengers: JSON.stringify(body.Passengers),
      });

      const paymentRes = await Payment({
        amount: "",
        currency: "BDT",
        cus_email: body.Passengers[0].Email,
        cus_name: body.Passengers[0].FirstName + " " + body.Passengers[0].LastName,
        cus_phone: body.Passengers[0].ContactNumber,
        desc: "buy plane ticket",
        success_url: "bookings",
        tran_id: generateUniqueTransactionId(body.Passengers[0].FirstName.slice(0, 3)),
        opt_a: DBres.id,
      });

      return paymentRes;
    } catch (error) {
      throw error;
    }
  }
}
