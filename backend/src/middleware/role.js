module.exports = (allowedRoles) => (req, res, next) => {
  // allowedRoles can be a string or array
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden: insufficient role' });
  }
  next();
}; 