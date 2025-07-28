import { wrapRoute } from "@libs/utils/express";
import GetRoot from "./Get";

const document = (server) => {
  server.get(`/root`, wrapRoute(GetRoot));
};

export default document;
