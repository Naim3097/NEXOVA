"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

interface CubeSpinnerDemoProps {
  borderColor?: string;
  textColor?: string;
  labels?: string[];
}

export default function CubeSpinnerDemo(props: CubeSpinnerDemoProps) {
  return <CubeSpinnerImplementation {...props} />;
}

export function CubeSpinnerImplementation({
  borderColor = "rgba(255, 255, 255, 0.5)",
  textColor = "#ffffff",
  labels = ["Front", "Back", "Right", "Left", "Top", "Bottom"],
}: CubeSpinnerDemoProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [45, -45]), { stiffness: 100, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-45, 45]), { stiffness: 100, damping: 20 });

  useEffect(() => {
    // Auto rotate slightly
    const interval = setInterval(() => {
      const time = Date.now() / 1000;
      x.set(Math.sin(time) * 50);
      y.set(Math.cos(time) * 50);
    }, 16);
    return () => clearInterval(interval);
  }, [x, y]);

  const faceStyle = {
    borderColor: borderColor,
    color: textColor,
  };

  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-zinc-900 perspective-1000" style={{ perspective: 800 }}>
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-32 h-32"
      >
        <div className="absolute inset-0 bg-red-500/80 border flex items-center justify-center font-bold text-2xl translate-z-16" style={{ ...faceStyle, transform: "translateZ(64px)" }}>{labels[0]}</div>
        <div className="absolute inset-0 bg-blue-500/80 border flex items-center justify-center font-bold text-2xl translate-z-16 rotate-y-180" style={{ ...faceStyle, transform: "rotateY(180deg) translateZ(64px)" }}>{labels[1]}</div>
        <div className="absolute inset-0 bg-green-500/80 border flex items-center justify-center font-bold text-2xl translate-x-16 rotate-y-90" style={{ ...faceStyle, transform: "rotateY(90deg) translateZ(64px)" }}>{labels[2]}</div>
        <div className="absolute inset-0 bg-yellow-500/80 border flex items-center justify-center font-bold text-2xl -translate-x-16 rotate-y-90" style={{ ...faceStyle, transform: "rotateY(-90deg) translateZ(64px)" }}>{labels[3]}</div>
        <div className="absolute inset-0 bg-purple-500/80 border flex items-center justify-center font-bold text-2xl -translate-y-16 rotate-x-90" style={{ ...faceStyle, transform: "rotateX(90deg) translateZ(64px)" }}>{labels[4]}</div>
        <div className="absolute inset-0 bg-orange-500/80 border flex items-center justify-center font-bold text-2xl translate-y-16 rotate-x-90" style={{ ...faceStyle, transform: "rotateX(-90deg) translateZ(64px)" }}>{labels[5]}</div>
      </motion.div>
    </div>
  );
}
