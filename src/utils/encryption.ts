import { compareSync, hashSync } from "bcryptjs";

export function hash(text: string, salt?: number | string) {
  return hashSync(text, salt);
}

export function compare(text: string, hash: string) {
  return compareSync(text, hash);
}
