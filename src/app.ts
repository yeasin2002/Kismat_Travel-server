import { ENV } from "@config";
import { db } from "@db";
import { HttpException } from "@exceptions/http.exception";
import { Modify } from "@interfaces/util.interface";
import { ErrorMiddleware } from "@middlewares/error.middleware";
import { PassportGoogleStrategy, PassportLocalStrategy, deserializeUser, serializeUser } from "@middlewares/passport.middleware";
import { logger, stream } from "@utils/logger";
import { defaultMetadataStorage } from "class-transformer/cjs/storage";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";
import session from "express-session";
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

    this.connectToDatabase();
    this.initializeServices();
    this.initializeMiddlewares();
    this.initializePassport();
    this.initializeRoutes(Controllers);
    this.initializeSwagger(Controllers);
    this.initializeErrorHandling();
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
    await db.sequelize.sync();
  }

  private initializeServices() {
    useContainer(Container);
  }

  private initializeMiddlewares() {
    this.app.use(morgan(ENV.LOG_FORMAT, { stream }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(session({ secret: ENV.SECRET_KEY, resave: true, saveUninitialized: true }));
    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  private initializePassport() {
    passport.use(PassportLocalStrategy);
    passport.use(PassportGoogleStrategy);

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);
  }

  private initializeRoutes(controllers: Function[]) {
    useExpressServer(this.app, {
      cors: {
        origin: ENV.ORIGIN,
        credentials: ENV.CREDENTIALS,
      },

      controllers: controllers,
      defaultErrorHandler: false,
      routePrefix: "/api/v1",

      authorizationChecker: ({ request }: Modify<Action, { request: Express.Request }>) => {
        if (
          request.isAuthenticated &&
          request.isAuthenticated() &&
          typeof request.user === "object" &&
          request.user !== null &&
          !Array.isArray(request.user) &&
          "email" in request.user &&
          "password" in request.user
        ) {
          return true;
        }

        throw new HttpException(401, "Authentication required");
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
        description: "Generated with `routing-controllers-openapi`",
        title: "A sample API",
        version: "1.0.0",
      },
    });

    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }
}
