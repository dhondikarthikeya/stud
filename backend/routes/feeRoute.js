import express from "express";
import Fee from "../models/Fee.js";
import Payment from "../models/Payment.js";
import { verifyStudent } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /api/fees/summary - fetch fee summary
router.get("/summary", verifyStudent, async (req, res) => {
  try {
    const fee = await Fee.findOne({ studentId: req.user.studentId });
    if (!fee) return res.status(404).json({ message: "Fee data not found" });
    res.json(fee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/fees/history - payment history
router.get("/history", verifyStudent, async (req, res) => {
  try {
    const history = await Payment.find({ studentId: req.user.studentId }).sort({ date: -1 });
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/fees/pay - simulate payment
router.post("/pay", verifyStudent, async (req, res) => {
  const { amount, mode, txnId } = req.body;
  const studentId = req.user.studentId;

  try {
    // Save payment
    const payment = new Payment({
      studentId,
      amount,
      mode,
      txnId,
      date: new Date().toISOString().split("T")[0],
    });
    await payment.save();

    // Update Fee record
    const fee = await Fee.findOne({ studentId });
    if (!fee) return res.status(404).json({ message: "Fee record not found" });

    // Update Fee record correctly
fee.paid = (Number(fee.paid) || 0) + Number(amount);
fee.balance = Math.max(Number(fee.totalFees) - fee.paid, 0);
await fee.save();


    res.json({ message: "Payment successful" });
  } catch (err) {
    console.error("Payment error:", err);
    res.status(500).json({ message: "Payment failed" });
  }
});

export default router;
