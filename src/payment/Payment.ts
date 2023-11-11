/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import { db } from "@db";

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
    if (data) {
      data.store_id = ParseBites(data.store_id);
      data.merchant_id = ParseBites(data.merchant_id);
      data.signature_key = ParseBites(data.signature_key);
      return data;
    }
    throw "Could not find";
  } catch (error) {
    return error;
  }
}
function generateUniqueString() {
  return `${new Date().getTime()}_${Math.random().toString(36).substring(2, 32)}`;
}
// Define the type for the request data
export interface AamarpayRequestData {
  amount: string;
  currency: "BDT" | "USD" | "EUR";
  desc: string;
  cus_name: string;
  cus_email: string;
  cus_phone: string;
  tran_id: string;
  cus_city?: string;
  cus_state?: string;
  cus_country?: string;
  cus_postcode?: string;
  cus_add1?: string;
  cus_add2?: string;
  custom_data?: object;
}
export interface AamarpayPayload extends AamarpayRequestData {
  store_id: string;

  success_url: string;
  fail_url: string;
  cancel_url: string;
  signature_key: string;
  type: string;
}

const Payment = async (requestData: AamarpayRequestData) => {
  const Payment_data = await getData();

  let apiUrl = "https://sandbox.aamarpay.com/jsonpost.php";

  if (Payment_data.status === "LIVE") {
    apiUrl = "https://secure.aamarpay.com";
  }

  try {
    const requestData_pay: AamarpayPayload = {
      ...verifyAamarpayData(requestData),
      store_id: Payment_data.store_id,
      signature_key: Payment_data.signature_key,
      success_url: "http://www.merchantdomain.com/sucesspage.html",
      fail_url: "http://www.merchantdomain.com/failedpage.html",
      cancel_url: "http://www.merchantdomain.com/cancellpage.html",
      type: "json",
    };

    const response = await axios.post(apiUrl, requestData_pay);
    return response;
  } catch (error) {
    throw error;
  }
};

export default Payment;
