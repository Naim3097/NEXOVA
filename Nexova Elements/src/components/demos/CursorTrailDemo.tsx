"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

interface CursorTrailDemoProps {
  cursorColor?: string;
  trailColor?: string;
  size?: number;
  text?: string;
}

export default function CursorTrailDemo(props: CursorTrailDemoProps) {
  return <CursorTrailImplementation {...props} />;
}

export function CursorTrailImplementation({
  cursorColor = "#ffffff",
  trailColor = "#ffffff",
  size = 32,
  text = "Move your mouse here",
}: CursorTrailDemoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 700 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - size / 2);
    mouseY.set(e.clientY - rect.top - size / 2);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center overflow-hidden relative cursor-none"
    >
      <span className="text-zinc-500 text-sm">{text}</span>
      
      {/* Custom Cursor */}
      <motion.div
        className="absolute top-0 left-0 border-2 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{ 
          x: cursorX, 
          y: cursorY,
          width: size,
          height: size,
          borderColor: trailColor
        }}
      />
      <motion.div
        className="absolute top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{ 
          x: mouseX, 
          y: mouseY, 
          translateX: size / 2 - 4, 
          translateY: size / 2 - 4,
          backgroundColor: cursorColor
        }}
      />
    </div>
  );
}
