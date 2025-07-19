import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  // For student uploads (optional)
  studentId: { type: String },
  category: { type: String }, // ✅ Added category for student uploads

  // For admin uploads (shared documents)
  title: { type: String },
  description: { type: String },
  documentType: { type: String },
  expiryDate: { type: String },
  className: { type: String },

  isPublished: { type: Boolean, default: true },
  notifyStudents: { type: Boolean, default: false },
  uploadedBy: { type: String },

  fileName: { type: String, required: true },
  originalName: { type: String, required: true },
  filePath: { type: String },
  fileSize: { type: Number, required: true },
  uploadDate: { type: Date, default: Date.now },
  

  shared: { type: Boolean, default: false }
});

export default mongoose.model("Document", documentSchema);
