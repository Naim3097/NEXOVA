"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React from "react";

interface KineticTypographyProps {
  texts?: string[];
  baseColor?: string;
  strokeColor?: string;
}

export function KineticTypography({
  texts = ["VELOCITY", "MOMENTUM", "KINETIC", "MOTION"],
  baseColor = "white",
  strokeColor = "white"
}: KineticTypographyProps) {
  const x = useMotionValue(0);
  const skew = useSpring(useTransform(x, [-500, 500], [20, -20]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    x.set(e.movementX * 10);
  };

  const handleMouseLeave = () => {
    x.set(0);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-zinc-900 overflow-hidden cursor-default"
    >
      {texts.map((text, i) => (
        <motion.h1
          key={text}
          style={{ 
            skewX: skew,
            WebkitTextStroke: i % 2 !== 0 ? `1px ${strokeColor}` : "none",
            color: i % 2 === 0 ? baseColor : "transparent"
          }}
          className="text-6xl font-black tracking-tighter leading-none"
        >
          {text}
        </motion.h1>
      ))}
    </div>
  );
}

export default function KineticTypographyDemo(props: KineticTypographyProps) {
  return <KineticTypography {...props} />;
}
