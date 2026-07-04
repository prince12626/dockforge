import { Router } from "express";
import {
      createVps,
      deleteVps,
      getMyVps,
      getVps,
      restartVps,
      startVps,
} from "../controllers/vps.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, createVps);
router.get("/", authMiddleware, getMyVps);
router.get("/:id", authMiddleware, getVps);
router.get("/stats/:id", authMiddleware, getVps);
router.post("/:id/start", authMiddleware, startVps);
router.post("/:id/restart", authMiddleware, restartVps);
router.delete("/:id", authMiddleware, deleteVps);

export default router;
