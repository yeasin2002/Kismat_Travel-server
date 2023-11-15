/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { db } from "@db";
import { ENV } from "@config";
import { HttpException } from "@exceptions/http.exception";
import { ParseBites } from "@utils/encryption";

// validate function
function verifyAamarpayData(data) {
  const validationChecks = [
    {
      field: "amount",
      type: "string",
      check: value => /^\d+(\.\d*)?$/.test(value),
      errorMessage: "amount should be a valid string representation of a number.",
    },
    { field: "currency", type: "string", errorMessage: "currency should be a string." },
    { field: "desc", type: "string", errorMessage: "desc should be a string." },
    { field: "cus_name", type: "string", errorMessage: "cus_name should be a string." },
    { field: "cus_email", type: "string", check: isValidEmail, errorMessage: "cus_email should be a valid email address." },
    { field: "cus_phone", type: "string", errorMessage: "cus_phone should be a string." },
  ];

  for (const check of validationChecks) {
    const { field, type, check: validationCheck, errorMessage } = check;

    if (typeof data[field] !== type || (validationCheck && !validationCheck(data[field]))) {
      throw new Error(errorMessage);
    }
  }

  return data;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function getData() {
  try {
    const data = await db.Payment_gateway.findOne();
    let sender;
    if (data) {
      sender = data.toJSON();
      sender.store_id = ParseBites(sender.store_id);
      sender.merchant_id = ParseBites(sender.merchant_id);
      sender.signature_key = ParseBites(sender.signature_key);
      return sender;
    }
    throw "Could not find";
  } catch (error) {
    return error;
  }
}

type success_url = "bookings" | "payment";

// Define the type for the request data
export interface AamarpayRequestData {
  amount: string;
  currency: "BDT" | "USD" | "EUR";
  desc: string;
  cus_name: string;
  cus_email: string;
  cus_phone: string;
  tran_id: string;
  success_url: success_url;
  cus_city?: string;
  cus_state?: string;
  cus_country?: string;
  cus_postcode?: string;
  cus_add1?: string;
  cus_add2?: string;
  opt_a?: string;
  opt_b?: string;
  opt_c?: string;
  opt_d?: string;
}
export interface AamarpayPayload extends AamarpayRequestData {
  store_id: string;
  fail_url: string;
  cancel_url: string;
  signature_key: string;
  type: string;
}

const Payment = async (requestData: AamarpayRequestData) => {
  try {
    const Payment_data = await getData();
    let apiUrl = "https://sandbox.aamarpay.com/jsonpost.php";
    if (Payment_data.status === "LIVE") {
      apiUrl = "https://secure.aamarpay.com";
    }

    const requestData_pay: AamarpayPayload = {
      ...verifyAamarpayData(requestData),
      store_id: Payment_data.store_id,
      signature_key: Payment_data.signature_key,
      fail_url: `${ENV.BASE_URL}/api/v1/payment_handler/${ENV.PAYMENT_FAIL_URL}`,
      cancel_url: `${ENV.BASE_URL}/api/v1/payment_handler/${ENV.PAYMENT_CANCEL_URL}`,
      type: "json",
    };

    if (requestData_pay.success_url === "bookings" || requestData_pay.success_url === "payment") {
      requestData_pay.success_url = `${ENV.BASE_URL}/api/v1/payment_handler/${requestData_pay.success_url}` as success_url;
    }

    const response = await axios.post(apiUrl, requestData_pay);
    if (response.data?.result) {
      return response.data?.payment_url;
    } else {
      throw new HttpException(400, JSON.stringify(response.data));
    }
  } catch (error) {
    throw error;
  }
};

export default Payment;
