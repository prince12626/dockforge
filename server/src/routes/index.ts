import { Router } from "express";
import { auth } from "../config/better-auth.config.js";
import { toNodeHandler } from "better-auth/node";
import vpsRouter from "./vps.route.js";
import plansRouter from "./plans.route.js";
import paymentRouter from "./payment.routes.js";
import billingRouter from "./billing.route.js";
import adminVpsRouter from "./admin-vps.route.js";

const router = Router();

router.use("/authentication", toNodeHandler(auth));
router.use("/vps", vpsRouter);
router.use("/plans", plansRouter);
router.use("/payments", paymentRouter);
router.use("/billing", billingRouter);
router.use("/admin/vps", adminVpsRouter);

export default router;
