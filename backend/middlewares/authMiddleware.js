import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach all relevant fields explicitly
    req.user = {
      id: decoded.id,
      role: decoded.role,
      studentId: decoded.studentId || null, // needed for student attendance
      username: decoded.username || null,   // optional (for admin)
      subject: decoded.subject || null      // optional (for teacher/admin)
    };

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "admin" || req.user.role === "teacher") {
      next();
    } else {
      res.status(403).json({ message: "Admin access required" });
    }
  });
};

export const verifyStudent = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "student") {
      next();
    } else {
      res.status(403).json({ message: "Student access required" });
    }
  });
};
