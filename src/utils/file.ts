import { existsSync, mkdirSync } from "fs";
import { dirname, normalize } from "path";

export function ensureFilePathExists(filePath: string) {
  const directory = dirname(filePath);
  if (!existsSync(directory)) mkdirSync(directory, { recursive: true });
  return normalize(filePath);
}
