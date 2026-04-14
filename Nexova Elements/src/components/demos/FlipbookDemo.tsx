"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface FlipbookDemoProps {
  coverColor?: string;
  pageColor?: string;
  textColor?: string;
  coverText?: string;
  contentText?: string;
}

export default function FlipbookDemo(props: FlipbookDemoProps) {
  return <FlipbookImplementation {...props} />;
}

export function FlipbookImplementation({
  coverColor = "#27272a",
  pageColor = "#ffffff",
  textColor = "#27272a",
  coverText = "Click Me",
  contentText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
}: FlipbookDemoProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center perspective-1000">
      <div 
        className="relative w-32 h-44 cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full absolute inset-0 transform-style-3d"
          animate={{ rotateY: isFlipped ? -180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        >
          {/* Front Cover */}
          <div 
            className="absolute inset-0 rounded-r-md border-l-2 border-zinc-700 flex items-center justify-center shadow-xl"
            style={{ backfaceVisibility: "hidden", backgroundColor: coverColor }}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-2" />
              <span className="text-xs text-zinc-400">{coverText}</span>
            </div>
          </div>

          {/* Back Cover (Inside) */}
          <div 
            className="absolute inset-0 rounded-l-md border-r-2 border-zinc-200 flex items-center justify-center"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)", backgroundColor: pageColor }}
          >
            <div className="p-4 text-[8px] leading-relaxed" style={{ color: textColor }}>
              {contentText}
            </div>
          </div>
        </motion.div>
        
        {/* Static Back Page */}
        <div className="absolute inset-0 rounded-r-md -z-10 translate-x-1 translate-y-1" style={{ backgroundColor: coverColor }} />
      </div>
    </div>
  );
}
