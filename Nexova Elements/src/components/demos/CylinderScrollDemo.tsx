"use client";

import { motion, useAnimation, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface CylinderScrollDemoProps {
  itemColor?: string;
  itemBg?: string;
  borderColor?: string;
  items?: string[];
}

export default function CylinderScrollDemo(props: CylinderScrollDemoProps) {
  return <CylinderScrollImplementation {...props} />;
}

export function CylinderScrollImplementation({
  itemColor = "#ffffff",
  itemBg = "rgba(39, 39, 42, 0.8)",
  borderColor = "#3f3f46",
  items = ["React", "Next.js", "TypeScript", "Tailwind", "Framer", "Three.js", "Node.js", "GraphQL"],
}: CylinderScrollDemoProps) {
  const [rotation, setRotation] = useState(0);
  const controls = useAnimation();
  const isDragging = useRef(false);
  const lastY = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastY.current = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const delta = e.clientY - lastY.current;
    setRotation((prev) => prev + delta * 0.5);
    lastY.current = e.clientY;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const radius = 180;
  const angleStep = 360 / items.length;

  return (
    <div 
      className="w-full h-full min-h-[400px] flex items-center justify-center bg-zinc-900 overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="perspective-1000 w-full h-full flex items-center justify-center" style={{ perspective: "1000px" }}>
        <motion.div
          className="relative w-64 h-16 preserve-3d"
          style={{ 
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotation}deg)`
          }}
          animate={{ rotateX: rotation }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        >
          {items.map((item, index) => {
            const angle = index * angleStep;
            return (
              <div
                key={item}
                className="absolute inset-0 flex items-center justify-center backdrop-blur-sm font-bold text-xl rounded-lg shadow-lg"
                style={{
                  transform: `rotateX(${angle}deg) translateZ(${radius}px)`,
                  backfaceVisibility: "hidden",
                  backgroundColor: itemBg,
                  borderColor: borderColor,
                  borderWidth: 1,
                  color: itemColor,
                }}
              >
                {item}
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
