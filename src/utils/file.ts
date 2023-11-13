import { existsSync, mkdirSync } from "fs";
import { normalize } from "path";

export function ensureFilePathExists(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return normalize(dir);
}
