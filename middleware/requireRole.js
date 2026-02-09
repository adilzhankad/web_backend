module.exports = (roles) => {
  return (req, res, next) => {
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];
    const hasAccess = userRoles.some((role) => allowedRoles.includes(role));
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    next();
  };
};