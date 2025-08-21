import { RequestHandler } from "express";
import { errorBadRequest } from "@lib/utils/express/error";
import RESPONSE_CODES from "@constants/express/response-codes";

const get = (async (req, res) => {
  const query = req.query;
  if (!query) {
    throw errorBadRequest(RESPONSE_CODES.ERROR_101_BAD_PARAMS);
  }
  res.json({
    status: true,
  });
}) as RequestHandler;

export default {
  get,
};
