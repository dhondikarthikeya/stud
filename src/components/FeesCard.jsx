import React from "react";

const FeesCard = () => {
  const total = 10000;
  const paid = 7000;
  const due = total - paid;
  const percentPaid = (paid / total) * 100;

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold text-indigo-800 mb-2">Fees Summary</h2>
      <div className="text-sm text-gray-700 mb-4">
        <p>Total: ₹{total}</p>
        <p>Paid: ₹{paid}</p>
        <p>Due: ₹{due}</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="bg-green-500 h-3 rounded-full transition-all duration-300"
          style={{ width: `${percentPaid}%` }}
        ></div>
      </div>
    </div>
  );
};

export default FeesCard;
