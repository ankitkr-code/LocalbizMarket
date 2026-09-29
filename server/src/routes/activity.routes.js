import { Router } from "express";
import { getActivityProofs, getBusinessActivitySummary, reviewProof, submitCheckIn, submitQrConfirmation, submitReview, submitSalesClaim } from "../controllers/activity.controller.js";
import { requireFirebaseAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/businesses/:businessId/summary", requireFirebaseAuth, getBusinessActivitySummary);
router.get("/proofs", requireFirebaseAuth, requireRole("admin"), getActivityProofs);
router.patch("/proofs/:type/:id", requireFirebaseAuth, requireRole("admin"), reviewProof);
router.post("/sales-claims", requireFirebaseAuth, requireRole("business_owner", "admin"), submitSalesClaim);
router.post("/check-ins", requireFirebaseAuth, submitCheckIn);
router.post("/reviews", requireFirebaseAuth, submitReview);
router.post("/qr-confirmations", requireFirebaseAuth, submitQrConfirmation);

export default router;
