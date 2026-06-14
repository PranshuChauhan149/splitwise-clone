import { getPrisma } from "../utils/prismaClient.js";

export const createGroupRecord = async (data) => {
  return getPrisma().group.create({ data });
};

export const findGroupsForUser = async (userId) => {
  return getPrisma().group.findMany({
    where: {
      memberships: {
        some: {
          userId,
        },
      },
    },
    include: {
      memberships: {
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

export const findGroupById = async (groupId) => {
  return getPrisma().group.findUnique({
    where: { id: groupId },
    include: {
      memberships: {
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
      expenses: {
        include: {
          paidBy: {
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

export const findMembership = async (userId, groupId) => {
  return getPrisma().membership.findUnique({
    where: {
      userId_groupId: {
        userId,
        groupId,
      },
    },
  });
};

export const findUserByEmail = async (email) => {
  return getPrisma().user.findUnique({ where: { email } });
};

export const addMembership = async (data) => {
  return getPrisma().membership.create({
    data,
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

export const removeMembership = async (userId, groupId) => {
  return getPrisma().membership.delete({
    where: {
      userId_groupId: {
        userId,
        groupId,
      },
    },
  });
};

export const countAdminsInGroup = async (groupId) => {
  return getPrisma().membership.count({
    where: {
      groupId,
      role: "ADMIN",
    },
  });
};
