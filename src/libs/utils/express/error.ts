import createHttpError from "http-errors";

export const errorBadRequest = <T>(data: T) =>
  createHttpError.BadRequest(
    JSON.stringify(typeof data === "string" ? { reason: data } : data),
  );

export const errorForbidden = <T>(data: T) =>
  createHttpError.Forbidden(
    JSON.stringify(typeof data === "string" ? { reason: data } : data),
  );

export const errorNotFound = <T>(data: T) =>
  createHttpError.NotFound(
    JSON.stringify(typeof data === "string" ? { reason: data } : data),
  );

export const errorInternalServerError = <T>(data: T) =>
  createHttpError.InternalServerError(
    JSON.stringify(typeof data === "string" ? { reason: data } : data),
  );
