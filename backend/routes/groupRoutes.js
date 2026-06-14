import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createGroup,
  getGroups,
  getGroupById,
  addMember,
  removeMember,
} from "../controllers/groupController.js";
import { requireGroupMembership, requireGroupAdmin } from "../middleware/groupMiddleware.js";

const router = Router();

router.use(protect);
router.post("/", createGroup);
router.get("/", getGroups);
router.get("/:groupId", requireGroupMembership, getGroupById);
router.post("/:groupId/members", requireGroupAdmin, addMember);
router.delete("/:groupId/members/:userId", requireGroupAdmin, removeMember);

export default router;
