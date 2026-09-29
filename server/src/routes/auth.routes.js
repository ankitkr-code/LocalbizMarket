import { Router } from "express";
import { getMe, /*login, register,*/ saveProfile } from "../controllers/auth.controller.js";
import { requireFirebaseAuth } from "../middleware/auth.middleware.js";

const router = Router();

//router.post("/register", register);
//router.post("/login", login);
router.get("/me", requireFirebaseAuth, getMe);
router.post("/profile", requireFirebaseAuth, saveProfile);

export default router;
