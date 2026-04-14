"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface MultiStepFormDemoProps {
  activeColor?: string;
  inactiveColor?: string;
  textColor?: string;
  steps?: { title: string; description: string }[];
}

export default function MultiStepFormDemo(props: MultiStepFormDemoProps) {
  return <MultiStepFormImplementation {...props} />;
}

export function MultiStepFormImplementation({
  activeColor = "#3b82f6",
  inactiveColor = "#27272a",
  textColor = "#ffffff",
  steps = [
    { title: "Step 1", description: "Enter your personal details" },
    { title: "Step 2", description: "Choose your preferences" },
    { title: "Step 3", description: "Review and confirm" },
  ],
}: MultiStepFormDemoProps) {
  const [step, setStep] = useState(1);

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-xs mb-8 flex justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-zinc-800 -z-10" />
        {steps.map((_, i) => (
          <div
            key={i + 1}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors"
            style={{
              backgroundColor: step >= i + 1 ? activeColor : inactiveColor,
              color: step >= i + 1 ? textColor : "#71717a"
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>

      <div className="w-full max-w-xs h-32 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
          >
            <h3 className="text-xl font-bold text-white mb-2">Step {step}</h3>
            <p className="text-zinc-400 text-sm">
              {steps[step - 1]?.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-4 mt-4">
        <button
          onClick={() => setStep(Math.max(1, step - 1))}
          disabled={step === 1}
          className="px-4 py-2 rounded bg-zinc-800 text-white disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={() => setStep(Math.min(steps.length, step + 1))}
          disabled={step === steps.length}
          className="px-4 py-2 rounded text-white disabled:opacity-50"
          style={{ backgroundColor: activeColor, color: textColor }}
        >
          Next
        </button>
      </div>
    </div>
  );
}
