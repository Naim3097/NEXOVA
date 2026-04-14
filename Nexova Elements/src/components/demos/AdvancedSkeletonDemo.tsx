"use client";

import { motion } from "framer-motion";

export default function AdvancedSkeletonDemo(props: any) {
  return <AdvancedSkeletonImplementation {...props} />;
}

export function AdvancedSkeletonImplementation({
  baseColor = "#27272a",
  shimmerColor = "rgba(255, 255, 255, 0.1)",
  speed = 1.5,
}: any) {
  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg p-8 flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full relative overflow-hidden" style={{ backgroundColor: baseColor }}>
          <motion.div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, transparent, ${shimmerColor}, transparent)`
            }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 rounded relative overflow-hidden" style={{ backgroundColor: baseColor }}>
            <motion.div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, transparent, ${shimmerColor}, transparent)`
              }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <div className="h-3 w-1/4 rounded relative overflow-hidden" style={{ backgroundColor: baseColor }}>
            <motion.div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, transparent, ${shimmerColor}, transparent)`
              }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-lg relative overflow-hidden" style={{ backgroundColor: baseColor }}>
            <motion.div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, transparent, ${shimmerColor}, transparent)`
              }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: speed, repeat: Infinity, ease: "linear", delay: i * 0.1 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
