"use client";

import { motion } from "framer-motion";

interface LoadingDemoProps {
  spinnerColor?: string;
  dotColor?: string;
  speed?: number;
}

export function Loading({ spinnerColor = "#a855f7", dotColor = "#34d399", speed = 1 }: LoadingDemoProps) {
  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex flex-col items-center justify-center gap-8">
      {/* Spinner */}
      <motion.div
        className="w-12 h-12 border-4 rounded-full"
        style={{
          borderColor: `${spinnerColor}4D`, // 30% opacity approx
          borderTopColor: spinnerColor,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Bouncing Dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: dotColor }}
            animate={{ y: [-10, 0, -10] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function LoadingDemo(props: LoadingDemoProps) {
  return <Loading {...props} />;
}
