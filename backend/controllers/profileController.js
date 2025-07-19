// controllers/profileController.js
import User from "../models/User.js";
import multer from "multer";

// Optional: configure multer for photo uploads
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// GET /api/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).json({ message: "Failed to load profile" });
  }
};

// PUT /api/profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = { ...req.body };

    // If photo uploaded
    if (req.file) {
      const buffer = req.file.buffer;
      const base64 = buffer.toString("base64");
      updateData.photo = `data:${req.file.mimetype};base64,${base64}`;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    res.json({ user: updatedUser });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

