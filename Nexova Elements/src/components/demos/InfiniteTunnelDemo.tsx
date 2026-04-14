"use client";

import { motion } from "framer-motion";
import React from "react";

interface InfiniteTunnelProps {
  color?: string;
  speed?: number;
  size?: number;
}

export function InfiniteTunnelImplementation({
  color = "#06b6d4", // cyan-500
  speed = 5,
  size = 200
}: InfiniteTunnelProps) {
  return (
    <div className="w-full h-full min-h-[300px] bg-black flex items-center justify-center overflow-hidden perspective-500" style={{ perspective: "500px" }}>
      <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute border-2 rounded-full"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              borderColor: `color-mix(in srgb, ${color}, transparent 50%)`
            }}
            initial={{ z: -1000, scale: 0.1, opacity: 0 }}
            animate={{
              z: 500,
              scale: 2,
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: speed,
              repeat: Infinity,
              ease: "linear",
              delay: i * (speed / 5),
              times: [0, 0.1, 0.9, 1]
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function InfiniteTunnelDemo(props: InfiniteTunnelProps) {
  return <InfiniteTunnelImplementation {...props} />;
}
