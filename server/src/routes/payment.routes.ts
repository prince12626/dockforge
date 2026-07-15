import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { verifyPayment } from "../controllers/payment.controller.js";

const router = Router();

router.post("/verify", authMiddleware, verifyPayment);

export default router;
