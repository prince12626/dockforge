import { Router } from "express";

import { adminMiddleware } from "../middlewares/admin.middleware.js";

import {
  getAllAdminVps,
  getAdminVpsStats,
  getAdminVpsDetails,
  startAdminVps,
  stopAdminVps,
  restartAdminVps,
  deleteAdminVps,
} from "../controllers/admin-vps.controller.js";

const router = Router();

router.use(adminMiddleware);

router.get("/", getAllAdminVps);
router.get("/stats", getAdminVpsStats);
router.get("/:id", getAdminVpsDetails);

router.post("/:id/start", startAdminVps);
router.post("/:id/stop", stopAdminVps);
router.post("/:id/restart", restartAdminVps);

router.delete("/:id", deleteAdminVps);

export default router;
