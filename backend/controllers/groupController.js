import {
  createGroupRecord,
  findGroupsForUser,
  findGroupById,
  findUserByEmail,
  findMembership,
  addMembership,
  removeMembership,
  countAdminsInGroup,
} from "../services/groupService.js";
import { sendSuccess, sendError } from "../utils/responseHelpers.js";

export const createGroup = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return sendError(res, "Group name is required", 400);
    }

    const group = await createGroupRecord({
      name,
      description,
      createdById: req.user.id,
      memberships: {
        create: {
          userId: req.user.id,
          role: "ADMIN",
        },
      },
    });

    return sendSuccess(res, { group }, 201);
  } catch (error) {
    next(error);
  }
};

export const getGroups = async (req, res, next) => {
  try {
    const groups = await findGroupsForUser(req.user.id);
    return sendSuccess(res, { groups });
  } catch (error) {
    next(error);
  }
};

export const getGroupById = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const group = await findGroupById(groupId);
    if (!group) {
      return sendError(res, "Group not found", 404);
    }
    return sendSuccess(res, { group });
  } catch (error) {
    next(error);
  }
};

export const addMember = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { email, role } = req.body;
    if (!email) {
      return sendError(res, "Email is required to add member", 400);
    }

    const user = await findUserByEmail(email.toLowerCase());
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    const existingMembership = await findMembership(user.id, groupId);
    if (existingMembership) {
      return sendError(res, "User is already a member of the group", 409);
    }

    const membership = await addMembership({
      userId: user.id,
      groupId,
      role: role === "ADMIN" ? "ADMIN" : "MEMBER",
    });

    return sendSuccess(res, { membership }, 201);
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const { groupId, userId } = req.params;
    const membership = await findMembership(userId, groupId);
    if (!membership) {
      return sendError(res, "Member not found in group", 404);
    }

    if (membership.role === "ADMIN") {
      const adminCount = await countAdminsInGroup(groupId);
      if (adminCount <= 1) {
        return sendError(res, "Cannot remove the last admin", 400);
      }
    }

    await removeMembership(userId, groupId);
    return sendSuccess(res, { message: "Member removed successfully" });
  } catch (error) {
    next(error);
  }
};
