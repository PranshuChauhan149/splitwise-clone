import { findMembership } from "../services/groupService.js";

export const requireGroupMembership = async (req, res, next) => {
  const { groupId } = req.params;
  const membership = await findMembership(req.user.id, groupId);

  if (!membership) {
    return res.status(403).json({ success: false, error: "Access denied: not a group member" });
  }

  req.groupMembership = membership;
  next();
};

export const requireGroupAdmin = async (req, res, next) => {
  const { groupId } = req.params;
  const membership = await findMembership(req.user.id, groupId);

  if (!membership) {
    return res.status(403).json({ success: false, error: "Access denied: not a group member" });
  }

  if (membership.role !== "ADMIN") {
    return res.status(403).json({ success: false, error: "Admin privileges required" });
  }

  req.groupMembership = membership;
  next();
};
