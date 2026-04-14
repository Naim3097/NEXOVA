"use client";

import { motion } from "framer-motion";

interface MicroInteractionDemoProps {
  heartColor?: string;
  toggleColor?: string;
}

export default function MicroInteractionDemo(props: MicroInteractionDemoProps) {
  return <MicroInteractionImplementation {...props} />;
}

export function MicroInteractionImplementation({
  heartColor = "#ec4899",
  toggleColor = "#3f3f46",
}: MicroInteractionDemoProps) {
  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center gap-8">
      {/* Like Button */}
      <motion.button
        className="p-4 rounded-full bg-zinc-800"
        whileTap={{ scale: 0.8 }}
      >
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: heartColor }}
          initial={{ fill: "transparent" }}
          whileHover={{ fill: `${heartColor}33` }} // 20% opacity
          whileTap={{ scale: 1.2, fill: heartColor }}
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </motion.svg>
      </motion.button>

      {/* Toggle */}
      <div className="flex items-center justify-center">
        <label className="flex items-center cursor-pointer">
          <div className="relative">
            <input type="checkbox" className="sr-only" />
            <motion.div
              className="w-14 h-8 rounded-full p-1"
              style={{ backgroundColor: "#3f3f46" }} // Default off state
              initial={false}
              animate={{ backgroundColor: toggleColor }}
              whileHover={{ cursor: "pointer" }}
            >
              <motion.div
                className="bg-white w-6 h-6 rounded-full shadow-md"
                layout
                transition={{
                  type: "spring",
                  stiffness: 700,
                  damping: 30
                }}
              />
            </motion.div>
          </div>
        </label>
      </div>
    </div>
  );
}
