"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState, useRef } from "react";

interface ComparisonSliderDemoProps {
  handleColor?: string;
  overlayColor?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function ComparisonSliderDemo(props: ComparisonSliderDemoProps) {
  return <ComparisonSliderImplementation {...props} />;
}

export function ComparisonSliderImplementation({
  handleColor = "#ffffff",
  overlayColor = "#27272a",
  beforeLabel = "BEFORE",
  afterLabel = "AFTER",
}: ComparisonSliderDemoProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center p-8">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden cursor-col-resize group"
      >
        {/* After Image (Base) */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
          <span className="text-4xl font-bold text-white/20">{afterLabel}</span>
        </div>

        {/* Before Image (Overlay) */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center border-r-2"
          style={{ 
            width: `${sliderPosition}%`,
            backgroundColor: overlayColor,
            borderColor: handleColor
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden w-[448px]"> {/* Fixed width to prevent text squishing */}
             <span className="text-4xl font-bold text-white/20">{beforeLabel}</span>
          </div>
        </motion.div>

        {/* Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 cursor-col-resize z-10"
          style={{ 
            left: `${sliderPosition}%`,
            backgroundColor: handleColor
          }}
        >
          <div 
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full shadow-lg flex items-center justify-center"
            style={{ backgroundColor: handleColor }}
          >
            <div className="flex gap-0.5">
              <div className="w-0.5 h-3 bg-zinc-400" />
              <div className="w-0.5 h-3 bg-zinc-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
