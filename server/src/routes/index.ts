import { Router } from "express";
import { auth } from "../config/better-auth.config.js";
import { toNodeHandler } from "better-auth/node";
import vpsRouter from "./vps.route.js";
import plansRouter from "./plans.route.js";
import paymentRouter from "./payment.routes.js";

const router = Router();

// Authentication via Better Auth
router.use("/authentication", toNodeHandler(auth));
router.use("/vps", vpsRouter);
router.use("/plans", plansRouter);
router.use("/payments", paymentRouter);

export default router;
