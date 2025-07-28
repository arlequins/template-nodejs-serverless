import serverlessExpress from "@codegenie/serverless-express";
import environment from "@constants/environment";
import { EnvStage } from "@typing";
import app from "./app";

const handler = serverlessExpress({
  app,
  logSettings: {
    level: environment.stage === EnvStage.PRODUCTION ? "error" : "info",
  },
});

export const main = handler;
