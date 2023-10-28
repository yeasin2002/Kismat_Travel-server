import { ENV } from "@config";
import { db } from "@db";
import { ErrorMiddleware } from "@middlewares/error.middleware";
import { logger, stream } from "@utils/logger";
import { defaultMetadataStorage } from "class-transformer/cjs/storage";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import compression from "compression";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import "reflect-metadata";
import { getMetadataArgsStorage, useExpressServer } from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
import swaggerUi from "swagger-ui-express";

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(Controllers: Function[]) {
    this.app = express();
    this.env = ENV.NODE_ENV;
    this.port = ENV.PORT;

    this.connectToDatabase();
    this.initializeMiddlewares();
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

  private initializeMiddlewares() {
    this.app.use(morgan(ENV.LOG_FORMAT, { stream }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
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
