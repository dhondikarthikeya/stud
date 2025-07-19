import express from "express";
import Payment from "../models/Payment.js";
import Fee from "../models/Fee.js";
import { verifyStudent } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /api/receipt/:txnId - generate payment receipt details
router.get("/:txnId", verifyStudent, async (req, res) => {
  const { txnId } = req.params;
  const studentId = req.user.studentId;

  try {
    const payment = await Payment.findOne({ txnId, studentId });
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    const fee = await Fee.findOne({ studentId });
    if (!fee) return res.status(404).json({ message: "Fee record not found" });

    res.json({
      txnId: payment.txnId,
      amount: payment.amount,
      mode: payment.mode,
      date: payment.date,
      studentId,
      name: fee.name,
      course: fee.course,
      semester: fee.semester,
    });
  } catch (err) {
    console.error("❌ Error generating receipt:", err);
    res.status(500).json({ message: "Server error generating receipt" });
  }
});

export default router;
