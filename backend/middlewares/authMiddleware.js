// middlewares/authMiddleware.js

import jwt from "jsonwebtoken";

// ✅ Middleware to verify any valid token (for both student/admin)
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expected format: Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach relevant user data to the request object
    req.user = {
      id: decoded.id,
      role: decoded.role,
      studentId: decoded.studentId || null, // for student
      username: decoded.username || null,   // for admin
      subject: decoded.subject || null      // for teacher/admin
    };

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

// ✅ Middleware to restrict to Admins or Teachers
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "admin" || req.user.role === "teacher") {
      next();
    } else {
      res.status(403).json({ message: "Admin access required" });
    }
  });
};

// ✅ Middleware to restrict to Students only
export const verifyStudent = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "student") {
      next();
    } else {
      res.status(403).json({ message: "Student access required" });
    }
  });
};
