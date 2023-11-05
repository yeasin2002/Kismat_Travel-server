import { ENV } from "@config";
import { db } from "@db";
import { HttpException } from "@exceptions/http.exception";
import { joinUrl } from "@utils/joinUrl";
import axios from "axios";
import * as fs from "fs";
import { dirname, join } from "path";

const HEADER_STORE = join(__dirname, "../../credentials/auth.json");

export async function getFlyHubAuth() {
  const dbRes = await db.Credentials.findOne({ where: { key: "@api-key" } });
  if (!dbRes) throw new HttpException(404, "Credentials not found");

  try {
    const { data } = await axios.post<{ ExpireTime: string; TokenId: string }>(
      joinUrl(ENV.FLY_HUB_API_BASE_URL, "Authenticate"),
      { username: dbRes.username, apikey: dbRes.apikey },
      { headers: { "Content-Type": "application/json" } },
    );

    return data;
  } catch {
    throw new HttpException(5000, "Authentication error fly-hub");
  }
}

function ensureFilePathExists(filePath: string) {
  const directory = dirname(filePath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

function createExpireDate(expirationDays: string) {
  return new Date(expirationDays).toISOString();
}

export function saveDataWithExpiration(token: string, expirationDays: string) {
  ensureFilePathExists(HEADER_STORE);
  fs.writeFileSync(HEADER_STORE, JSON.stringify({ token, expire: createExpireDate(expirationDays) }, null, 2));
  return token;
}

export function checkExpirationAndRetrieveToken() {
  try {
    ensureFilePathExists(HEADER_STORE);
    const data = JSON.parse(fs.readFileSync(HEADER_STORE, "utf8"));
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

  const authInfo = await getFlyHubAuth();
  return saveDataWithExpiration(authInfo.TokenId, authInfo.ExpireTime);
}
