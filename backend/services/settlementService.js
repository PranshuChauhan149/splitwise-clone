import { getPrisma } from "../utils/prismaClient.js";

export const createSettlementRecord = async (data) => {
  return getPrisma().settlement.create({ data });
};

export const listSettlementsForGroup = async (groupId) => {
  return getPrisma().settlement.findMany({
    where: { groupId },
    orderBy: { createdAt: "desc" },
    include: {
      fromUser: {
        select: { id: true, name: true, email: true },
      },
      toUser: {
        select: { id: true, name: true, email: true },
      },
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

export const listSettlementsForUser = async (userId) => {
  return getPrisma().settlement.findMany({
    where: {
      OR: [{ fromUserId: userId }, { toUserId: userId }],
    },
    orderBy: { createdAt: "desc" },
    include: {
      fromUser: {
        select: { id: true, name: true, email: true },
      },
      toUser: {
        select: { id: true, name: true, email: true },
      },
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};
