"use client";

import { motion } from "framer-motion";

interface SkeletonDemoProps {
  baseColor?: string;
  shimmerColor?: string;
}

export default function SkeletonDemo(props: SkeletonDemoProps) {
  return <SkeletonImplementation {...props} />;
}

export function SkeletonImplementation({
  baseColor = "#e4e4e7",
  shimmerColor = "rgba(255, 255, 255, 0.5)",
}: SkeletonDemoProps) {
  const shimmerGradient = `linear-gradient(to right, transparent, ${shimmerColor}, transparent)`;

  return (
    <div className="w-full h-full min-h-[200px] bg-white rounded-lg p-6 flex flex-col gap-4">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full relative overflow-hidden" style={{ backgroundColor: baseColor }}>
          <motion.div
            className="absolute inset-0"
            style={{ background: shimmerGradient }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="w-32 h-4 rounded relative overflow-hidden" style={{ backgroundColor: baseColor }}>
            <motion.div
              className="absolute inset-0"
              style={{ background: shimmerGradient }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <div className="w-20 h-3 rounded relative overflow-hidden" style={{ backgroundColor: baseColor }}>
            <motion.div
              className="absolute inset-0"
              style={{ background: shimmerGradient }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>
      </div>

      {/* Body Skeleton */}
      <div className="w-full h-24 rounded relative overflow-hidden mt-2" style={{ backgroundColor: baseColor }}>
        <motion.div
          className="absolute inset-0"
          style={{ background: shimmerGradient }}
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
}
