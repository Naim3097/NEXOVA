"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface PricingTableDemoProps {
  monthlyPrice?: number;
  yearlyPrice?: number;
  activeColor?: string;
}

export function PricingTableImplementation({ monthlyPrice = 29, yearlyPrice = 290, activeColor = "#52525b" }: PricingTableDemoProps) {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex flex-col items-center justify-center gap-6">
      <div className="flex items-center gap-4 bg-zinc-800 p-1 rounded-full">
        <button
          onClick={() => setIsYearly(false)}
          className={`px-4 py-1.5 rounded-full text-sm transition-colors relative z-10 ${
            !isYearly ? "text-white" : "text-zinc-400"
          }`}
        >
          Monthly
          {!isYearly && (
            <motion.div
              layoutId="active-pill"
              className="absolute inset-0 rounded-full -z-10"
              style={{ backgroundColor: activeColor }}
            />
          )}
        </button>
        <button
          onClick={() => setIsYearly(true)}
          className={`px-4 py-1.5 rounded-full text-sm transition-colors relative z-10 ${
            isYearly ? "text-white" : "text-zinc-400"
          }`}
        >
          Yearly
          {isYearly && (
            <motion.div
              layoutId="active-pill"
              className="absolute inset-0 rounded-full -z-10"
              style={{ backgroundColor: activeColor }}
            />
          )}
        </button>
      </div>

      <div className="text-center">
        <motion.div
          key={isYearly ? "year" : "month"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-4xl font-bold text-white"
        >
          ${isYearly ? yearlyPrice : monthlyPrice}
        </motion.div>
        <span className="text-zinc-500 text-sm">
          /{isYearly ? "year" : "month"}
        </span>
      </div>
    </div>
  );
}

export default function PricingTableDemo(props: PricingTableDemoProps) {
  return <PricingTableImplementation {...props} />;
}
