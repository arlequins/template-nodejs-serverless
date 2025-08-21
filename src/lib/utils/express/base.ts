// commonApp.ts
import express from "express";
import cors from "cors";
import compression from "compression";
import { EnvStage } from "@typing";
import environment, { constants } from "@constants/environment";
import {
  loggingMiddleware,
  resultExpressAdditionalHeaders,
  snakeCaseMiddleware,
} from "@lib/utils/express";
import { globalErrorHandler } from "@lib/utils/express/globalErrorHandler";

export const createBaseApp = (router) => {
  const app = express();
  app.disable("x-powered-by");

  app.use(snakeCaseMiddleware);
  app.use(loggingMiddleware);

  if (environment.stage === EnvStage.PRODUCTION) {
    app.use(
      cors({
        origin: constants.ALLOWED_ORIGIN,
        methods: ["GET", "POST", "OPTION"],
        preflightContinue: true,
        credentials: true,
        optionsSuccessStatus: 204,
      }),
    );
  } else {
    app.use(cors({ origin: "*" }));
  }

  app.use(resultExpressAdditionalHeaders);
  app.use(compression());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // router
  app.use(router);

  app.use(globalErrorHandler);

  return app;
};
