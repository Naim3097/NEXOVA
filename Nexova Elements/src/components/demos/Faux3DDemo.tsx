"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useRef } from "react";

interface Faux3DDemoProps {
  cardColorStart?: string;
  cardColorEnd?: string;
  textColor?: string;
  text?: string;
}

export default function Faux3DDemo(props: Faux3DDemoProps) {
  return <Faux3DImplementation {...props} />;
}

export function Faux3DImplementation({
  cardColorStart = "#6366f1",
  cardColorEnd = "#8b5cf6",
  textColor = "#8b5cf6",
  text = "HOVER ME",
}: Faux3DDemoProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center perspective-1000">
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateY,
          rotateX,
          transformStyle: "preserve-3d",
          background: `linear-gradient(to bottom right, ${cardColorStart}, ${cardColorEnd})`,
        }}
        className="relative h-32 w-56 rounded-xl"
      >
        <div
          style={{
            transform: "translateZ(75px)",
            transformStyle: "preserve-3d",
          }}
          className="absolute inset-4 grid place-content-center rounded-xl bg-white shadow-lg"
        >
          <span className="text-2xl font-black" style={{ color: textColor }}>{text}</span>
        </div>
      </motion.div>
    </div>
  );
}
