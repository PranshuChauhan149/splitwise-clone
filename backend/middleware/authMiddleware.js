import { verifyToken } from "../utils/jwtUtils.js";
import { findUserById } from "../services/authService.js";

export const protect = async (req, res, next) => {
  const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ success: false, error: "Authentication required" });
  }

  try {
    const payload = verifyToken(token);
    const user = await findUserById(payload.userId);
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid authentication token" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
};

export const authenticate = protect;
