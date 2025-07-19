import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { verifyStudent } from "../middlewares/authMiddleware.js";
import Document from "../models/Document.js";

const router = express.Router();

// Multer Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "uploads/documents/";
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ Upload Document (Student)
router.post("/upload", verifyStudent, upload.single("file"), async (req, res) => {
  try {
    const { category } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "❌ No file uploaded" });
    }
    if (!category) {
      return res.status(400).json({ message: "❌ Category is required" });
    }

    const document = new Document({
  studentId: req.user.studentId,
  fileName: req.file.filename,
  originalName: req.file.originalname,
  fileSize: req.file.size, // ✅ corrected from size → fileSize
  category: req.body.category,
});


    await document.save();
    res.status(201).json({ message: "✅ Uploaded Successfully", document });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "❌ Upload failed", error: error.message });
  }
});

// ✅ List Student Uploaded Documents
router.get("/my-documents", verifyStudent, async (req, res) => {
  try {
    const docs = await Document.find({ studentId: req.user.studentId }).sort({ uploadDate: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: "❌ Failed to fetch documents" });
  }
});

// ✅ Download Document
router.get("/download/:filename", (req, res) => {
  const filePath = path.join("uploads/documents", req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ message: "❌ File not found" });
  }
});

export default router;
