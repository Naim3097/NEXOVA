"use client";

import { motion } from "framer-motion";

export default function AnimatedLogoDemo(props: any) {
  return <AnimatedLogoImplementation {...props} />;
}

export function AnimatedLogoImplementation({
  strokeColor = "#a855f7",
  checkColor = "#ffffff",
}: any) {
  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <motion.rect
          x="20"
          y="20"
          width="60"
          height="60"
          rx="10"
          stroke={strokeColor}
          strokeWidth="4"
          fill="transparent"
          initial={{ pathLength: 0, rotate: 0 }}
          animate={{ pathLength: 1, rotate: 90 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        <motion.path
          d="M 35 50 L 50 65 L 65 35"
          stroke={checkColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="transparent"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 1, repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }}
        />
      </svg>
    </div>
  );
}
