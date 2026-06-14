import { Router } from "express";
import { register, login, logout, me } from "../controllers/authController.js";
import { validateRegister, validateLogin } from "../middleware/authValidation.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/logout", logout);
router.get("/me", protect, me);

export default router;
