import { Router } from "express";
import { getDashboardCharts } from "../controllers/chart.controller.js";
import { requireFirebaseAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/dashboard", requireFirebaseAuth, requireRole("admin"), getDashboardCharts);

export default router;
