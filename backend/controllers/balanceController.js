import { sendSuccess, sendError } from "../utils/responseHelpers.js";
import { calculateBalanceSummary, calculateGroupBalances } from "../services/balanceService.js";
import { findMembership } from "../services/groupService.js";

export const getGroupBalances = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const membership = await findMembership(req.user.id, groupId);
    if (!membership) {
      return sendError(res, "Access denied: not a group member", 403);
    }

    const balanceResult = await calculateGroupBalances(groupId);
    return sendSuccess(res, { balances: balanceResult.balances, groupId: balanceResult.groupId });
  } catch (error) {
    next(error);
  }
};

export const getBalanceSummary = async (req, res, next) => {
  try {
    const summary = await calculateBalanceSummary(req.user.id);
    return sendSuccess(res, { summary });
  } catch (error) {
    next(error);
  }
};
