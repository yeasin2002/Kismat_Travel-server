import { ENV } from "@config";
import { UserModel } from "@models/users.model";
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
    freezeTableName: true,
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
  sequelize,
} as const;
