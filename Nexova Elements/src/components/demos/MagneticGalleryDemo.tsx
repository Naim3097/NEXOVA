"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useRef } from "react";

interface MagneticGalleryDemoProps {
  images?: { color: string; xOffset: number; yOffset: number; zIndex?: number }[];
}

export default function MagneticGalleryDemo(props: MagneticGalleryDemoProps) {
  return <MagneticGalleryImplementation {...props} />;
}

export function MagneticGalleryImplementation({
  images = [
    { color: "bg-red-500", xOffset: -100, yOffset: -50 },
    { color: "bg-blue-500", xOffset: 100, yOffset: 50 },
    { color: "bg-green-500", xOffset: 0, yOffset: 0, zIndex: 10 },
  ],
}: MagneticGalleryDemoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full min-h-[400px] flex items-center justify-center bg-zinc-900 overflow-hidden relative"
    >
      {images.map((img, i) => (
        <MagneticImage 
          key={i}
          mouseX={mouseX} 
          mouseY={mouseY} 
          xOffset={img.xOffset} 
          yOffset={img.yOffset} 
          color={img.color} 
          zIndex={img.zIndex} 
        />
      ))}
    </div>
  );
}

function MagneticImage({ mouseX, mouseY, xOffset, yOffset, color, zIndex = 0 }: any) {
  const x = useSpring(useTransform(mouseX, (val: number) => val * 0.2 + xOffset), { stiffness: 150, damping: 15 });
  const y = useSpring(useTransform(mouseY, (val: number) => val * 0.2 + yOffset), { stiffness: 150, damping: 15 });

  return (
    <motion.div
      style={{ x, y, zIndex }}
      className={`absolute w-32 h-40 rounded-lg shadow-xl ${color} opacity-80 backdrop-blur-sm border border-white/20`}
    />
  );
}
