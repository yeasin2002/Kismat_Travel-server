/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";

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

// Define the type for the request data
export interface AamarpayRequestData {
  amount: string;
  currency: "BDT" | "USD" | "EUR";
  desc: string;
  cus_name: string;
  cus_email: string;
  cus_phone: string;
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
  tran_id: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
  signature_key: string;
  type: string;
}

const Payment = async (requestData: AamarpayRequestData) => {
  const apiUrl = "https://sandbox.aamarpay.com/jsonpost.php";

  try {
    const requestData_pay: AamarpayPayload = {
      ...verifyAamarpayData(requestData),
      store_id: "aamarpaytest",
      tran_id: "123121414",
      signature_key: "dbb74894e82415a2f7ff0ec3a97e4183",
      success_url: "http://www.merchantdomain.com/suc esspage.html",
      fail_url: "http://www.merchantdomain.com/faile dpage.html",
      cancel_url: "http://www.merchantdomain.com/can cellpage.html",
      type: "json",
    };

    const response = await axios.post(apiUrl, requestData_pay);
    return response;
  } catch (error) {
    throw error;
  }
};

export default Payment;
