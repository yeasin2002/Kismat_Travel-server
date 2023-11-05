import { ENV } from "@config";
import { joinUrl } from "@utils/joinUrl";
import axios from "axios";
import * as fs from "fs";
import { dirname, join } from "path";

const STORE = join(__dirname, "../credentials/auth.json");
const EXPIRATION_DAYS = 7;

function ensureFilePathExists(filePath: string) {
  const directory = dirname(filePath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

function createExpireDate(expirationDays: number | string) {
  if (typeof expirationDays === "string") {
    return new Date(expirationDays).toISOString();
  }

  const currentDate = new Date();
  const expirationDate = new Date(currentDate.getTime() + expirationDays * 24 * 60 * 60 * 1000);

  return expirationDate.toISOString();
}

export function saveDataWithExpiration(token: string, expirationDays: number | string): void {
  ensureFilePathExists(STORE);
  fs.writeFileSync(STORE, JSON.stringify({ token, expire: createExpireDate(expirationDays) }, null, 2));
}

export function checkExpirationAndRetrieveToken() {
  try {
    ensureFilePathExists(STORE);
    const data = JSON.parse(fs.readFileSync(STORE, "utf8"));
    const expirationDate = new Date(data.expire);

    if (expirationDate > new Date()) {
      return { auth: data.token as string, valid: true } as const;
    }
  } finally {
    return { auth: null as null, valid: false } as const;
  }
}

export async function getAuthorizeHeader(): Promise<string> {
  const prev = checkExpirationAndRetrieveToken();

  if (prev.valid) {
    return prev.auth;
  }

  const token = "hhsdo9fuh";

  saveDataWithExpiration(token, EXPIRATION_DAYS);
  return token;
}

export async function getFlyHubAuth(username: string, apikey: string) {
  try {
    const { data } = await axios.post<{ ExpireTime: string; TokenId: string }>(
      joinUrl(ENV.FLY_HUB_API_BASE_URL, "Authenticate"),
      { username, apikey },
      { headers: { "Content-Type": "application/json" } },
    );

    return data;
  } catch (error) {
    return null;
  }
}
