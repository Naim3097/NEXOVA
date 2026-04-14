"use client";

import { motion, useTime, useTransform } from "framer-motion";

interface RealTimeRenderingDemoProps {
  primaryColor?: string;
  secondaryColor?: string;
}

export default function RealTimeRenderingDemo(props: RealTimeRenderingDemoProps) {
  return <RealTimeRenderingImplementation {...props} />;
}

export function RealTimeRenderingImplementation({
  primaryColor = "rgba(168, 85, 247, 0.3)",
  secondaryColor = "rgba(59, 130, 246, 0.3)",
}: RealTimeRenderingDemoProps) {
  const time = useTime();
  const rotateX = useTransform(time, [0, 4000], [0, 360], { clamp: false });
  const rotateY = useTransform(time, [0, 4000], [0, 360], { clamp: false });

  const boxStyle = (color: string) => ({
    backgroundColor: color,
    borderColor: color.replace("0.3", "0.5"), // Rough approximation for border
  });

  return (
    <div className="w-full h-full min-h-[200px] bg-black rounded-lg flex items-center justify-center perspective-800">
      <div className="relative w-24 h-24" style={{ perspective: "1000px" }}>
        <motion.div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transformStyle: "preserve-3d",
            rotateX,
            rotateY,
          }}
        >
          {/* Front */}
          <div 
            className="absolute inset-0 border flex items-center justify-center text-white text-xs font-bold"
            style={{ ...boxStyle(primaryColor), transform: "translateZ(48px)", backfaceVisibility: "visible" }}
          >
            FRONT
          </div>
          {/* Back */}
          <div 
            className="absolute inset-0 border flex items-center justify-center text-white text-xs font-bold"
            style={{ ...boxStyle(secondaryColor), transform: "translateZ(-48px) rotateY(180deg)", backfaceVisibility: "visible" }}
          >
            BACK
          </div>
          {/* Right */}
          <div 
            className="absolute inset-0 border flex items-center justify-center text-white text-xs font-bold"
            style={{ ...boxStyle(primaryColor), transform: "translateX(48px) rotateY(90deg)", backfaceVisibility: "visible" }}
          >
            RIGHT
          </div>
          {/* Left */}
          <div 
            className="absolute inset-0 border flex items-center justify-center text-white text-xs font-bold"
            style={{ ...boxStyle(secondaryColor), transform: "translateX(-48px) rotateY(-90deg)", backfaceVisibility: "visible" }}
          >
            LEFT
          </div>
          {/* Top */}
          <div 
            className="absolute inset-0 border flex items-center justify-center text-white text-xs font-bold"
            style={{ ...boxStyle(primaryColor), transform: "translateY(-48px) rotateX(90deg)", backfaceVisibility: "visible" }}
          >
            TOP
          </div>
          {/* Bottom */}
          <div 
            className="absolute inset-0 border flex items-center justify-center text-white text-xs font-bold"
            style={{ ...boxStyle(secondaryColor), transform: "translateY(48px) rotateX(-90deg)", backfaceVisibility: "visible" }}
          >
            BOTTOM
          </div>
        </motion.div>
      </div>
    </div>
  );
}
