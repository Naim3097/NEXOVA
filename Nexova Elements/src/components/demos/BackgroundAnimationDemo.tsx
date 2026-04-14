import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
}

export default function BackgroundAnimationDemo({
  color1 = "#4f46e5",
  color2 = "#ec4899",
  color3 = "#8b5cf6",
  speed = 10,
}: Props) {
  return (
    <div className="relative w-full h-[400px] overflow-hidden bg-slate-900 rounded-lg">
      <motion.div
        className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] opacity-50"
        style={{
          background: `conic-gradient(from 0deg, ${color1}, ${color2}, ${color3}, ${color1})`,
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div className="absolute inset-0 backdrop-blur-3xl" />
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <h2 className="text-4xl font-bold text-white">Background Animation</h2>
      </div>
    </div>
  );
}
