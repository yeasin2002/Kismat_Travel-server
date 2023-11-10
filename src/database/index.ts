import { ENV } from "@config";
import { AirportModel } from "@models/airports.model";
import { CredentialModel } from "@models/credential.model";
import { UserModel } from "@models/users.model";
import { AdminModel } from "@models/admin.model";
import { Payment_gatewayModel } from "@models/payment_gateway.model";
import { logger } from "@utils/logger";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "mysql",

  host: ENV.DATABASE_HOST,
  port: ENV.DATABASE_PORT,
  database: ENV.DATABASE_NAME,
  password: ENV.DATABASE_PASSWORD,
  username: ENV.DATABASE_USER,

  timezone: "+09:00",

  define: {
    charset: "utf8mb4",
    collate: "utf8mb4_general_ci",
    underscored: true,
  },

  pool: {
    min: 0,
    max: 5,
  },

  logQueryParameters: ENV.NODE_ENV === "development",

  logging: (query, time) => {
    logger.info(time + "ms" + " " + query);
  },

  benchmark: true,
});

sequelize.authenticate();

export const db = {
  Users: UserModel(sequelize),
  Airports: AirportModel(sequelize),
  Admin: AdminModel(sequelize),
  Payment_gateway: Payment_gatewayModel(sequelize),
  Credentials: CredentialModel(sequelize),
  sequelize,
} as const;
