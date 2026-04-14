"use client";

import { motion } from "framer-motion";
import React from "react";

interface GlitchTextProps {
  text?: string;
  backgroundColor?: string;
  textColor?: string;
  glitchColor1?: string;
  glitchColor2?: string;
}

export default function GlitchImageDemo(props: GlitchTextProps) {
  return <GlitchText {...props} />;
}

export function GlitchText({
  text = "GLITCH",
  backgroundColor = "#27272a", // zinc-800
  textColor = "#ffffff",
  glitchColor1 = "rgba(239, 68, 68, 0.5)", // red-500/50
  glitchColor2 = "rgba(59, 130, 246, 0.5)" // blue-500/50
}: GlitchTextProps) {
  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-zinc-900">
      <div className="relative w-64 h-40 group cursor-pointer">
        <div 
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor }}
        >
          <h2 
            className="text-4xl font-black tracking-tighter"
            style={{ color: textColor }}
          >
            {text}
          </h2>
        </div>
        
        {/* Glitch Layers */}
        <motion.div 
          className="absolute inset-0 mix-blend-screen opacity-0 group-hover:opacity-100 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: glitchColor1 }}
          animate={{
            clipPath: [
              "inset(20% 0 50% 0)",
              "inset(60% 0 10% 0)",
              "inset(40% 0 30% 0)",
              "inset(80% 0 5% 0)",
              "inset(10% 0 70% 0)",
              "inset(30% 0 40% 0)"
            ],
            x: [-2, 2, -2, 2, -1, 1],
            y: [1, -1, 2, -2, 1, -1]
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
        >
          <h2 
            className="text-4xl font-black tracking-tighter translate-x-1"
            style={{ color: textColor }}
          >
            {text}
          </h2>
        </motion.div>

        <motion.div 
          className="absolute inset-0 mix-blend-screen opacity-0 group-hover:opacity-100 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: glitchColor2 }}
          animate={{
            clipPath: [
              "inset(10% 0 60% 0)",
              "inset(30% 0 20% 0)",
              "inset(70% 0 10% 0)",
              "inset(20% 0 50% 0)",
              "inset(50% 0 30% 0)",
              "inset(0% 0 80% 0)"
            ],
            x: [2, -2, 2, -2, 1, -1],
            y: [-1, 1, -2, 2, -1, 1]
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
        >
          <h2 
            className="text-4xl font-black tracking-tighter -translate-x-1"
            style={{ color: textColor }}
          >
            {text}
          </h2>
        </motion.div>
      </div>
    </div>
  );
}


