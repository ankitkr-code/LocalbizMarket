import { Router } from "express";
import { addFunds, getWallet } from "../controllers/wallet.controller.js";
import { requireFirebaseAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/:userId", requireFirebaseAuth, requireRole("investor", "admin"), getWallet);
router.post("/:userId/add-funds", requireFirebaseAuth, requireRole("investor", "admin"), addFunds);

export default router;
