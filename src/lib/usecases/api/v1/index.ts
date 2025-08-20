import root from "./root";

export const prefix = "/api/v1";

const routes = (server) => {
  root(server);
};

export default routes;
