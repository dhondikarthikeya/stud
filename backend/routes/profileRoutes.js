import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import User from "../models/User.js";
import { verifyStudent } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Multer storage config for profile photos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/profile-photos";
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ✅ GET /api/profile → fetch student profile
router.get("/", verifyStudent, async (req, res) => {
  try {
    const userId = req.user.id; // ✅ FIXED: use req.user.id, not _id
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// ✅ PUT /api/profileRoutes → update student profile
router.put("/", verifyStudent, upload.single("photo"), async (req, res) => {
  try {
    const userId = req.user.id;

    console.log("📥 Incoming update body:", req.body);
    console.log("📸 Uploaded file:", req.file);

    const updates = req.body;

    if (req.file) {
      updates.photo = `profile-photos/${req.file.filename}`;

    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    console.error("❌ Error updating profile:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export default router;