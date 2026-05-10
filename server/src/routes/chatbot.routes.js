import { Router } from "express";
import { askChatbot } from "../controllers/chatbot.controller.js";
import { requireFirebaseAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/ask", requireFirebaseAuth, askChatbot);

export default router;
