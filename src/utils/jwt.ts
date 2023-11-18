import { ENV } from "@config";
import jwt from "jsonwebtoken";

export function sign(payload: Record<string, any>, options?: jwt.SignOptions) {
  return jwt.sign(payload, ENV.SECRET_KEY, Object.assign({ expiresIn: "30d" }, options));
}

export function verify<T extends Record<string, any> = {}>(token: string, options?: jwt.VerifyOptions) {
  try {
    return Object.assign(jwt.verify(token, ENV.SECRET_KEY, options), { valid: true }) as { valid: true } & T;
  } catch {
    return { valid: false as const };
  }
}
