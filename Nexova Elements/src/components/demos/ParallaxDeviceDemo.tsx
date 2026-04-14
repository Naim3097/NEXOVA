"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import React, { useRef } from "react";

interface ParallaxDeviceDemoProps {
  deviceColor?: string;
  borderColor?: string;
}

export default function ParallaxDeviceDemo(props: ParallaxDeviceDemoProps) {
  return <ParallaxDeviceImplementation {...props} />;
}

export function ParallaxDeviceImplementation({
  deviceColor = "#27272a",
  borderColor = "#3f3f46",
}: ParallaxDeviceDemoProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 50 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 50 });

  function onMouseMove({ clientX, clientY }: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPos = clientX - rect.left - rect.width / 2;
    const yPos = clientY - rect.top - rect.height / 2;
    x.set(xPos);
    y.set(yPos);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const rotateX = useTransform(mouseY, [-150, 150], [15, -15]);
  const rotateY = useTransform(mouseX, [-150, 150], [-15, 15]);

  return (
    <div
      className="w-full h-full min-h-[300px] flex items-center justify-center bg-zinc-900 perspective-1000"
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          backgroundColor: deviceColor,
          borderColor: borderColor,
        }}
        className="relative w-48 h-80 rounded-[32px] border-4 shadow-2xl"
      >
        {/* Screen Content */}
        <div
          className="absolute inset-0 rounded-[28px] overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600"
          style={{ transform: "translateZ(20px)" }}
        >
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-b-xl z-20" />
          
          <div className="p-6 pt-16 flex flex-col gap-4">
            <div className="w-full h-24 bg-white/20 rounded-xl backdrop-blur-sm" />
            <div className="w-full h-8 bg-white/10 rounded-lg" />
            <div className="w-2/3 h-8 bg-white/10 rounded-lg" />
          </div>
        </div>

        {/* Floating Elements */}
        <motion.div
          style={{ transform: "translateZ(50px)" }}
          className="absolute -right-8 top-20 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-2xl"
        >
          🚀
        </motion.div>

        <motion.div
          style={{ transform: "translateZ(40px)" }}
          className="absolute -left-6 bottom-20 w-12 h-12 bg-zinc-900 rounded-xl shadow-xl border border-zinc-700 flex items-center justify-center text-xl"
        >
          ✨
        </motion.div>
      </motion.div>
    </div>
  );
}
