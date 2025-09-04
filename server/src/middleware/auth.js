import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user; 
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const requireOwnerOrAdmin = (ownerId, role) => (req, res, next) => {
  if (req.user.role === "admin" || String(req.user.id) === String(ownerId)) return next();
  return res.status(403).json({ error: "Forbidden" });
};
