import { App } from "@/app";
import { configureEnv } from "@config";
import { AirportController } from "@controllers/airports.controller";
import { AuthController } from "@controllers/auth.controller";
import { CredentialController } from "@controllers/credential.controller";
import { FlyhubController } from "@controllers/flyhub.controller";
import { SeedController } from "@controllers/seed.controller";
import { UserController } from "@controllers/users.controller";

configureEnv();

const app = new App([AuthController, CredentialController, UserController, SeedController, AirportController, FlyhubController]);

app.listen();
