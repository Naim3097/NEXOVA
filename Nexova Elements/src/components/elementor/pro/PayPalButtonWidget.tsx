"use client";

import React from "react";
import { CreditCard } from "lucide-react";

interface PayPalButtonWidgetProps {
  type?: "checkout" | "donation" | "subscription";
  amount?: string;
  currency?: string;
  label?: string;
  sandbox?: boolean;
}

export default function PayPalButtonWidget({
  type = "checkout",
  amount = "10.00",
  currency = "USD",
  label = "Pay with PayPal",
  sandbox = true,
}: PayPalButtonWidgetProps) {
  const handlePayPalClick = () => {
    const env = sandbox ? "Sandbox" : "Live";
    alert(`Opening PayPal ${env} ${type} window for ${currency} ${amount}...`);
  };

  const handleCardClick = () => {
    alert("Opening Card Payment window...");
  };

  return (
    <div className="inline-flex flex-col w-full max-w-[250px] gap-3">
      {/* PayPal Button */}
      <button 
        onClick={handlePayPalClick}
        className="w-full bg-[#ffc439] hover:bg-[#f4bb33] active:bg-[#f2ba36] text-[#003087] font-bold py-2.5 px-6 rounded-full shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-1 relative overflow-hidden group"
        aria-label={label}
      >
        <span className="italic font-bold text-lg">Pay</span>
        <span className="italic font-bold text-lg text-[#009cde]">Pal</span>
        
        {/* Hover highlight */}
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      {/* Debit/Credit Card Button */}
      <button 
        onClick={handleCardClick}
        className="w-full bg-[#2c2e2f] hover:bg-[#1a1c1d] active:bg-[#000000] text-white font-medium py-2.5 px-6 rounded-full shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2 group"
      >
        <CreditCard size={18} className="text-gray-300 group-hover:text-white transition-colors" />
        <span>Debit or Credit Card</span>
      </button>

      <div className="text-center mt-1 flex flex-col items-center gap-1">
        <span className="text-[10px] text-gray-400">Powered by PayPal</span>
        {sandbox && <span className="text-[9px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">Sandbox Mode</span>}
      </div>
    </div>
  );
}
