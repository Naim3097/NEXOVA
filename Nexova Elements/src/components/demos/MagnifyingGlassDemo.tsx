"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface MagnifyingGlassDemoProps {
  magnifierSize?: number;
  zoomLevel?: number;
  borderColor?: string;
  imageUrl?: string;
}

export default function MagnifyingGlassDemo(props: MagnifyingGlassDemoProps) {
  return <MagnifyingGlassImplementation {...props} />;
}

export function MagnifyingGlassImplementation({
  magnifierSize = 100,
  zoomLevel = 2,
  borderColor = "#ffffff",
  imageUrl = "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&auto=format&fit=crop&q=60",
}: MagnifyingGlassDemoProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setPosition({ x, y });
  };

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center">
      <div
        className="relative w-64 h-40 bg-zinc-800 rounded-lg overflow-hidden cursor-none"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setShowMagnifier(true)}
        onMouseLeave={() => setShowMagnifier(false)}
      >
        <img
          src={imageUrl}
          alt="Demo"
          className="w-full h-full object-cover"
        />

        {showMagnifier && (
          <motion.div
            className="absolute rounded-full shadow-2xl pointer-events-none overflow-hidden bg-zinc-900"
            style={{
              width: magnifierSize,
              height: magnifierSize,
              left: position.x - magnifierSize / 2,
              top: position.y - magnifierSize / 2,
              border: `2px solid ${borderColor}`,
            }}
          >
            <div
              className="absolute"
              style={{
                width: `${zoomLevel * 100}%`,
                height: `${zoomLevel * 100}%`,
                left: -position.x * zoomLevel + magnifierSize / 2,
                top: -position.y * zoomLevel + magnifierSize / 2,
              }}
            >
              <img
                src={imageUrl}
                alt="Zoomed"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
