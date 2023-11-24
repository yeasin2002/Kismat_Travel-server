import { ENV } from "@config";
import { AdminModel } from "@models/admin.model";
import { AirportModel } from "@models/airports.model";
import { BookingModel } from "@models/booking.model";
import { CredentialModel } from "@models/credential.model";
import { Payment_gatewayModel } from "@models/payment_gateway.model";
import { PreBookingModel } from "@models/prebooking.model";
import { Profit_model } from "@models/profit.model";
import { SearchModel } from "@models/search.model";
import { UserModel } from "@models/users.model";
import { Payment_online } from "@models/payment.online.model";
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

const Users = UserModel(sequelize);
const Airports = AirportModel(sequelize);
const Admin = AdminModel(sequelize);
const Payment_gateway = Payment_gatewayModel(sequelize);
const Credentials = CredentialModel(sequelize);
const Bookings = BookingModel(sequelize);
const Profit = Profit_model(sequelize);
const PreBookings = PreBookingModel(sequelize);
const Searches = SearchModel(sequelize);
const Payment_Online = Payment_online(sequelize);

Users.hasMany(Bookings, { as: "booking", onDelete: "cascade" });
Bookings.belongsTo(Users, { foreignKey: "userId", as: "user", onDelete: "cascade" });

Users.hasMany(PreBookings, { as: "preBooking", onDelete: "cascade" });
PreBookings.belongsTo(Users, { foreignKey: "userId", as: "user", onDelete: "cascade" });

Users.hasMany(Payment_Online, { as: "Payment_Online", onDelete: "cascade" });
Payment_Online.belongsTo(Users, { foreignKey: "userId", as: "user", onDelete: "cascade" });

Payment_Online.hasOne(Bookings, { as: "Payment_data", onDelete: "cascade" });
Bookings.belongsTo(Payment_Online, { foreignKey: "payment_id", as: "_payment", onDelete: "cascade" });

export const db = {
  Users,
  Airports,
  Admin,
  Payment_gateway,
  Profit,
  Credentials,
  Bookings,
  PreBookings,
  Searches,
  Payment_Online,
  sequelize,
} as const;
