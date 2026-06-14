import { sendSuccess, sendError } from "../utils/responseHelpers.js";
import { listMessagesForExpense, createMessageRecord } from "../services/messageService.js";
import { findExpenseById } from "../services/expenseService.js";
import { findMembership } from "../services/groupService.js";
import { getSocketServer } from "../utils/socketServer.js";

const getRoomName = (expenseId) => `expense-${expenseId}`;

export const getMessages = async (req, res, next) => {
  try {
    const { expenseId } = req.params;
    const expense = await findExpenseById(expenseId);
    if (!expense) {
      return sendError(res, "Expense not found", 404);
    }

    const membership = await findMembership(req.user.id, expense.groupId);
    if (!membership) {
      return sendError(res, "Access denied: not a group member", 403);
    }

    const messages = await listMessagesForExpense(expenseId);
    return sendSuccess(res, { messages });
  } catch (error) {
    next(error);
  }
};

export const postMessage = async (req, res, next) => {
  try {
    const { expenseId, content } = req.body;
    if (!expenseId || !content || !content.trim()) {
      return sendError(res, "expenseId and content are required", 400);
    }

    const expense = await findExpenseById(expenseId);
    if (!expense) {
      return sendError(res, "Expense not found", 404);
    }

    const membership = await findMembership(req.user.id, expense.groupId);
    if (!membership) {
      return sendError(res, "Access denied: not a group member", 403);
    }

    const message = await createMessageRecord({
      expenseId,
      senderId: req.user.id,
      content: content.trim(),
    });

    const io = getSocketServer();
    const room = getRoomName(expenseId);
    io.to(room).emit("receive-message", {
      id: message.id,
      expenseId: message.expenseId,
      content: message.content,
      createdAt: message.createdAt,
      sender: message.sender,
    });

    return sendSuccess(res, { message }, 201);
  } catch (error) {
    next(error);
  }
};
