"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

interface ElasticDragDemoProps {
  dragColor?: string;
  containerColor?: string;
  borderColor?: string;
  text?: string;
}

export default function ElasticDragDemo(props: ElasticDragDemoProps) {
  return <ElasticDragImplementation {...props} />;
}

export function ElasticDragImplementation({
  dragColor = "#e11d48",
  containerColor = "rgba(39, 39, 42, 0.5)",
  borderColor = "#3f3f46",
  text = "Drag Me",
}: ElasticDragDemoProps) {
  const constraintsRef = useRef(null);

  return (
    <div className="w-full h-full min-h-[300px] bg-zinc-900 flex items-center justify-center overflow-hidden">
      <motion.div 
        ref={constraintsRef} 
        className="w-64 h-64 rounded-full border flex items-center justify-center relative"
        style={{ backgroundColor: containerColor, borderColor: borderColor }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-zinc-600 text-xs uppercase tracking-widest">
          {text}
        </div>
        
        <motion.div
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.2}
          whileHover={{ scale: 1.1, cursor: "grab" }}
          whileTap={{ scale: 0.9, cursor: "grabbing" }}
          className="w-16 h-16 rounded-2xl shadow-lg z-10"
          style={{ backgroundColor: dragColor }}
        />
      </motion.div>
    </div>
  );
}
