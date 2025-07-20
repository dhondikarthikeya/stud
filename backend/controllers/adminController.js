import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Admin Login Handler
export const adminLogin = async (req, res) => {
  const { studentId, password } = req.body;

  try {
    const user = await User.findOne({ studentId, role: "admin" });
    if (!user) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role, studentId: user.studentId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Admin login successful",
      token,
      role: user.role,
      id: user._id,
      studentId: user.studentId,
      subject: user.subject,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error during admin login" });
  }
};

// ✅ Fetch Students by Class
export const getStudentsByClass = async (req, res) => {
  try {
    const { className } = req.params;
    if (!className) return res.status(400).json({ message: "Class name is required" });

    const students = await User.find({ className, role: "student" }).select("-password");
    res.status(200).json(students);
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};
