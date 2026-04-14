"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface ParallaxTiltDemoProps {
  text?: string;
  subtext?: string;
}

export default function ParallaxTiltDemo(props: ParallaxTiltDemoProps) {
  return <ParallaxTiltImplementation {...props} />;
}

export function ParallaxTiltImplementation({
  text = "3D",
  subtext = "Hover to see the parallax effect",
}: ParallaxTiltDemoProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXFromCenter = e.clientX - rect.left - width / 2;
    const mouseYFromCenter = e.clientY - rect.top - height / 2;
    x.set(mouseXFromCenter / width);
    y.set(mouseYFromCenter / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center perspective-1000">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-48 h-64 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-xl flex flex-col items-center justify-center p-6 cursor-pointer"
      >
        <motion.div
          style={{ transform: "translateZ(50px)" }}
          className="text-4xl font-bold text-white mb-2"
        >
          {text}
        </motion.div>
        <motion.p
          style={{ transform: "translateZ(30px)" }}
          className="text-white/80 text-center text-sm"
        >
          {subtext}
        </motion.p>
      </motion.div>
    </div>
  );
}
