const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { getJwtConfig } = require("../config/jwt");

function isEmailValid(email) {
  return typeof email === "string" && email.includes("@") && email.includes(".");
}

function signToken(user) {
  const { secret, expiresIn } = getJwtConfig();
  return jwt.sign({ id: user._id.toString(), role: user.role }, secret, { expiresIn });
}

// POST /auth/register  (always creates student)
async function register(req, res) {
  try {
    const { email, password } = req.body || {};

    if (!isEmailValid(email)) return res.status(400).json({ error: "Invalid email" });
    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(409).json({ error: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email.toLowerCase().trim(),
      passwordHash,
      role: "student",
    });

    return res.status(201).json({
      id: user._id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}

// POST /auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body || {};

    if (typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email" });
    }
    if (typeof password !== "string" || password.length < 1) {
      return res.status(400).json({ error: "Password is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken(user);

    return res.status(200).json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}


// GET /auth/me
async function me(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: "Server error", details: err.message });
  }
}

module.exports = { register, login, me };
