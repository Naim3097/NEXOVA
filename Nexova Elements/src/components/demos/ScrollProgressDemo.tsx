"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";

interface ScrollProgressDemoProps {
  barColor?: string;
  height?: string;
}

export default function ScrollProgressDemo(props: ScrollProgressDemoProps) {
  return <ScrollProgressImplementation {...props} />;
}

export function ScrollProgressImplementation({
  barColor = "#3b82f6",
  height = "h-1.5",
}: ScrollProgressDemoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg relative overflow-hidden">
      <motion.div
        className={`absolute top-0 left-0 right-0 ${height} origin-left z-20`}
        style={{ scaleX, backgroundColor: barColor }}
      />
      
      <div 
        ref={containerRef}
        className="h-full overflow-y-auto p-8 scrollbar-hide"
      >
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white">Scroll Me</h3>
          {[...Array(5)].map((_, i) => (
            <p key={i} className="text-zinc-400 text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
