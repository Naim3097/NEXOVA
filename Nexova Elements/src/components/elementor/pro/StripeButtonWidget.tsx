"use client";

import React, { useState } from "react";
import { Loader2, Lock, CreditCard } from "lucide-react";

interface StripeButtonWidgetProps {
  productName?: string;
  price?: string;
  currency?: string;
  buttonText?: string;
  variant?: "solid" | "outline" | "gradient";
}

export default function StripeButtonWidget({
  productName = "Premium Plan",
  price = "99.00",
  currency = "$",
  buttonText = "Pay Now",
  variant = "solid",
}: StripeButtonWidgetProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert(`Redirecting to Stripe Checkout for ${productName} (${currency}${price})...`);
    }, 1500);
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "outline":
        return "bg-transparent border-2 border-[#635bff] text-[#635bff] hover:bg-[#635bff]/5";
      case "gradient":
        return "bg-gradient-to-r from-[#635bff] to-[#a259ff] text-white hover:shadow-lg border-transparent";
      case "solid":
      default:
        return "bg-[#635bff] hover:bg-[#544de0] active:bg-[#4b45c6] text-white border-transparent";
    }
  };

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <button 
        onClick={handleClick}
        disabled={isLoading}
        className={`group relative font-medium py-2.5 px-6 rounded-md shadow-sm transition-all duration-200 flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden ${getVariantClasses()}`}
      >
        {isLoading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <>
            <CreditCard size={18} className={variant === "outline" ? "text-[#635bff]" : "text-white/90"} />
            <span>{buttonText}</span>
            <div className={`h-4 w-px ${variant === "outline" ? "bg-[#635bff]/20" : "bg-white/20"}`}></div>
            <span className="font-bold">{currency}{price}</span>
          </>
        )}
        
        {/* Shine effect for solid/gradient */}
        {variant !== "outline" && (
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
        )}
      </button>
      
      <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium uppercase tracking-wide">
        <Lock size={10} />
        <span>Secured by Stripe</span>
      </div>
    </div>
  );
}
