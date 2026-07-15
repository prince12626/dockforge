import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { fetchPlans, selectPlan } from "../controllers/plan.controller.js";

const router = Router();

router.get("/", authMiddleware, fetchPlans);
router.post("/:planId/select", authMiddleware, selectPlan);

export default router;
