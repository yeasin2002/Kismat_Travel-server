import { App } from "@/app";
import { configureEnv } from "@config";
import { AuthController } from "@controllers/auth.controller";
import { SeedController } from "@controllers/seed.controller";
import { UserController } from "@controllers/users.controller";

configureEnv();

const app = new App([AuthController, UserController, SeedController]);

app.listen();
