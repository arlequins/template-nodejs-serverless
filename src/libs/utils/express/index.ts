import { isObject } from "lodash";
import { convertKeysToSnakeCase } from "../transform";
import { RequestHandler } from "express";
import { loggingInfo } from "../logger";
import STATUS_CODES from "@constants/express/status-codes";
import RESPONSE_CODES from "@constants/express/response-codes";

const checkError = (error, res) => {
  const errors = error?.errors || [];

  if (error?.name === "ValidationError" && error?.errors?.length) {
    return res.status(STATUS_CODES.ERROR_BAD_PARAMS).json({
      msg: RESPONSE_CODES.ERROR_101_BAD_PARAMS,
      errors,
    });
  }

  if (error?.name === "BadRequestError") {
    return res.status(error.statusCode).json({
      msg: RESPONSE_CODES.ERROR_101_BAD_PARAMS,
      errors: [...errors, JSON.parse(error.message)],
    });
  }

  if (error?.name === "ForbiddenError") {
    return res.status(error.statusCode).json({
      msg: RESPONSE_CODES.ERROR_102_VALIDATION_CHECK,
      errors: [...errors, JSON.parse(error.message)],
    });
  }

  if (error?.name === "InternalServerError") {
    return res.status(error.statusCode).json({
      msg: RESPONSE_CODES.ERROR_103_UNEXPECTED,
      errors: [...errors, JSON.parse(error.message)],
    });
  }

  if (error?.name === "NotFoundError") {
    return res.status(error.statusCode).json({
      msg: RESPONSE_CODES.ERROR_400_NO_DATA,
      errors: [...errors, JSON.parse(error.message)],
    });
  }

  return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    msg: RESPONSE_CODES.ERROR_105_UNKNOWN,
    errors,
  });
};

export const resultExpressAdditionalHeaders = (req, res, next) => {
  if (req.secure) {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubdomains; preload",
    );
  }

  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Xss-Protection", "1; mode=block");
  res.setHeader(
    "Cache-Control",
    "no-cache, no-store, must-revalidate, private",
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  next();
};

export const snakeCaseMiddleware = (_req, res, next) => {
  const originalSend = res.send;
  res.send = function (rawBody) {
    const body = JSON.parse(rawBody);
    if (!isObject(body)) {
      return originalSend.call(this, rawBody);
    }

    const convertBody = convertKeysToSnakeCase(body);
    return originalSend.call(this, JSON.stringify(convertBody));
  };
  next();
};

export const wrapRoute = (handler) =>
  (async (req, res, next) => {
    try {
      loggingInfo(
        JSON.stringify({
          path: req.path,
          params: req.params,
          query: req.query,
        }),
      );

      const originalSend = res.send;
      res.send = function (body) {
        loggingInfo(
          JSON.stringify({
            response: body,
            statusCode: res.statusCode,
          }),
        );
        return originalSend.call(this, body);
      };
      await handler(req, res, next);
    } catch (error) {
      loggingInfo(error);
      checkError(error, res);
    }
  }) as RequestHandler;
