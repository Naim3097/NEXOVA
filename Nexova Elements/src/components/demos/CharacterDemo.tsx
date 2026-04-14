"use client";

import { motion } from "framer-motion";

export default function CharacterDemo(props: any) {
  return <CharacterImplementation {...props} />;
}

export function CharacterImplementation({
  skinColor = "#a855f7",
  eyeColor = "#ffffff",
  mouthColor = "#ffffff",
}: any) {
  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center">
      <svg width="120" height="120" viewBox="0 0 120 120">
        {/* Head */}
        <motion.circle
          cx="60"
          cy="60"
          r="50"
          fill={skinColor}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Eyes */}
        <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <motion.ellipse
            cx="45"
            cy="50"
            rx="5"
            ry="8"
            fill={eyeColor}
            animate={{ ry: [8, 1, 8] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
          />
          <motion.ellipse
            cx="75"
            cy="50"
            rx="5"
            ry="8"
            fill={eyeColor}
            animate={{ ry: [8, 1, 8] }}
            transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
          />
        </motion.g>

        {/* Mouth */}
        <motion.path
          d="M 40 75 Q 60 90 80 75"
          stroke={mouthColor}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          animate={{ d: ["M 40 75 Q 60 90 80 75", "M 40 75 Q 60 80 80 75", "M 40 75 Q 60 90 80 75"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
