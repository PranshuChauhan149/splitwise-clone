export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: "Name, email, and password are required" });
  }
  if (typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ success: false, error: "Password must be at least 8 characters" });
  }
  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Email and password are required" });
  }
  next();
};
