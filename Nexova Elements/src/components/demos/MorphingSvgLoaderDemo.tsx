"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface MorphingSvgLoaderDemoProps {
  fillColor?: string;
  speed?: number;
  shapes?: string[];
}

export default function MorphingSvgLoaderDemo(props: MorphingSvgLoaderDemoProps) {
  return <MorphingSvgLoaderImplementation {...props} />;
}

export function MorphingSvgLoaderImplementation({
  fillColor = "#3b82f6",
  speed = 1500,
  shapes = [
    "M50 10 L90 90 L10 90 Z", // Triangle
    "M10 10 L90 10 L90 90 L10 90 Z", // Square
    "M50 10 C90 10 90 90 50 90 C10 90 10 10 50 10 Z", // Circle
    "M50 10 L80 40 L80 80 L20 80 L20 40 Z", // Pentagon-ish
  ],
}: MorphingSvgLoaderDemoProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % shapes.length);
    }, speed);
    return () => clearInterval(interval);
  }, [speed, shapes.length]);

  return (
    <div className="w-full h-full min-h-[200px] flex items-center justify-center bg-zinc-900">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <motion.path
            d={shapes[index]}
            fill={fillColor}
            animate={{ d: shapes[index], fill: fillColor }}
            transition={{
              duration: speed / 2000, // Adjust duration based on speed
              ease: "easeInOut",
              type: "spring",
              stiffness: 100,
              damping: 10
            }}
          />
        </svg>
        <div className="absolute -bottom-8 w-full text-center text-zinc-500 text-sm font-mono">
          Loading...
        </div>
      </div>
    </div>
  );
}
