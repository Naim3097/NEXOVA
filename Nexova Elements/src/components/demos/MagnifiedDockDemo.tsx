"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

interface MagnifiedDockDemoProps {
  dockBg?: string;
  iconColor?: string;
  iconCount?: number;
}

export default function MagnifiedDockDemo(props: MagnifiedDockDemoProps) {
  return <MagnifiedDockImplementation {...props} />;
}

export function MagnifiedDockImplementation({
  dockBg = "#27272a",
  iconColor = "#9ca3af",
  iconCount = 8,
}: MagnifiedDockDemoProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div className="w-full h-full min-h-[200px] flex items-end justify-center pb-8 bg-zinc-900">
      <div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="mx-auto flex h-16 items-end gap-4 rounded-2xl px-4 pb-3"
        style={{ backgroundColor: dockBg }}
      >
        {[...Array(iconCount)].map((_, i) => (
          <AppIcon mouseX={mouseX} key={i} iconColor={iconColor} />
        ))}
      </div>
    </div>
  );
}

function AppIcon({ mouseX, iconColor }: { mouseX: any, iconColor: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width, backgroundColor: iconColor }}
      className="aspect-square w-10 rounded-full"
    />
  );
}
