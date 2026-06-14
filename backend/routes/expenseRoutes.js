import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireExpenseAccess } from "../middleware/expenseMiddleware.js";
import {
  createExpense,
  getGroupExpenses,
  getExpenseById,
} from "../controllers/expenseController.js";

const router = Router();

router.use(protect);
router.post("/", createExpense);
router.get("/group/:groupId", getGroupExpenses);
router.get("/:expenseId", requireExpenseAccess, getExpenseById);

export default router;
