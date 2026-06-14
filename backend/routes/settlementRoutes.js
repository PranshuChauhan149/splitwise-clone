import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireGroupMembership } from "../middleware/groupMiddleware.js";
import { createSettlement, getGroupSettlements, getSettlementSummary } from "../controllers/settlementController.js";

const router = Router();

router.use(protect);
router.post("/", createSettlement);
router.get("/group/:groupId", requireGroupMembership, getGroupSettlements);
router.get("/me", getSettlementSummary);

export default router;
