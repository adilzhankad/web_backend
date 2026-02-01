require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/User");

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    console.log(" Add SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to .env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Mongo connected");

  const exists = await User.findOne({ email: email.toLowerCase().trim() });
  if (exists) {
    console.log("ℹAdmin already exists:", exists.email, "role:", exists.role);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await User.create({
    email: email.toLowerCase().trim(),
    passwordHash,
    role: "admin",
  });

  console.log(" Admin created:", admin.email);
  process.exit(0);
}

main().catch((e) => {
  console.error(" Seed error:", e.message);
  process.exit(1);
});
