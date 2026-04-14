"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface MorphingDemoProps {
  color1?: string;
  color2?: string;
  color3?: string;
}

export default function MorphingDemo(props: MorphingDemoProps) {
  return <MorphingImplementation {...props} />;
}

export function MorphingImplementation({
  color1 = "#a855f7",
  color2 = "#3b82f6",
  color3 = "#ec4899",
}: MorphingDemoProps) {
  const [shape, setShape] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setShape((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const variants = {
    0: { borderRadius: "50%", rotate: 0, backgroundColor: color1 }, // Circle
    1: { borderRadius: "0%", rotate: 90, backgroundColor: color2 }, // Square
    2: { borderRadius: "20%", rotate: 180, backgroundColor: color3 }, // Rounded Square
  };

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center">
      <motion.div
        className="w-24 h-24"
        animate={variants[shape as keyof typeof variants]}
        transition={{
          duration: 1,
          ease: "easeInOut",
          type: "spring",
          stiffness: 100,
        }}
      />
    </div>
  );
}
