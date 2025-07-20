import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const FeePaymentScreen = () => {
  const navigate = useNavigate(); // ✅ Navigation hook

  const [step, setStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [feeData, setFeeData] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [txnId, setTxnId] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [amountError, setAmountError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summary = await api.get("/fees/summary");
        const history = await api.get("/fees/history");
        setFeeData(summary.data);
        setPaymentHistory(history.data);
      } catch (err) {
        console.error("Error fetching fee data:", err);
        setError("Failed to load fee data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalBalance = feeData ? feeData.balance + (feeData.penalty || 0) : 0;

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setPayAmount(value);
    if (!value || isNaN(value) || parseFloat(value) <= 0) {
      setAmountError("Enter a valid amount");
    } else if (parseFloat(value) > totalBalance) {
      setAmountError(`Max allowed is ₹${totalBalance}`);
    } else {
      setAmountError("");
    }
  };

  const handleNext = async () => {
    if (step === 2) {
      try {
        const id = `TXN${Math.floor(100000000 + Math.random() * 900000000)}`;
        setTxnId(id);
        await api.post("/fees/pay", {
          amount: payAmount,
          mode: selectedMethod,
          txnId: id,
        });
        const updated = await api.get("/fees/summary");
        const history = await api.get("/fees/history");
        setFeeData(updated.data);
        setPaymentHistory(history.data);
      } catch (err) {
        alert("Payment failed. Please try again.");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const handleBack = () => setStep(step - 1);

  const handleFullAmount = () => {
    setPayAmount(totalBalance);
    setAmountError("");
  };

  const downloadReceipt = async () => {
    try {
      const { data } = await api.get(`/receipt/${txnId}`);
      const doc = new jsPDF();
      doc.setFontSize(18).text("Payment Receipt", 20, 20);
      doc.setFontSize(12).text(`Transaction ID: ${data.txnId}`, 20, 30);
      autoTable(doc, {
        head: [["Field", "Details"]],
        body: [
          ["Name", data.name],
          ["Student ID", data.studentId],
          ["Course", data.course],
          ["Semester", data.semester],
          ["Date", data.date],
          ["Mode", data.mode],
          ["Amount", `₹${data.amount}`],
        ],
        startY: 40,
      });
      doc.save(`Receipt_${data.txnId}.pdf`);
    } catch {
      alert("Receipt download failed.");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#f7fafc] p-6 font-[Poppins] max-w-5xl mx-auto">
      {/* Step Progress */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-2">Step {step} of 3</p>
        <div className="w-full bg-gray-200 h-2.5 rounded-full">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step 1: Payment Details */}
      {step === 1 && (
        <div className="bg-white rounded-xl shadow p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Fee Summary</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-3 text-gray-700 mb-2">
                <span className="material-icons text-blue-500">person</span>
                <span><strong>Name:</strong> {feeData.name}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700 mb-2">
                <span className="material-icons text-green-500">school</span>
                <span><strong>Course:</strong> {feeData.course}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <span className="material-icons text-purple-500">calendar_today</span>
                <span><strong>Semester:</strong> {feeData.semester}</span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between text-gray-700 mb-2">
                <span>Total Fees:</span>
                <span className="font-semibold">₹{feeData.totalFees}</span>
              </div>
              <div className="flex justify-between text-gray-700 mb-2">
                <span>Paid:</span>
                <span className="font-semibold text-green-600">₹{feeData.paid}</span>
              </div>
              {feeData.penalty > 0 && (
                <div className="flex justify-between text-red-500">
                  <span>Penalty:</span>
                  <span>₹{feeData.penalty}</span>
                </div>
              )}
              <hr className="my-2" />
              <div className="flex justify-between text-gray-700 font-bold">
                <span>Balance:</span>
                <span className="text-red-500">₹{totalBalance}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            <strong>Due Date:</strong> {feeData.dueDate}
          </p>
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-2">
              Enter Amount to Pay
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="text"
                value={payAmount}
                onChange={handleAmountChange}
                placeholder="Enter amount"
                className={`pl-8 pr-4 py-3 w-full border rounded-lg focus:outline-none focus:ring-2 ${
                  amountError
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
            </div>
            {amountError && <p className="text-red-600 text-sm mt-1">{amountError}</p>}
            <button
              onClick={handleFullAmount}
              className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg border"
            >
              Pay Full Amount ₹{totalBalance}
            </button>
            <button
              onClick={handleNext}
              disabled={!payAmount || amountError}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Select Payment Method */}
      {step === 2 && (
        <div className="bg-white rounded-xl shadow p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Payment Method</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {["upi", "card", "netbanking", "wallet"].map((type) => (
              <div
                key={type}
                onClick={() => setSelectedMethod(type)}
                className={`p-4 border rounded-lg text-gray-700 cursor-pointer transition ${
                  selectedMethod === type
                    ? "border-blue-600 bg-blue-50"
                    : "hover:border-blue-400"
                }`}
              >
                <span className="capitalize">{type.replace(/([a-z])([A-Z])/g, "$1 $2")}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between gap-4 mt-4">
            <button
              onClick={handleBack}
              className="w-full bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-gray-700"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!selectedMethod}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg"
            >
              Pay Now
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <div className="bg-white rounded-xl shadow p-8 text-center space-y-4">
          <span className="material-icons text-green-500 text-5xl">check_circle</span>
          <h2 className="text-2xl font-bold text-gray-800">Payment Successful</h2>
          <p className="text-gray-700">₹{payAmount} received via {selectedMethod?.toUpperCase()}</p>
          <p className="text-sm text-gray-500">Transaction ID: {txnId}</p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={downloadReceipt}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
            >
              Download Receipt
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded-lg"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Payment History */}
      <div className="bg-white rounded-xl shadow p-8 mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="material-icons text-orange-500 mr-2">history</span>
          Payment History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-300">
              <tr>
                <th className="py-3 px-4 text-left text-gray-600">Date</th>
                <th className="py-3 px-4 text-left text-gray-600">Amount</th>
                <th className="py-3 px-4 text-left text-gray-600">Mode</th>
                <th className="py-3 px-4 text-left text-gray-600">Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.length > 0 ? (
                paymentHistory.map((item, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{item.date}</td>
                    <td className="py-3 px-4 font-medium">₹{item.amount}</td>
                    <td className="py-3 px-4">{item.mode}</td>
                    <td className="py-3 px-4">{item.txnId}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">No payments yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Navigation */}
     <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md max-w-screen-md mx-auto flex justify-around items-center py-2 z-50 md:max-w-full md:px-4 md:py-3 md:justify-around md:flex-wrap md:gap-4 md:hidden">
  <button onClick={() => navigate("/dashboard")} className="flex flex-col items-center text-sm text-gray-700 hover:text-blue-600">
    <span className="material-icons text-2xl">home</span>
    <span className="text-xs">Dashboard</span>
  </button>
  <button onClick={() => navigate("/student-dashboard")} className="flex flex-col items-center text-sm text-gray-700 hover:text-blue-600">
    <span className="material-icons text-2xl">fact_check</span>
    <span className="text-xs">Attendance</span>
  </button>
  <button onClick={() => navigate("/fee-payment")} className="flex flex-col items-center text-sm text-gray-700 hover:text-blue-600">
    <span className={`material-icons text-2xl transition-colors ${location.pathname === "/fee-payment" ? "text-blue-600" : ""}`}>currency_rupee</span>
    <span className="text-xs">Fees</span>
  </button>
  <button onClick={() => navigate("/documents")} className="flex flex-col items-center text-sm text-gray-700 hover:text-blue-600">
    <span className="material-icons text-2xl">folder_shared</span>
    <span className="text-xs">Documents</span>
  </button>
  <button onClick={() => navigate("/profile")} className="flex flex-col items-center text-sm text-gray-700 hover:text-blue-600">
    <span className="material-icons text-2xl">person</span>
    <span className="text-xs">Profile</span>
  </button>
</div>

    </div>
  );
};

export default FeePaymentScreen;
