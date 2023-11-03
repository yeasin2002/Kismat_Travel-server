import { config } from "dotenv";
import { bool, cleanEnv, port, str } from "envalid";
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export function configureEnv() {
  return cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port({ devDefault: 5000 }),

    SECRET_KEY: str({ devDefault: "secretKey" }),

    ORIGIN: str({ devDefault: "*" }),
    CREDENTIALS: bool({ default: false }),

    DATABASE_NAME: str({ devDefault: "fly-hub-development" }),
    DATABASE_USER: str({ devDefault: "root" }),
    DATABASE_PORT: port({ devDefault: 3306 }),
    DATABASE_HOST: str({ devDefault: "localhost" }),
    DATABASE_PASSWORD: str({ devDefault: "" }),

    GOOGLE_CLIENT_ID: str(),
    GOOGLE_CLIENT_SECRET: str(),
    GOOGLE_CALLBACK_URL: str({ default: "http://localhost:3000" }),

    CLIENT_BASE_URL: str({ devDefault: "http://localhost:3000" }),
    AUTH_SUCCESS_REDIRECT_PATH: str({ default: "/signin" }),
    AUTH_FAILED_REDIRECT_PATH: str({ default: "/signin" }),

    LOG_FORMAT: str({ devDefault: "dev", default: "combined" }),
    LOG_DIR: str({ default: "logs" }),
  });
}

export const ENV = configureEnv();

export function createClientUrl(str: string) {
  return `${ENV.CLIENT_BASE_URL.replace(/\/$/, "")}/${str.replace(/^\//, "")}`;
}
