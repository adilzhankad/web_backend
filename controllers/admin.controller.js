// controllers/admin.controller.js
const User = require('../models/User');
const bcrypt = require('bcrypt');

// GET /api/admin/users
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash'); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// POST /api/admin/users
exports.createUser = async (req, res) => {
  try {
    const { email, password, role, fullName } = req.body;
    const passwordHash = await bcrypt.hash(password, 10); 
    const user = await User.create({ email, passwordHash, role, fullName });
    res.status(201).json({ id: user._id, email: user.email, role: user.role });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PATCH /api/admin/users/:id/role
exports.setUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "Update failed" });
  }
};