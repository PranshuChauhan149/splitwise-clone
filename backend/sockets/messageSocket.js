import { verifyToken } from "../utils/jwtUtils.js";
import { findUserById } from "../services/authService.js";
import { findExpenseById } from "../services/expenseService.js";
import { findMembership } from "../services/groupService.js";
import { createMessageRecord } from "../services/messageService.js";

const getRoomName = (expenseId) => `expense-${expenseId}`;

const buildSocketUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

const parseCookies = (cookieHeader = "") => {
  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((cookie) => cookie.trim().split("=").map(decodeURIComponent))
      .filter(([name]) => name),
  );
};

export const registerMessageSocketHandlers = (io) => {
  io.use(async (socket, next) => {
    try {
      const handshakeCookies = parseCookies(socket.handshake.headers.cookie || "");
      const token = socket.handshake.auth?.token || socket.handshake.query?.token || handshakeCookies.token;
      if (!token) {
        return next(new Error("Authentication required"));
      }

      const payload = verifyToken(token);
      const user = await findUserById(payload.userId);
      if (!user) {
        return next(new Error("Invalid authentication token"));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Socket authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("join-expense", async (payload = {}, callback) => {
      try {
        const { expenseId } = payload;
        if (!expenseId) {
          throw new Error("expenseId is required");
        }

        const expense = await findExpenseById(expenseId);
        if (!expense) {
          throw new Error("Expense not found");
        }

        const membership = await findMembership(socket.user.id, expense.groupId);
        if (!membership) {
          throw new Error("Access denied: not a group member");
        }

        const room = getRoomName(expenseId);
        socket.join(room);
        callback?.({ success: true, room });
      } catch (error) {
        callback?.({ success: false, message: error.message });
      }
    });

    socket.on("send-message", async (payload = {}, callback) => {
      try {
        const { expenseId, content } = payload;
        if (!expenseId || !content || !content.trim()) {
          throw new Error("expenseId and content are required");
        }

        const expense = await findExpenseById(expenseId);
        if (!expense) {
          throw new Error("Expense not found");
        }

        const membership = await findMembership(socket.user.id, expense.groupId);
        if (!membership) {
          throw new Error("Access denied: not a group member");
        }

        const message = await createMessageRecord({
          expenseId,
          senderId: socket.user.id,
          content: content.trim(),
        });

        const payloadToSend = {
          id: message.id,
          expenseId: message.expenseId,
          content: message.content,
          createdAt: message.createdAt,
          sender: buildSocketUser(message.sender),
        };

        const room = getRoomName(expenseId);
        io.to(room).emit("receive-message", payloadToSend);

        callback?.({ success: true, message: payloadToSend });
      } catch (error) {
        callback?.({ success: false, message: error.message });
      }
    });

    socket.on("disconnect", () => {
      // no-op: socket.io handles cleanup automatically
    });
  });
};
