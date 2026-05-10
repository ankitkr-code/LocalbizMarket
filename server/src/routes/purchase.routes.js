import { Router } from "express";
import { listPurchases, uploadPurchase } from "../controllers/purchase.controller.js";
import { requireFirebaseAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireFirebaseAuth, requireRole("business_owner", "admin"), listPurchases);
router.post("/", requireFirebaseAuth, requireRole("business_owner", "admin"), uploadPurchase);

export default router;
