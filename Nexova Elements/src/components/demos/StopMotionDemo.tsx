"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface StopMotionDemoProps {
  frameColor?: string;
  textColor?: string;
  speed?: number;
}

export default function StopMotionDemo(props: StopMotionDemoProps) {
  return <StopMotionImplementation {...props} />;
}

export function StopMotionImplementation({
  frameColor = "#f97316",
  textColor = "#ffffff",
  speed = 250,
}: StopMotionDemoProps) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 4);
    }, speed);
    return () => clearInterval(interval);
  }, [speed]);

  const frames = [
    "rotate-0 scale-100",
    "rotate-3 scale-105",
    "rotate-6 scale-100",
    "rotate-3 scale-95",
  ];

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center">
      <div 
        className={`w-24 h-24 rounded-lg transition-none ${frames[frame]} flex items-center justify-center`}
        style={{ backgroundColor: frameColor }}
      >
        <span className="font-bold text-xl" style={{ color: textColor }}>STOP</span>
      </div>
    </div>
  );
}
