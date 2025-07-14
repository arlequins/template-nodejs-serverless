import environment from "@constants/environment";
import { EnvStage } from "@typing";
import { DTTM_FORMAT, setTimeFormat } from "./date";

/**
 * Logs informational messages unless the environment is TEST.
 * Accepts both string and non-string errors.
 * @param error - The error or message to log.
 */
export const loggingInfo = (obj: unknown) => {
  if (environment.stage === EnvStage.TEST) {
    return;
  }

  if (typeof obj !== "string") {
    return console.info(JSON.stringify(obj));
  }
  console.info(obj);
};

/**
 * Logs debug messages only if the environment is not PRODUCTION or TEST.
 * @param obj - The object or message to log for debugging.
 */
export const loggingDebug = (obj: unknown) => {
  if (
    environment.stage !== EnvStage.PRODUCTION &&
    environment.stage !== EnvStage.TEST
  ) {
    console.debug(obj);
  }
};

/**
 * Normalizes error objects to a standard format for logging.
 * If the error contains 'e' or 'msg' properties, extracts them.
 * Otherwise, returns the error as is.
 * @param error - The error object to normalize.
 * @returns An object with error and optional message.
 */
const normalizeError = (error: unknown) => {
  if (error && typeof error === "object" && ("e" in error || "msg" in error)) {
    const { e, msg } = error as { e?: unknown; msg?: string };
    return {
      error: e ?? error,
      msg,
    };
  }

  if (error instanceof Error) {
    return {
      error: error.stack || error.message,
      msg: error.message,
    };
  }

  return {
    error,
  };
};

/**
 * Logs error messages with a tracking keyword and timestamp.
 * Skips logging if the environment is TEST.
 * @param name - The name or context for the error.
 * @param e - The error object to log.
 */
export const loggingError = (name: string, e: unknown) => {
  if (environment.stage === EnvStage.TEST) {
    return;
  }

  const { error, msg } = normalizeError(e);

  console.error(`[tracking-${setTimeFormat(DTTM_FORMAT)}-${name}]`, {
    msg,
    error,
  });
};
