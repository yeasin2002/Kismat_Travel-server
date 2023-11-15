import { App } from "@/app";
import { configureEnv } from "@config";
import { AdminController } from "@controllers/admin.controller";
import { AirportController } from "@controllers/airports.controller";
import { AuthController } from "@controllers/auth.controller";
import { BookingController } from "@controllers/booking.controller";
import { CredentialController } from "@controllers/credential.controller";
import { FlyhubController } from "@controllers/flyhub.controller";
import { Payment_gatewayController } from "@controllers/payment.controller";
import { PreBookingController } from "@controllers/pre-booking.controller";
import { SeedController } from "@controllers/seed.controller";
import { UserController } from "@controllers/users.controller";
import { Payment_Handler } from "@controllers/payment_handler.controller";
import { ProfitController } from "@controllers/profit.controller";

configureEnv();

const app = new App([
  AuthController,
  UserController,
  SeedController,
  AirportController,
  AdminController,
  FlyhubController,
  CredentialController,
  Payment_gatewayController,
  BookingController,
  ProfitController,
  Payment_Handler,
  PreBookingController,
]);

app.listen();
