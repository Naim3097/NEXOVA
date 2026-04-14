"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ScrollytellingDemoProps {
  cardColor?: string;
  textColor?: string;
}

export default function ScrollytellingDemo(props: ScrollytellingDemoProps) {
  return <ScrollytellingImplementation {...props} />;
}

export function ScrollytellingImplementation({
  cardColor = "#a855f7",
  textColor = "#71717a",
}: ScrollytellingDemoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg relative overflow-hidden">
      <div 
        ref={containerRef} 
        className="absolute inset-0 overflow-y-auto scrollbar-hide"
      >
        <div className="h-[300%] flex flex-col items-center justify-center relative">
          <div className="sticky top-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
            <motion.div
              style={{ scale, opacity, rotate, backgroundColor: cardColor }}
              className="w-20 h-20 rounded-xl shadow-2xl"
            />
            <p className="text-xs font-mono animate-pulse" style={{ color: textColor }}>Scroll Me</p>
          </div>
        </div>
      </div>
    </div>
  );
}
