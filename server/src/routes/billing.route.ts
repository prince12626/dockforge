import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getBillingOverview } from "../controllers/billing.controller.js";

const router = Router();

router.get("/", authMiddleware, getBillingOverview);

export default router;
