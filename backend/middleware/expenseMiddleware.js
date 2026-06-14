import { findExpenseById } from "../services/expenseService.js";
import { findMembership } from "../services/groupService.js";

export const requireExpenseAccess = async (req, res, next) => {
  const { expenseId } = req.params;
  const expense = await findExpenseById(expenseId);

  if (!expense) {
    return res.status(404).json({ success: false, error: "Expense not found" });
  }

  const membership = await findMembership(req.user.id, expense.groupId);
  if (!membership) {
    return res.status(403).json({ success: false, error: "Access denied: not a group member" });
  }

  req.expense = expense;
  next();
};
