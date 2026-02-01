const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const isValidId = (id) => mongoose.isValidObjectId(id);

// GET /admin/users
async function listUsers(req, res) {
  try {
    const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
    return res.json(users);
  } catch (e) {
    return res.status(500).json({ error: "Server error", details: e.message });
  }
}

// PATCH /admin/users/:id/role
async function setUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body || {};

    if (!isValidId(id)) return res.status(400).json({ error: "Invalid user id" });
    if (!["admin", "teacher", "student"].includes(role)) {
      return res.status(400).json({ error: "Role must be admin|teacher|student" });
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-passwordHash");

    if (!updated) return res.status(404).json({ error: "User not found" });
    return res.json(updated);
  } catch (e) {
    return res.status(500).json({ error: "Server error", details: e.message });
  }
}

// POST /admin/users  (create teacher/student/admin)
async function createUser(req, res) {
  try {
    const { email, password, role } = req.body || {};

    if (typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email" });
    }
    if (typeof password !== "string" || password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    if (!["admin", "teacher", "student"].includes(role)) {
      return res.status(400).json({ error: "Role must be admin|teacher|student" });
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() });
    if (exists) return res.status(409).json({ error: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email.toLowerCase().trim(),
      passwordHash,
      role,
    });

    return res.status(201).json({
      id: user._id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (e) {
    return res.status(500).json({ error: "Server error", details: e.message });
  }
}

module.exports = { listUsers, setUserRole, createUser };
