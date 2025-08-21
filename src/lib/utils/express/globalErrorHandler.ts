import { Request, Response, NextFunction } from "express";
import RESPONSE_CODES from "@constants/express/response-codes";
import STATUS_CODES from "@constants/express/status-codes";
import { loggingInfo } from "../logger";

const safeParse = (str: string) => {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
};

export const globalErrorHandler = (
  err,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  loggingInfo(err);
  const errors = err?.errors || [];

  if (err?.name === "ValidationError" && err?.errors?.length) {
    return res.status(STATUS_CODES.ERROR_BAD_PARAMS).json({
      msg: RESPONSE_CODES.ERROR_101_BAD_PARAMS,
      errors,
    });
  }
  if (err?.name === "BadRequestError") {
    return res.status(err.statusCode).json({
      msg: RESPONSE_CODES.ERROR_101_BAD_PARAMS,
      errors: [...errors, safeParse(err.message)],
    });
  }
  if (err?.name === "ForbiddenError") {
    return res.status(err.statusCode).json({
      msg: RESPONSE_CODES.ERROR_102_VALIDATION_CHECK,
      errors: [...errors, safeParse(err.message)],
    });
  }
  if (err?.name === "InternalServerError") {
    return res.status(err.statusCode).json({
      msg: RESPONSE_CODES.ERROR_103_UNEXPECTED,
      errors: [...errors, safeParse(err.message)],
    });
  }
  if (err?.name === "NotFoundError") {
    return res.status(err.statusCode).json({
      msg: RESPONSE_CODES.ERROR_400_NO_DATA,
      errors: [...errors, safeParse(err.message)],
    });
  }
  // fallback
  return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    msg: RESPONSE_CODES.ERROR_105_UNKNOWN,
    errors,
  });
};
