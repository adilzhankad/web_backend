const express = require("express");
const router = express.Router();

const { register, login, me } = require("../controllers/auth.controller");
const { auth } = require("../middleware/auth");

router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/me", auth, me);

module.exports = router;
