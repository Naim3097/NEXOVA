"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface GravityPhysicsGridProps {
  colors?: string[];
  blockSize?: number;
}

export function GravityPhysicsGridImplementation({
  colors = [
    "#ef4444", // red-500
    "#3b82f6", // blue-500
    "#22c55e", // green-500
    "#eab308", // yellow-500
    "#a855f7", // purple-500
    "#ec4899", // pink-500
  ],
  blockSize = 56 // w-14 h-14 is 3.5rem = 56px
}: GravityPhysicsGridProps) {
  const [blocks, setBlocks] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (blocks.length < 12) {
        setBlocks((prev) => [...prev, prev.length]);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [blocks]);

  const reset = () => {
    setBlocks([]);
  };

  return (
    <div className="w-full h-full min-h-[300px] bg-zinc-900 flex flex-col items-center justify-end pb-8 relative overflow-hidden">
      <button
        onClick={reset}
        className="absolute top-4 right-4 px-3 py-1 bg-zinc-800 text-xs text-white rounded hover:bg-zinc-700 z-10"
      >
        Reset
      </button>
      
      <div className="flex flex-wrap justify-center gap-2 w-64">
        {blocks.map((id) => (
          <motion.div
            key={id}
            initial={{ y: -400, opacity: 0, rotate: (id * 45) % 360 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{
              type: "spring",
              damping: 12,
              stiffness: 200,
              mass: 1,
            }}
            className="rounded-lg flex items-center justify-center text-white font-bold shadow-lg"
            style={{
              width: blockSize,
              height: blockSize,
              backgroundColor: colors[id % colors.length]
            }}
          >
            {id + 1}
          </motion.div>
        ))}
      </div>
      <div className="w-80 h-2 bg-zinc-700 rounded mt-2" />
    </div>
  );
}

export default function GravityPhysicsGridDemo(props: GravityPhysicsGridProps) {
  return <GravityPhysicsGridImplementation {...props} />;
}
