import { Router } from "express";
import { createPaymentIntent } from "../controllers/payment.controller.js";
import { requireFirebaseAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/intent", requireFirebaseAuth, requireRole("investor"), createPaymentIntent);

export default router;
