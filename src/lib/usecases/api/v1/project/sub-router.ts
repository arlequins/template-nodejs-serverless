import { Router } from "express";
import root from "./root";

const router = Router();

router.get("/root", root.get);

export default router;
