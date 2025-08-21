import { isObject } from "lodash";
import { convertKeysToSnakeCase } from "../transform";
import { RequestHandler } from "express";
import { loggingInfo } from "../logger";

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

export const loggingMiddleware: RequestHandler = (req, _res, next) => {
  loggingInfo(
    JSON.stringify({
      path: req.path,
      params: req.params,
      query: req.query,
    }),
  );
  next();
};
