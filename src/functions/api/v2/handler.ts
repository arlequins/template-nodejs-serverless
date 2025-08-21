import serverlessExpress from "@codegenie/serverless-express";
import environment from "@constants/environment";
import { EnvStage } from "@typing";
import { createBaseApp } from "@lib/utils/express/base";
import router from "@lib/usecases/api/v2";

const handler = serverlessExpress({
  app: createBaseApp(router),
  logSettings: {
    level: environment.stage === EnvStage.PRODUCTION ? "error" : "info",
  },
});

export const main = handler;
