// config/jwt.js
module.exports = {
  getJwtConfig: () => ({
    secret: process.env.JWT_SECRET || 'super-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  })
};