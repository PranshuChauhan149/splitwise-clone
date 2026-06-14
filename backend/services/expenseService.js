import { getPrisma } from "../utils/prismaClient.js";

export const createExpenseRecord = async (data) => {
  return getPrisma().expense.create({ data });
};

export const listExpensesForGroup = async (groupId) => {
  return getPrisma().expense.findMany({
    where: { groupId },
    include: {
      paidBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      splits: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
};

export const findExpenseById = async (expenseId) => {
  return getPrisma().expense.findUnique({
    where: { id: expenseId },
    include: {
      paidBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      splits: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
};

export const listGroupMembers = async (groupId) => {
  return getPrisma().membership.findMany({
    where: { groupId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};
