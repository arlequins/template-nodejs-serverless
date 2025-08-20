import express from "express";
import cors from "cors";
import compression from "compression";
import { EnvStage } from "@typing";
import routes, { prefix } from "@lib/usecases/api/v1";
import environment, { constants } from "@constants/environment";
import {
  resultExpressAdditionalHeaders,
  snakeCaseMiddleware,
} from "@lib/utils/express";

const app = express();
app.disable("x-powered-by");

// Apply the middleware to all routes
app.use(snakeCaseMiddleware);

const router = express.Router();

if ([EnvStage.PRODUCTION].includes(environment.stage)) {
  app.use(
    cors({
      origin: constants.ALLOWED_ORIGIN,
      methods: "GET,POST,OPTION",
      preflightContinue: true,
      credentials: true,
      optionsSuccessStatus: 204,
    }),
  );
} else {
  app.use(
    cors({
      origin: "*",
    }),
  );
}

app.use(resultExpressAdditionalHeaders);

router.use(compression());
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

routes(router);
app.use(prefix, router);

export default app;
