import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getBalanceSummary, getGroupBalances } from "../controllers/balanceController.js";

const router = Router();

router.use(protect);
router.get("/summary", getBalanceSummary);
router.get("/group/:groupId", getGroupBalances);

export default router;
