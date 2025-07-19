import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import attendanceRoutes from "./routes/attendance.js"; // ✅ THIS MUST BE HERE
import profileRoutes from "./routes/profileRoutes.js";
import feeRoutes from "./routes/feeRoute.js";
import receiptRoute from "./routes/receipt.js";
import documentRoute from "./routes/documentRoute.js";
import adminDocumentRoute from "./routes/adminDocumentRoute.js";






dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Test route
app.get("/", (req, res) => res.send("✅ Server is up"));


// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/attendance", attendanceRoutes); // ✅ THIS MUST BE HERE
app.use("/api/profileRoutes", profileRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/fees", feeRoutes);
app.use("/api/receipt", receiptRoute);
app.use("/api/documents", documentRoute);
app.use("/api/admin-documents", adminDocumentRoute);

// Connect MongoDB
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

  })
  .catch((err) => console.error("❌ MongoDB connection failed", err));