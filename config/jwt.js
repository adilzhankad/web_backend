function getJwtConfig() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set in .env");

  return {
    secret,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  };
}

module.exports = { getJwtConfig };
