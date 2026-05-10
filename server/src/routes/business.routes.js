import { Router } from "express";
import { createBusiness, listBusinesses, reviewBusiness } from "../controllers/business.controller.js";
import { requireFirebaseAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireFirebaseAuth, listBusinesses);
router.post("/", requireFirebaseAuth, requireRole("business_owner", "admin"), createBusiness);
router.patch("/:id/review", requireFirebaseAuth, requireRole("admin"), reviewBusiness);

export default router;
