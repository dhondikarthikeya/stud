import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  amount: Number,
  mode: String,
  txnId: String,
  date: { type: String },
});

export default mongoose.model("Payment", PaymentSchema);
