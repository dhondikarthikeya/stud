import mongoose from "mongoose";

const FeeSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  semester: { type: String, required: true },
  course: String,
  totalFees: Number,
  paid: Number,
  balance: Number,
  dueDate: String,
  penalty: Number,
  breakdown: [
    {
      label: String,
      amount: Number,
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Fee", FeeSchema);
