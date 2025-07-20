import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Register Controller (Student/Optional for Testing)
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

// ✅ Login Controller
export const login = async (req, res) => {
  const { studentId, password } = req.body;

  try {
    if (!studentId || !password) {
      return res.status(400).json({ message: "Student ID and password required" });
    }

    const user = await User.findOne({ studentId });
    if (!user) {
      return res.status(404).json({ message: "❌ User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "❌ Invalid credentials" });
    }

    const tokenPayload = {
      id: user._id,
      role: user.role,
      studentId: user.studentId,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      message: "✅ Login successful",
      token,
      role: user.role,
      id: user._id,
      studentId: user.studentId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email || null,
      phone: user.phone || null,
      dob: user.dob || null,
      gender: user.gender || null,
      program: user.program || null,
      department: user.department || null,
      semester: user.semester || null,
      admissionDate: user.admissionDate || null,
      status: user.status || null,
      subject: user.subject || null,
      className: user.className || null,
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
