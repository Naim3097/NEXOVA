"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import React, { useRef } from "react";

interface GradientFollowerDemoProps {
  text?: string;
}

export default function GradientFollowerDemo(props: GradientFollowerDemoProps) {
  return <GradientFollowerImplementation {...props} />;
}

export function GradientFollowerImplementation({
  text = "Move Cursor",
}: GradientFollowerDemoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 100, damping: 20 });
  const springY = useSpring(y, { stiffness: 100, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="w-full h-full min-h-[300px] bg-zinc-900 relative overflow-hidden cursor-none"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <h2 className="text-4xl font-bold text-white mix-blend-difference">{text}</h2>
      </div>

      <motion.div
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="absolute w-64 h-64 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-50 pointer-events-none"
      />
    </div>
  );
}
