"use client";

import { motion } from "framer-motion";

interface LineAnimationDemoProps {
  color1?: string;
  color2?: string;
}

export default function LineAnimationDemo(props: LineAnimationDemoProps) {
  return <LineAnimationImplementation {...props} />;
}

export function LineAnimationImplementation({
  color1 = "#a855f7",
  color2 = "#3b82f6",
}: LineAnimationDemoProps) {
  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center">
      <svg width="200" height="100" viewBox="0 0 200 100">
        <motion.path
          d="M 10 50 Q 50 10 90 50 T 190 50"
          fill="none"
          stroke={color1}
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.path
          d="M 10 50 Q 50 90 90 50 T 190 50"
          fill="none"
          stroke={color2}
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5,
          }}
        />
      </svg>
    </div>
  );
}
