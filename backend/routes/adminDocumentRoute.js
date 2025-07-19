import express from "express";
import multer from "multer";
import { verifyAdmin } from "../middlewares/authMiddleware.js";
import Document from "../models/Document.js";
import path from "path";
import fs from "fs";

const router = express.Router();

// ✅ Multer storage config
const storage = multer.diskStorage({
  destination: "uploads/admin",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Upload Document (Admin Only)
router.post("/upload", verifyAdmin, upload.single("file"), async (req, res) => {
  const {
    title,
    description = "",
    documentType,
    expiryDate,
    className,
    isPublished = "true",
    notifyStudents = "false",
  } = req.body;

  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  if (!title || !documentType || !className) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const document = new Document({
    title,
    description,
    documentType,
    expiryDate: expiryDate || null,
    className,
    isPublished: isPublished === "true",
    notifyStudents: notifyStudents === "true",
    uploadedBy: req.user.adminUsername,
    fileName: req.file.filename,
    originalName: req.file.originalname,
    filePath: req.file.path,
    fileSize: req.file.size,
    uploadDate: new Date(),
    shared: true,
  });

  try {
    await document.save();
    res.status(201).json({ message: "✅ Document uploaded successfully" });
  } catch (error) {
    console.error("Error saving document:", error);
    res.status(500).json({ message: "❌ Server error while saving document" });
  }
});

// ✅ Student: Get Documents by Class Name
router.get("/shared/:className", async (req, res) => {
  const { className } = req.params;
  try {
    const documents = await Document.find({
      shared: true,
      className,
    }).sort({ uploadDate: -1 });
    res.json(documents);
  } catch (error) {
    console.error("Error fetching student documents:", error);
    res.status(500).json({ message: "❌ Failed to fetch documents" });
  }
});

// ✅ Admin: Get All Shared Documents
router.get("/shared", async (req, res) => {
  try {
    const documents = await Document.find({ shared: true }).sort({ uploadDate: -1 });
    res.json(documents);
  } catch (error) {
    console.error("Error fetching admin documents:", error);
    res.status(500).json({ message: "❌ Failed to fetch documents" });
  }
});

// ✅ Download Document
router.get("/download/:fileName", (req, res) => {
  const filePath = path.join("uploads/admin", req.params.fileName);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ message: "❌ File not found" });
  }
});

// ✅ Delete Document (Admin Only)
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "❌ Document not found" });

    if (fs.existsSync(doc.filePath)) {
      fs.unlinkSync(doc.filePath);
    }
    await doc.deleteOne();
    res.json({ message: "✅ Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ message: "❌ Server error while deleting document" });
  }
});

export default router;
