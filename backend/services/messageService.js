import { getPrisma } from "../utils/prismaClient.js";

export const listMessagesForExpense = async (expenseId) => {
  return getPrisma().message.findMany({
    where: { expenseId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const createMessageRecord = async ({ expenseId, senderId, content }) => {
  return getPrisma().message.create({
    data: {
      expenseId,
      senderId,
      content,
    },
    include: {
      sender: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};
