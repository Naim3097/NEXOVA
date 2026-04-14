"use client";

import { motion } from "framer-motion";

interface DoodleDemoProps {
  strokeColor?: string;
  highlightColor?: string;
  text?: string;
}

export default function DoodleDemo(props: DoodleDemoProps) {
  return <DoodleImplementation {...props} />;
}

export function DoodleImplementation({
  strokeColor = "#000000",
  highlightColor = "#ff0088",
  text = "Hand Drawn!",
}: DoodleDemoProps) {
  return (
    <div className="w-full h-full min-h-[200px] bg-white rounded-lg flex items-center justify-center overflow-hidden">
      <svg width="200" height="100" viewBox="0 0 200 100">
        <motion.path
          d="M 20 50 Q 60 20 100 50 T 180 50"
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
          animate={{
            d: [
              "M 20 50 Q 60 20 100 50 T 180 50",
              "M 20 52 Q 60 22 100 52 T 180 52",
              "M 20 48 Q 60 18 100 48 T 180 48",
              "M 20 50 Q 60 20 100 50 T 180 50",
            ]
          }}
          transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle
          cx="100"
          cy="50"
          r="10"
          fill="none"
          stroke={highlightColor}
          strokeWidth="3"
          animate={{
            r: [10, 11, 9, 10],
            cx: [100, 101, 99, 100],
            cy: [50, 51, 49, 50],
          }}
          transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }}
        />
      </svg>
      <div className="absolute bottom-2 right-4 font-handwriting text-black text-sm -rotate-6">
        {text}
      </div>
    </div>
  );
}
