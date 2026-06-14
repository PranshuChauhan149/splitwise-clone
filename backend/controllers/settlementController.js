import { sendSuccess, sendError } from "../utils/responseHelpers.js";
import { createSettlementRecord, listSettlementsForGroup, listSettlementsForUser } from "../services/settlementService.js";
import { findGroupById, findMembership } from "../services/groupService.js";

export const createSettlement = async (req, res, next) => {
  try {
    const { groupId, fromUserId, toUserId, amount, note } = req.body;

    if (!groupId || !fromUserId || !toUserId || amount === undefined) {
      return sendError(res, "Required fields: groupId, fromUserId, toUserId, amount", 400);
    }

    if (fromUserId === toUserId) {
      return sendError(res, "fromUserId and toUserId must be different", 400);
    }

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return sendError(res, "Amount must be a positive number", 400);
    }

    const group = await findGroupById(groupId);
    if (!group) {
      return sendError(res, "Group not found", 404);
    }

    const requesterMembership = await findMembership(req.user.id, groupId);
    if (!requesterMembership) {
      return sendError(res, "Access denied: not a group member", 403);
    }

    const fromMember = await findMembership(fromUserId, groupId);
    const toMember = await findMembership(toUserId, groupId);
    if (!fromMember || !toMember) {
      return sendError(res, "Both sender and receiver must be group members", 400);
    }

    const settlement = await createSettlementRecord({
      groupId,
      fromUserId,
      toUserId,
      amount: parsedAmount,
      note,
      createdById: req.user.id,
    });

    return sendSuccess(res, { settlement }, 201);
  } catch (error) {
    next(error);
  }
};

export const getGroupSettlements = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const membership = await findMembership(req.user.id, groupId);
    if (!membership) {
      return sendError(res, "Access denied: not a group member", 403);
    }

    const settlements = await listSettlementsForGroup(groupId);
    return sendSuccess(res, { settlements });
  } catch (error) {
    next(error);
  }
};

export const getSettlementSummary = async (req, res, next) => {
  try {
    const settlements = await listSettlementsForUser(req.user.id);
    return sendSuccess(res, { settlements });
  } catch (error) {
    next(error);
  }
};
