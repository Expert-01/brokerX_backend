export const isAdmin = (req, res, next) => {
  if (req.user && req.user.is_admin) {
    return next(); // only call once when admin is valid
  }
  return res.status(403).json({ message: "Access denied. Admins only." });
};
