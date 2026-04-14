"use client";

import { motion, useSpring, useTime, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface InteractiveGlobeDemoProps {
  globeColor?: string;
  backgroundColor?: string;
  rotationSpeed?: number;
  size?: string;
}

export default function InteractiveGlobeDemo(props: InteractiveGlobeDemoProps) {
  return <InteractiveGlobeImplementation {...props} />;
}

export function InteractiveGlobeImplementation({
  globeColor = "#3b82f6", // blue-500
  backgroundColor = "#000000",
  rotationSpeed = 10000,
  size = "12rem" // w-48
}: InteractiveGlobeDemoProps) {
  const time = useTime();
  const rotate = useTransform(time, [0, rotationSpeed], [0, 360], { clamp: false });
  const [mounted, setMounted] = useState(false);
  const [points, setPoints] = useState<Array<{top: string, left: string, duration: number}>>([]);

  useEffect(() => {
    setMounted(true);
    setPoints([...Array(8)].map(() => ({
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 80 + 10}%`,
      duration: 2 + Math.random()
    })));
  }, []);

  return (
    <div 
      className="w-full h-full min-h-[200px] rounded-lg flex items-center justify-center overflow-hidden relative"
      style={{ backgroundColor }}
    >
      <div 
        className="absolute inset-0"
        style={{
            background: `radial-gradient(circle at center, color-mix(in srgb, ${globeColor}, transparent 80%), ${backgroundColor}, ${backgroundColor})`
        }}
      />
      
      <motion.div
        style={{ 
            rotate,
            width: size,
            height: size,
            borderColor: `color-mix(in srgb, ${globeColor}, transparent 70%)`,
            boxShadow: `0 0 50px color-mix(in srgb, ${globeColor}, transparent 80%)`
        }}
        className="relative rounded-full border"
      >
        {/* Longitude Lines */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`long-${i}`}
            className="absolute inset-0 rounded-full border"
            style={{ 
                transform: `rotateY(${i * 30}deg)`,
                borderColor: `color-mix(in srgb, ${globeColor}, transparent 80%)`
            }}
          />
        ))}
        
        {/* Latitude Lines */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`lat-${i}`}
            className="absolute left-0 right-0 border-t"
            style={{ 
              top: `${(i + 1) * 16.6}%`,
              transform: `scaleX(${Math.sin((i + 1) * Math.PI / 6)})`,
              borderColor: `color-mix(in srgb, ${globeColor}, transparent 80%)`
            }}
          />
        ))}

        {/* Data Points */}
        {mounted && points.map((point, i) => (
          <motion.div
            key={`point-${i}`}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              top: point.top,
              left: point.left,
              backgroundColor: globeColor,
              boxShadow: `0 0 10px ${globeColor}`
            }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.5, 1] }}
            transition={{ duration: point.duration, repeat: Infinity }}
          />
        ))}
      </motion.div>
    </div>
  );
}
