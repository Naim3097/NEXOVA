"use client";

import { motion, Variants } from "framer-motion";
import { MousePointer2 } from "lucide-react";

interface Cursor {
  name: string;
  color: string;
}

interface CollaborativeDemoProps {
  cursors?: Cursor[];
}

export default function CollaborativeDemo(props: CollaborativeDemoProps) {
  return <CollaborativeImplementation {...props} />;
}

export function CollaborativeImplementation({
  cursors = [
    { name: "Sarah", color: "#ec4899" },
    { name: "Mike", color: "#3b82f6" },
  ],
}: CollaborativeDemoProps) {
  const cursorVariants: Variants[] = [
    {
      animate: {
        x: [0, 100, 50, 0],
        y: [0, 50, 100, 0],
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
      }
    },
    {
      animate: {
        x: [150, 50, 100, 150],
        y: [100, 0, 50, 100],
        transition: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
      }
    }
  ];

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg relative overflow-hidden p-8">
      {/* Shared Element */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="w-32 h-32 bg-zinc-800 rounded-xl border border-zinc-700 flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
            borderColor: ["#3f3f46", "#a855f7", "#3f3f46"]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-zinc-500 text-xs">Shared Canvas</span>
        </motion.div>
      </div>

      {cursors.map((cursor, i) => (
        <motion.div
          key={i}
          variants={cursorVariants[i % cursorVariants.length]}
          animate="animate"
          className="absolute top-10 left-10 z-10"
        >
          <MousePointer2 className="w-4 h-4" style={{ color: cursor.color, fill: cursor.color }} />
          <div 
            className="ml-4 -mt-1 px-2 py-0.5 text-white text-[10px] rounded-full whitespace-nowrap"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.name}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
