const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");
const { requireRole } = require("../middleware/requireRole");
const { listUsers, setUserRole, createUser } = require("../controllers/admin.controller");

router.get("/admin/users", auth, requireRole("admin"), listUsers);
router.post("/admin/users", auth, requireRole("admin"), createUser);
router.patch("/admin/users/:id/role", auth, requireRole("admin"), setUserRole);

module.exports = router;
