"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface BookFlipDemoProps {
  coverColor?: string;
  pageColor?: string;
  textColor?: string;
  content?: string;
}

export default function BookFlipDemo(props: BookFlipDemoProps) {
  return <BookFlipImplementation {...props} />;
}

export function BookFlipImplementation({
  coverColor = "#4f46e5",
  pageColor = "#ffffff",
  textColor = "#27272a",
  content = "\"The art of animation brings static interfaces to life, creating meaningful connections.\"",
}: BookFlipDemoProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-zinc-900 perspective-1000" style={{ perspective: 1000 }}>
      <div 
        className="relative w-48 h-64 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Back Cover */}
        <div 
          className="absolute inset-0 rounded-r-lg shadow-xl translate-x-2 translate-z-[-2px]"
          style={{ backgroundColor: coverColor, filter: "brightness(0.7)" }}
        />
        
        {/* Pages */}
        <div className="absolute inset-0 rounded-r-lg shadow-md translate-x-1" style={{ backgroundColor: pageColor }} />
        <div className="absolute inset-0 rounded-r-lg shadow-md translate-x-0.5" style={{ backgroundColor: pageColor }} />

        {/* Front Cover */}
        <motion.div
          className="absolute inset-0 rounded-r-lg shadow-2xl origin-left flex flex-col items-center justify-center p-4 border-l-2"
          style={{ 
            backgroundColor: coverColor,
            borderColor: "rgba(0,0,0,0.2)",
            transformStyle: "preserve-3d" 
          }}
          animate={{ rotateY: isOpen ? -160 : 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 60 }}
        >
          <div className="w-full h-full border-2 border-white/30 rounded flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 bg-white/30 rounded-full" />
            <div className="h-2 w-20 bg-white/30 rounded" />
            <div className="h-2 w-12 bg-white/30 rounded" />
          </div>
          
          {/* Inner Cover (visible when open) */}
          <div 
            className="absolute inset-0 rounded-l-lg rotate-y-180 backface-hidden flex items-center justify-center p-4"
            style={{ 
              backgroundColor: pageColor,
              transform: "rotateY(180deg)", 
              backfaceVisibility: "hidden" 
            }}
          >
            <p className="text-xs text-center font-serif leading-relaxed" style={{ color: textColor }}>
              {content}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
