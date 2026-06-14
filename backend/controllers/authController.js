import { findUserByEmail, createUser, findUserById } from "../services/authService.js";
import { hashPassword, comparePassword } from "../utils/hashUtils.js";
import { signToken } from "../utils/jwtUtils.js";
import { sendSuccess, sendError } from "../utils/responseHelpers.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
});

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const existingUser = await findUserByEmail(normalizedEmail);
    if (existingUser) {
      return sendError(res, "Email already exists", 409);
    }

    const hashedPassword = await hashPassword(password);
    const user = await createUser({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const token = signToken({ userId: user.id, email: user.email });
    res.cookie("token", token, cookieOptions);

    return sendSuccess(res, { user: sanitizeUser(user) }, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const user = await findUserByEmail(normalizedEmail);
    if (!user) {
      return sendError(res, "Invalid email or password", 401);
    }

    const passwordMatches = await comparePassword(password, user.password);
    if (!passwordMatches) {
      return sendError(res, "Invalid email or password", 401);
    }

    const token = signToken({ userId: user.id, email: user.email });
    res.cookie("token", token, cookieOptions);

    return sendSuccess(res, { user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token", { path: "/" });
    return sendSuccess(res, { message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return sendError(res, "User not authenticated", 401);
    }
    const user = await findUserById(userId);
    if (!user) {
      return sendError(res, "User not found", 404);
    }
    return sendSuccess(res, { user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};
