import { Router } from "express";
import { getDashboardCharts, getBusinessCharts } from "../controllers/chart.controller.js";
import { requireFirebaseAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/dashboard", requireFirebaseAuth, requireRole("investor", "admin"), getDashboardCharts);
router.get("/dashboard/business/:businessId", requireFirebaseAuth, requireRole("investor", "admin"), getBusinessCharts);

export default router;
