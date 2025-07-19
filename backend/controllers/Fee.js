// backend/controllers/Fee.js

import Fee from "../models/Fee.js";
import Payment from "../models/Payment.js";
import User from "../models/User.js";

// GET Fee Summary
export const getFeeSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const fee = await Fee.findOne({ studentId: user.studentId });

    if (!fee) return res.status(404).json({ message: "Fee record not found" });

    res.json({
      name: `${user.firstName} ${user.lastName}`,
      course: user.program,
      semester: user.semester,
      totalFees: fee.totalFees,
      paid: fee.paid,
      balance: fee.totalFees - fee.paid,
      dueDate: fee.dueDate,
      penalty: fee.penalty || 0,
      breakdown: fee.breakdown,
    });
  } catch (error) {
    console.error("❌ Error fetching fee summary:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST Pay Fees
export const payFees = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, mode, txnId } = req.body;

    if (!amount || !mode || !txnId) {
      return res.status(400).json({ message: "Amount, mode, and transaction ID are required." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const fee = await Fee.findOne({ studentId: user.studentId });
    if (!fee) return res.status(404).json({ message: "Fee record not found" });

    const balance = fee.totalFees - fee.paid;
    if (amount <= 0 || amount > balance) {
      return res.status(400).json({ message: `Invalid payment amount. Balance is ₹${balance}` });
    }

    // Create payment record
    const payment = new Payment({
      studentId: user.studentId,
      amount,
      mode,
      txnId,
      date: new Date().toISOString().slice(0, 10),
    });

    await payment.save();

    // Update paid amount correctly
    fee.paid += amount;
    await fee.save();

    res.json({ message: "Payment successful", paid: fee.paid });
  } catch (error) {
    console.error("❌ Payment error:", error);
    res.status(500).json({ message: "Payment failed" });
  }
};

// GET Payment History
export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const history = await Payment.find({ studentId: user.studentId }).sort({ date: -1 });

    res.json(history);
  } catch (error) {
    console.error("❌ Error fetching payment history:", error);
    res.status(500).json({ message: "Server error" });
  }
};
