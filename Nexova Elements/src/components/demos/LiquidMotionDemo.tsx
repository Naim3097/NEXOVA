"use client";

import { motion } from "framer-motion";

interface LiquidMotionDemoProps {
  blobColor?: string;
  textColor?: string;
  text?: string;
}

export default function LiquidMotionDemo(props: LiquidMotionDemoProps) {
  return <LiquidMotionImplementation {...props} />;
}

export function LiquidMotionImplementation({
  blobColor = "#ffffff",
  textColor = "#71717a",
  text = "LIQUID",
}: LiquidMotionDemoProps) {
  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center overflow-hidden">
      <div className="relative w-full h-full filter blur-[10px] contrast-[20] bg-black">
        <motion.div
          className="absolute top-1/2 left-1/2 w-20 h-20 rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{ backgroundColor: blobColor }}
          animate={{
            x: ["-50%", "0%", "-50%"],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{ backgroundColor: blobColor }}
          animate={{
            x: ["50%", "-50%", "50%"],
            y: ["-20%", "20%", "-20%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="font-bold mix-blend-difference" style={{ color: textColor }}>{text}</span>
      </div>
    </div>
  );
}
