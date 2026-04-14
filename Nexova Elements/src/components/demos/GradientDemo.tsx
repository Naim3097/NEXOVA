"use client";

import { motion } from "framer-motion";

interface GradientDemoProps {
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
}

export function GradientImplementation({ color1 = "#a855f7", color2 = "#ec4899", color3 = "#f97316", speed = 5 }: GradientDemoProps) {
  return (
    <div className="w-full h-full min-h-[200px] rounded-lg overflow-hidden relative flex items-center justify-center">
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, ${color1}, ${color2}, ${color3})`,
          backgroundSize: "200% 200%",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
      />
      <span className="relative z-10 text-white font-bold text-xl mix-blend-overlay">
        Gradient Flow
      </span>
    </div>
  );
}

export default function GradientDemo(props: GradientDemoProps) {
  return <GradientImplementation {...props} />;
}
