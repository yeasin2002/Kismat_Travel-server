import { ENV } from "@config";
import { db } from "@db";
import { HttpException } from "@exceptions/http.exception";
import { Modify } from "@interfaces/util.interface";
import { ErrorMiddleware } from "@middlewares/error.middleware";
import { PassportGoogleStrategy, PassportLocalStrategy } from "@middlewares/passport.middleware";
import { gotToFlyHub } from "@utils/flyhub";
import { verify } from "@utils/jwt";
import { logger, stream } from "@utils/logger";
import { defaultMetadataStorage } from "class-transformer/cjs/storage";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request } from "express";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import passport from "passport";
import "reflect-metadata";
import { Action, getMetadataArgsStorage, useContainer, useExpressServer } from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
import swaggerUi from "swagger-ui-express";
import Container from "typedi";

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(Controllers: Function[]) {
    this.app = express();
    this.env = ENV.NODE_ENV;
    this.port = ENV.PORT;

    this.initializeServices();
    this.initializeMiddlewares();
    this.initializeProxyServer();
    this.initializePassport();
    this.initializeRoutes(Controllers);
    this.initializeSwagger(Controllers);
    this.initializeErrorHandling();
    this.connectToDatabase();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    await db.PreBookings.sync({ force: true });
    await db.Bookings.sync({ force: true });
    await db.Users.sync({ force: true });
    await db.sequelize.sync();
  }

  private initializeServices() {
    useContainer(Container);
  }

  private initializeMiddlewares() {
    this.app.use(morgan(ENV.LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: ENV.ORIGIN, credentials: ENV.CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet({ crossOriginResourcePolicy: false }));
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(passport.initialize());
  }

  private initializeProxyServer() {
    this.app.all("/api/v1/private/*", gotToFlyHub);
  }

  private initializePassport() {
    passport.use(PassportGoogleStrategy);
    passport.use(PassportLocalStrategy);
  }

  private initializeRoutes(controllers: Function[]) {
    useExpressServer(this.app, {
      controllers: controllers,
      defaultErrorHandler: false,
      routePrefix: "/api/v1",

      authorizationChecker: async ({ request }: Modify<Action, { request: Request }>) => {
        const auth = request.headers.authorization;
        if (!auth || (auth && !auth.startsWith("Bearer "))) throw new HttpException(401, "Authentication required");

        const validation = verify<{ id: string }>(auth.replace("Bearer ", ""));
        if (!validation.valid) throw new HttpException(401, "Authentication required");

        const User = await db.Users.unscoped().findByPk(validation.id);
        if (!User) throw new HttpException(401, "Authentication required");

        request.user = User.toJSON();
        return true;
      },

      currentUserChecker: action => action.request.user,
    });
  }

  private initializeSwagger(controllers: Function[]) {
    const schemas = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      refPointerPrefix: "#/components/schemas/",
    });

    const routingControllersOptions = {
      controllers: controllers,
      routePrefix: "/api/v1",
    };

    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage, routingControllersOptions, {
      components: {
        schemas,
        securitySchemes: {
          basicAuth: {
            scheme: "basic",
            type: "http",
          },
        },
      },
      info: {
        description: "Build and maintain by `DEWANICT`",
        title: "Air ticket booking",
        version: "1.0.0",
      },
    });

    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }
}
