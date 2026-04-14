"use client";

import { motion } from "framer-motion";
import React from "react";

interface DnaHelixProps {
  color1?: string;
  color2?: string;
  speed?: number;
}

export default function DnaHelixDemo(props: DnaHelixProps) {
  return <DnaHelixImplementation {...props} />;
}

export function DnaHelixImplementation({
  color1 = "#3b82f6", // blue-500
  color2 = "#a855f7", // purple-500
  speed = 4
}: DnaHelixProps) {
  return (
    <div 
      className="w-full h-full min-h-[300px] flex items-center justify-center bg-zinc-900 overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      <div className="relative w-40 h-80 flex flex-col justify-between" style={{ transformStyle: "preserve-3d" }}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="relative w-full h-2 flex items-center justify-between"
            style={{ transformStyle: "preserve-3d" }}
            initial={{ rotateY: i * 18 }}
            animate={{ rotateY: i * 18 + 360 }}
            transition={{
              duration: speed,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: color1,
                boxShadow: `0 0 10px ${color1}CC` // approx 0.8 opacity
              }}
            />
            <div className="h-[1px] flex-1 bg-white/20 mx-1" />
            <div 
              className="w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: color2,
                boxShadow: `0 0 10px ${color2}CC`
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
