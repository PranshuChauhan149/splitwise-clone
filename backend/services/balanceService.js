import { getPrisma } from "../utils/prismaClient.js";
import { findGroupsForUser } from "./groupService.js";
import { listSettlementsForGroup } from "./settlementService.js";

const normalizeAmount = (value) => {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return 0;
  }
  return parseFloat(numericValue.toFixed(2));
};

const buildBalanceMap = (expenses) => {
  const balances = new Map();

  const adjustBalance = (userId, amount) => {
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount)) {
      return;
    }

    const current = balances.get(userId) || 0;
    balances.set(userId, normalizeAmount(current + numericAmount));
  };

  expenses.forEach((expense) => {
    expense.splits.forEach((split) => {
      if (split.userId === expense.paidById) {
        return;
      }
      adjustBalance(split.userId, -split.amount);
      adjustBalance(expense.paidById, split.amount);
    });
  });

  return balances;
};

const applySettlementAdjustments = (balances, settlements) => {
  settlements.forEach((settlement) => {
    const amount = Number(settlement.amount);
    if (!Number.isFinite(amount)) {
      return;
    }
    const currentFrom = balances.get(settlement.fromUserId) || 0;
    balances.set(settlement.fromUserId, normalizeAmount(currentFrom + amount));

    const currentTo = balances.get(settlement.toUserId) || 0;
    balances.set(settlement.toUserId, normalizeAmount(currentTo - amount));
  });
};

export const getGroupExpensesWithSplits = async (groupId) => {
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

export const calculateGroupBalances = async (groupId) => {
  const [expenses, settlements] = await Promise.all([
    getGroupExpensesWithSplits(groupId),
    listSettlementsForGroup(groupId),
  ]);

  const rawBalances = buildBalanceMap(expenses);
  applySettlementAdjustments(rawBalances, settlements);

  const users = new Map();
  expenses.forEach((expense) => {
    users.set(expense.paidBy.id, expense.paidBy);
    expense.splits.forEach((split) => {
      users.set(split.user.id, split.user);
    });
  });

  settlements.forEach((settlement) => {
    if (settlement.fromUser) {
      users.set(settlement.fromUser.id, settlement.fromUser);
    }
    if (settlement.toUser) {
      users.set(settlement.toUser.id, settlement.toUser);
    }
  });

  const balances = Array.from(rawBalances.entries()).map(([userId, balance]) => ({
    user: users.get(userId),
    balance,
  }));

  return {
    groupId,
    balances,
  };
};

export const calculateBalanceSummary = async (userId) => {
  const groups = await findGroupsForUser(userId);
  const summaries = [];

  for (const group of groups) {
    const [expenses, settlements] = await Promise.all([
      getPrisma().expense.findMany({
        where: { groupId: group.id },
        include: {
          paidBy: true,
          splits: true,
        },
      }),
      listSettlementsForGroup(group.id),
    ]);

    const rawBalances = buildBalanceMap(expenses);
    applySettlementAdjustments(rawBalances, settlements);

    const balance = rawBalances.get(userId) || 0;
    summaries.push({
      groupId: group.id,
      groupName: group.name,
      balance,
    });
  }

  const total = normalizeAmount(summaries.reduce((sum, item) => sum + item.balance, 0));

  return {
    userId,
    total,
    groups: summaries,
  };
};
