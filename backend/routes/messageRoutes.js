import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { getMessages, postMessage } from "../controllers/messageController.js";

const router = Router();

router.use(authenticate);
router.get("/:expenseId", getMessages);
router.post("/", postMessage);

export default router;
