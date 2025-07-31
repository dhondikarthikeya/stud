import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Register (for students)
export const register = async (req, res) => {
  try {
    const { studentId, password, role = "student", firstName, lastName, className } = req.body;

    if (!studentId || !password || !firstName || !lastName || !className) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ studentId });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      studentId,
      password: hashedPassword,
      role,
      firstName,
      lastName,
      className,
    });

    await newUser.save();

    res.status(201).json({ message: "✅ User registered successfully", role: newUser.role });
  } catch (error) {
    console.error("❌ Register Error:", error);
    res.status(500).json({ message: "Server error while registering user" });
  }
};

// ✅ Login (works for both students and admins)
export const login = async (req, res) => {
  try {
    const { studentId, adminUsername, password } = req.body;

    if ((!studentId && !adminUsername) || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    // Determine whether student or admin login
    const query = studentId ? { studentId } : { adminUsername };
    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        role: user.role,
        studentId: user.studentId || null,
        adminUsername: user.adminUsername || null,
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        className: user.className || null,
        subject: user.subject || null,
      },
    });

  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};
