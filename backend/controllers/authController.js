import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register (for students, optional for testing only)
export const register = async (req, res) => {
  try {
    const { studentId, password, role = "student", firstName, lastName } = req.body;

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
    res.status(201).json({ message: "User registered successfully", role: newUser.role });
  } catch (error) {
    res.status(500).json({ message: "Server error while registering user" });
  }
};

export const login = async (req, res) => {
  const { studentId, password } = req.body;

  try {
    const user = await User.findOne({ studentId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const tokenPayload = {
      id: user._id,
      role: user.role,
      studentId: user.studentId,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      id: user._id,
      studentId: user.studentId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      dob: user.dob,
      gender: user.gender,
      program: user.program,
      department: user.department,
      semester: user.semester,
      admissionDate: user.admissionDate,
      status: user.status,
      subject: user.subject || null,
      className: user.className,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};
