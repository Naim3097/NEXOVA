"use client";

import React from "react";
import { Check, X } from "lucide-react";

interface FeatureItem {
  text: string;
  included: boolean;
}

interface PriceTableWidgetProps {
  header?: string;
  price?: string;
  currency?: string;
  period?: string;
  buttonText?: string;
  ribbon?: boolean;
  ribbonText?: string;
  features?: FeatureItem[];
  popular?: boolean;
}

export default function PriceTableWidget({
  header = "Professional",
  price = "29.99",
  currency = "$",
  period = "Monthly",
  buttonText = "Get Started",
  ribbon = false,
  ribbonText = "Popular",
  popular = false,
  features = [
    { text: "Unlimited Projects", included: true },
    { text: "50GB Storage", included: true },
    { text: "Priority Support", included: true },
    { text: "Custom Domain", included: false },
    { text: "Advanced Analytics", included: false },
  ],
}: PriceTableWidgetProps) {
  return (
    <div className={`relative w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${popular ? "border-blue-500 ring-4 ring-blue-500/10 scale-105 z-10" : "border-gray-100"}`}>
      {(ribbon || popular) && (
        <div className="absolute top-0 right-0 overflow-hidden w-32 h-32 pointer-events-none">
          <div className={`absolute top-0 right-0 text-xs font-bold px-10 py-1.5 transform rotate-45 translate-x-[30%] translate-y-[40%] shadow-sm text-center w-full ${popular ? "bg-blue-600 text-white" : "bg-gray-800 text-white"}`}>
            {ribbonText}
          </div>
        </div>
      )}
      
      <div className={`p-8 text-center border-b ${popular ? "bg-blue-50/50 border-blue-100" : "bg-white border-gray-100"}`}>
        <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 ${popular ? "text-blue-600" : "text-gray-500"}`}>{header}</h3>
        <div className="flex justify-center items-start text-gray-900 mb-2">
          <span className="text-2xl font-medium mt-1">{currency}</span>
          <span className="text-6xl font-bold tracking-tighter">{price}</span>
        </div>
        <span className="text-gray-500 text-sm font-medium">billed {period.toLowerCase()}</span>
      </div>

      <div className="p-8 bg-white">
        <ul className="space-y-4 mb-8">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center text-sm">
              {feature.included ? (
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <Check className="w-3 h-3 text-green-600" strokeWidth={3} />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <X className="w-3 h-3 text-gray-400" strokeWidth={3} />
                </div>
              )}
              <span className={feature.included ? "text-gray-700 font-medium" : "text-gray-400 line-through"}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
        <button className={`w-full py-3.5 px-6 rounded-xl font-bold transition-all duration-200 shadow-sm hover:shadow-md active:scale-[0.98] ${popular ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-900 hover:bg-gray-800 text-white"}`}>
          {buttonText}
        </button>
      </div>
    </div>
  );
}
