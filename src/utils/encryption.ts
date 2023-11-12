import { compareSync, hashSync } from "bcryptjs";
import CryptoJS from "crypto-js";
import { ENV } from "@config";

export function hash(text: string, salt?: number | string) {
  return hashSync(text, salt);
}

export function compare(text: string, hash: string) {
  return compareSync(text, hash);
}

export function bites(data: string) {
  return CryptoJS.AES.encrypt(data, ENV.SECRET_KEY).toString();
}

export function ParseBites(data: string) {
  const bytes = CryptoJS.AES.decrypt(data, ENV.SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}
