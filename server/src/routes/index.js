import { Router } from "express";
import authRoutes from "./auth.routes.js";
import businessRoutes from "./business.routes.js";
import walletRoutes from "./wallet.routes.js";
import investmentRoutes from "./investment.routes.js";
import purchaseRoutes from "./purchase.routes.js";
import chartRoutes from "./chart.routes.js";
import chatbotRoutes from "./chatbot.routes.js";
import paymentRoutes from "./payment.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/businesses", businessRoutes);
router.use("/wallets", walletRoutes);
router.use("/investments", investmentRoutes);
router.use("/purchases", purchaseRoutes);
router.use("/charts", chartRoutes);
router.use("/chatbot", chatbotRoutes);
router.use("/payments", paymentRoutes);

export default router;
