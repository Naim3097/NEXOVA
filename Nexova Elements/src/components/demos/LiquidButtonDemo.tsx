"use client";

import { motion } from "framer-motion";
import React, { useId } from "react";

interface LiquidButtonProps {
  text?: string;
  backgroundColor?: string;
  textColor?: string;
}

export function LiquidButton({
  text = "Hover Me",
  backgroundColor = "#6366f1", // indigo-500
  textColor = "#ffffff"
}: LiquidButtonProps) {
  const filterId = useId();
  
  return (
    <div className="w-full h-full min-h-[200px] flex items-center justify-center bg-zinc-900">
      <div className="relative" style={{ filter: `url('#${filterId}')` }}>
        <button 
          className="relative px-8 py-4 font-bold rounded-full z-10 hover:scale-105 transition-transform"
          style={{ backgroundColor, color: textColor }}
        >
          {text}
        </button>
        <motion.div 
          className="absolute top-0 left-0 w-full h-full rounded-full opacity-70"
          style={{ backgroundColor }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 20, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-0 left-0 w-full h-full rounded-full opacity-70"
          style={{ backgroundColor }}
          animate={{
            x: [0, -30, 20, 0],
            y: [0, 20, -20, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse"
          }}
        />
      </div>

      <svg className="hidden">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

export default function LiquidButtonDemo(props: LiquidButtonProps) {
  return <LiquidButton {...props} />;
}
