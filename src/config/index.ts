import { config } from "dotenv";
import { cleanEnv, port, str } from "envalid";
config({ path: `.env.${process.env.NODE_ENV || "development"}.local` });

export function configureEnv() {
  return cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port({ devDefault: 3000 }),

    SECRET_KEY: str({ devDefault: "secretKey" }),

    ORIGIN: str({ devDefault: "*" }),
    CREDENTIALS: port({ default: 1 }),

    DATABASE_NAME: str({ devDefault: "fly-hub-development" }),
    DATABASE_USER: str({ devDefault: "root" }),
    DATABASE_PORT: port({ devDefault: 3306 }),
    DATABASE_HOST: str({ devDefault: "localhost" }),

    LOG_FORMAT: str({ devDefault: "dev", default: "combined" }),
    LOG_DIR: str({ default: "logs" }),
  });
}

export const ENV = configureEnv();
