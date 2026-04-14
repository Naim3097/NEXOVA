"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useRef } from "react";

interface HolographicCardProps {
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
}

export default function HolographicCardDemo(props: HolographicCardProps) {
  return <HolographicCardImplementation {...props} />;
}

export function HolographicCardImplementation({
  children,
  width = "100%",
  height = "100%",
}: HolographicCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function onMouseMove({ clientX, clientY }: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPos = clientX - rect.left;
    const yPos = clientY - rect.top;
    const xPct = xPos / rect.width;
    const yPct = yPos / rect.height;
    
    const xRotation = (yPct - 0.5) * 20;
    const yRotation = (xPct - 0.5) * -20;
    
    x.set(xRotation);
    y.set(yRotation);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const bgX = useTransform(mouseX, [-20, 20], ["0%", "100%"]);
  const bgY = useTransform(mouseY, [-20, 20], ["0%", "100%"]);

  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-zinc-900 perspective-1000" style={{ perspective: 1000 }}>
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          width,
          height,
          rotateX: mouseX,
          rotateY: mouseY,
          transformStyle: "preserve-3d",
        }}
        className="relative rounded-xl bg-black border border-zinc-800 overflow-hidden group"
      >
        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
          {children || (
            <>
              <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20" />
              <div>
                <div className="h-4 w-24 bg-white/20 rounded mb-2" />
                <div className="h-3 w-32 bg-white/10 rounded" />
              </div>
            </>
          )}
        </div>

        {/* Holographic Overlay */}
        <motion.div
          className="absolute inset-0 opacity-50 mix-blend-overlay pointer-events-none"
          style={{
            background: useMotionTemplate`
              linear-gradient(
                115deg,
                transparent 0%,
                rgba(255, 0, 150, 0.5) 30%,
                rgba(0, 255, 255, 0.5) 70%,
                transparent 100%
              )
            `,
            backgroundSize: "200% 200%",
            backgroundPositionX: bgX,
            backgroundPositionY: bgY,
          }}
        />
        
        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </motion.div>
    </div>
  );
}
