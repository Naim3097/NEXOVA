"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

interface MagneticButtonDemoProps {
  text?: string;
  backgroundColor?: string;
  textColor?: string;
  strength?: number;
}

export default function MagneticButtonDemo(props: MagneticButtonDemoProps) {
  return <MagneticButtonImplementation {...props} />;
}

export function MagneticButtonImplementation({
  text = "Hover Me",
  backgroundColor = "#ffffff",
  textColor = "#000000",
  strength = 0.3,
}: MagneticButtonDemoProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * strength);
    y.set((clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center">
      <motion.button
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ x: springX, y: springY, backgroundColor, color: textColor }}
        className="px-8 py-4 font-bold rounded-full hover:bg-zinc-200 transition-colors"
      >
        {text}
      </motion.button>
    </div>
  );
}
