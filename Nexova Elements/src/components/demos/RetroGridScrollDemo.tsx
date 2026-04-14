"use client";

import { motion } from "framer-motion";
import React from "react";

interface RetroGridProps {
  gridColor?: string;
  sunStartColor?: string;
  sunEndColor?: string;
  speed?: number;
  gridSize?: number;
}

export function RetroGrid({
  gridColor = "rgba(255,0,255,0.3)",
  sunStartColor = "#FACC15", // yellow-400
  sunEndColor = "#DB2777", // pink-600
  speed = 1,
  gridSize = 40
}: RetroGridProps) {
  return (
    <div className="w-full h-full min-h-[300px] bg-black overflow-hidden relative perspective-500" style={{ perspective: "500px" }}>
      {/* Sun */}
      <div 
        className="absolute top-10 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full shadow-[0_0_40px_rgba(255,0,128,0.5)] z-10"
        style={{
            background: `linear-gradient(to bottom, ${sunStartColor}, ${sunEndColor})`
        }}
      />

      {/* Grid Container */}
      <div className="absolute inset-0 w-full h-[200%] origin-top" style={{ transform: "rotateX(60deg)", transformStyle: "preserve-3d" }}>
        <motion.div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
            backgroundSize: `${gridSize}px ${gridSize}px`
          }}
          animate={{
            y: [0, -gridSize]
          }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Horizon Fade */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-transparent to-transparent pointer-events-none z-20" />
    </div>
  );
}

export default function RetroGridScrollDemo(props: RetroGridProps) {
  return <RetroGrid {...props} />;
}
