import { Router } from "express";
import subRouter from "./project/sub-router";

const router = Router();

router.use("/project", subRouter);

export default router;
