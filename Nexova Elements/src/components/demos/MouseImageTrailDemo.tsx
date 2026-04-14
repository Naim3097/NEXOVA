"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface MouseImageTrailProps {
  images?: string[];
  maxImages?: number;
  distanceThreshold?: number;
}

export function MouseImageTrail({
  images = [
    "https://picsum.photos/seed/1/200/300",
    "https://picsum.photos/seed/2/200/300",
    "https://picsum.photos/seed/3/200/300",
    "https://picsum.photos/seed/4/200/300",
    "https://picsum.photos/seed/5/200/300",
  ],
  maxImages = 5,
  distanceThreshold = 50
}: MouseImageTrailProps) {
  const [trail, setTrail] = useState<{ x: number; y: number; id: number; image: string }[]>([]);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dist = Math.hypot(x - lastPos.current.x, y - lastPos.current.y);

    if (dist > distanceThreshold) {
      lastPos.current = { x, y };
      const randomImage = images[Math.floor(Math.random() * images.length)];
      setTrail((prev) => [...prev.slice(-(maxImages - 1)), { x, y, id: Date.now(), image: randomImage }]);
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="w-full h-full min-h-[400px] bg-zinc-900 relative overflow-hidden cursor-none"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-zinc-500">Move cursor fast</span>
      </div>

      {trail.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute w-24 h-32 bg-cover bg-center rounded-lg shadow-xl pointer-events-none"
          style={{
            left: item.x,
            top: item.y,
            transform: "translate(-50%, -50%)",
            backgroundImage: `url(${item.image})`,
            zIndex: index,
          }}
        />
      ))}
    </div>
  );
}

export default function MouseImageTrailDemo(props: MouseImageTrailProps) {
  return <MouseImageTrail {...props} />;
}
