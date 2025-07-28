import createHttpError from "http-errors";

const STATUS_CODES = {
  ERROR_BAD_PARAMS: createHttpError.BadRequest().statusCode,
  FORBIDDEN: createHttpError.Forbidden().statusCode,
  INTERNAL_SERVER_ERROR: createHttpError.InternalServerError().statusCode,
};

export default STATUS_CODES;
