import { S3Client } from "@aws-sdk/client-s3";
import env from "@constants/environment";
import { loggingDebug } from "@lib/utils/logger";
import { EnvStage } from "@typing/index";

/**
 * Returns a mock S3 client when running in OFFLINE stage.
 * The mock client logs the request and returns a dummy response.
 * Otherwise, returns a real S3Client instance.
 */
const client =
  env.stage === EnvStage.OFFLINE
    ? {
        /**
         * Mock send method for S3 client in offline mode.
         * Logs the arguments and returns a dummy successful response.
         */
        send: (...args: unknown[]) => {
          loggingDebug({
            type: "ignore s3 client in offline mode",
            data: args,
          });
          // Return a dummy response mimicking S3Client's response structure
          return Promise.resolve({
            Body: null,
            $metadata: {
              httpStatusCode: 200,
            },
          });
        },
      }
    : new S3Client({});

export default client;
