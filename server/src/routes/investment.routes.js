import { Router } from "express";
import { createInvestment, listInvestments } from "../controllers/investment.controller.js";
import { requireFirebaseAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireFirebaseAuth, requireRole("investor", "admin"), listInvestments);
router.post("/", requireFirebaseAuth, requireRole("investor"), createInvestment);

export default router;
