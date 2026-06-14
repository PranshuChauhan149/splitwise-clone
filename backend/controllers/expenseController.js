import { getPrisma } from "../utils/prismaClient.js";
import {
  listExpensesForGroup,
  findExpenseById,
  listGroupMembers,
} from "../services/expenseService.js";
import { findMembership } from "../services/groupService.js";
import { sendSuccess, sendError } from "../utils/responseHelpers.js";

const validateSplitUsers = (splits, memberIds) => {
  const invalidUser = splits.find((split) => !memberIds.includes(split.userId));
  if (invalidUser) {
    throw new Error("All split participants must be group members");
  }
};

const validateSplit = ({ amount, splitType, splits, groupMembers }) => {
  const totalAmount = Number(amount);
  if (Number.isNaN(totalAmount) || totalAmount <= 0) {
    throw new Error("Amount must be a positive number");
  }

  const memberIds = groupMembers.map((member) => member.user.id);

  switch (splitType) {
    case "EQUAL": {
      const equalShare = parseFloat((totalAmount / memberIds.length).toFixed(2));
      const splitsWithAmount = memberIds.map((userId) => ({
        userId,
        amount: equalShare,
        percentage: null,
        share: null,
      }));

      const roundedTotal = splitsWithAmount.reduce((sum, s) => sum + s.amount, 0);
      const difference = parseFloat((totalAmount - roundedTotal).toFixed(2));
      if (difference !== 0) {
        splitsWithAmount[0].amount = parseFloat((splitsWithAmount[0].amount + difference).toFixed(2));
      }
      return splitsWithAmount;
    }
    case "UNEQUAL": {
      if (!Array.isArray(splits) || splits.length === 0) {
        throw new Error("Unequal split requires a splits array with amounts");
      }
      validateSplitUsers(splits, memberIds);
      const amountSum = splits.reduce((sum, split) => sum + Number(split.amount), 0);
      if (parseFloat(amountSum.toFixed(2)) !== parseFloat(totalAmount.toFixed(2))) {
        throw new Error("Unequal split amounts must add up to the total amount");
      }
      return splits.map((split) => ({
        userId: split.userId,
        amount: Number(split.amount),
        percentage: null,
        share: null,
      }));
    }
    case "PERCENTAGE": {
      if (!Array.isArray(splits) || splits.length === 0) {
        throw new Error("Percentage split requires a splits array with percentages");
      }
      validateSplitUsers(splits, memberIds);
      const percentageSum = splits.reduce((sum, split) => sum + Number(split.percentage), 0);
      if (parseFloat(percentageSum.toFixed(2)) !== 100) {
        throw new Error("Percentage split totals must equal 100");
      }
      return splits.map((split) => {
        const splitAmount = parseFloat(((Number(split.percentage) / 100) * totalAmount).toFixed(2));
        return {
          userId: split.userId,
          amount: splitAmount,
          percentage: Number(split.percentage),
          share: null,
        };
      });
    }
    case "SHARE": {
      if (!Array.isArray(splits) || splits.length === 0) {
        throw new Error("Share split requires a splits array with share values");
      }
      validateSplitUsers(splits, memberIds);
      const shareSum = splits.reduce((sum, split) => sum + Number(split.share), 0);
      if (shareSum <= 0) {
        throw new Error("Share values must be greater than zero");
      }
      const shareUnit = totalAmount / shareSum;
      const splitsWithAmount = splits.map((split) => ({
        userId: split.userId,
        amount: parseFloat((Number(split.share) * shareUnit).toFixed(2)),
        percentage: null,
        share: Number(split.share),
      }));
      const roundedTotal = splitsWithAmount.reduce((sum, s) => sum + s.amount, 0);
      const difference = parseFloat((totalAmount - roundedTotal).toFixed(2));
      if (difference !== 0) {
        splitsWithAmount[0].amount = parseFloat((splitsWithAmount[0].amount + difference).toFixed(2));
      }
      return splitsWithAmount;
    }
    default:
      throw new Error("Unsupported split type");
  }
};

export const createExpense = async (req, res, next) => {
  try {
    const { groupId, title, description, amount, paidById, splitType, splits } = req.body;

    if (!groupId || !title || !amount || !paidById || !splitType) {
      return sendError(res, "Missing required fields", 400);
    }

    const membership = await findMembership(req.user.id, groupId);
    if (!membership) {
      return sendError(res, "User must be a member of the group to create expenses", 403);
    }

    const groupMembers = await listGroupMembers(groupId);
    if (!groupMembers || groupMembers.length === 0) {
      return sendError(res, "Group must have members to split expenses", 400);
    }

    if (!groupMembers.some((member) => member.user.id === paidById)) {
      return sendError(res, "Payer must be a group member", 400);
    }

    const calculatedSplits = validateSplit({ amount, splitType, splits, groupMembers });

    const expense = await getPrisma().expense.create({
      data: {
        groupId,
        title,
        description,
        amount: Number(amount),
        splitType,
        paidById,
        splits: {
          create: calculatedSplits.map((split) => ({
            userId: split.userId,
            amount: split.amount,
            percentage: split.percentage,
            share: split.share,
          })),
        },
      },
      include: {
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

    return sendSuccess(res, { expense }, 201);
  } catch (error) {
    return sendError(res, error.message || "Unable to create expense", 400);
  }
};

export const getGroupExpenses = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const membership = await findMembership(req.user.id, groupId);
    if (!membership) {
      return sendError(res, "User must be a member of the group to view expenses", 403);
    }

    const expenses = await listExpensesForGroup(groupId);
    return sendSuccess(res, { expenses });
  } catch (error) {
    next(error);
  }
};

export const getExpenseById = async (req, res, next) => {
  try {
    return sendSuccess(res, { expense: req.expense });
  } catch (error) {
    next(error);
  }
};
