import React from "react";
import { CreditCard } from "lucide-react";

const FloatingActionButton = () => {
  return (
    <button
      className="fixed bottom-16 right-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full p-4 shadow-lg z-20 md:hidden"
      onClick={() => alert("Redirecting to Fee Payment...")}
    >
      <CreditCard size={24} />
    </button>
  );
};

export default FloatingActionButton;
