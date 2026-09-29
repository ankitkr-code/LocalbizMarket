import { Router } from "express";
import { listPendingPurchases, listPurchases, reviewPurchaseRequest, uploadPurchase } from "../controllers/purchase.controller.js";
import { requireFirebaseAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireFirebaseAuth, requireRole("business_owner", "admin"), listPurchases);
router.post("/", requireFirebaseAuth, requireRole("business_owner", "admin"), uploadPurchase);
router.get("/admin/pending", requireFirebaseAuth, requireRole("admin"), listPendingPurchases);
router.patch("/:id/review", requireFirebaseAuth, requireRole("admin"), reviewPurchaseRequest);

export default router;
