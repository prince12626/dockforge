import { Router } from "express";
import { auth } from "../config/better-auth.config.js";
import { toNodeHandler } from "better-auth/node";
import vpsRouter from "./vps.route";

const router = Router();

// Authentication via Better Auth
router.use("/authentication", toNodeHandler(auth));
router.use("/vps", vpsRouter);

export default router;
