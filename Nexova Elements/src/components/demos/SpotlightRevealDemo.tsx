"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

interface SpotlightRevealDemoProps {
  spotlightColor?: string;
  spotlightSize?: number;
}

export default function SpotlightRevealDemo(props: SpotlightRevealDemoProps) {
  return <SpotlightRevealImplementation {...props} />;
}

export function SpotlightRevealImplementation({
  spotlightColor = "rgba(14, 165, 233, 0.15)",
  spotlightSize = 650,
}: SpotlightRevealDemoProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className="w-full h-full min-h-[200px] bg-zinc-950 rounded-lg flex items-center justify-center relative overflow-hidden group"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              ${spotlightSize}px circle at ${mouseX}px ${mouseY}px,
              ${spotlightColor},
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative z-10 p-8 border border-zinc-800 bg-zinc-900/50 rounded-xl max-w-sm">
        <h3 className="text-lg font-bold text-white mb-2">Spotlight Effect</h3>
        <p className="text-zinc-400 text-sm">
          Hover over this card to reveal the spotlight gradient effect that follows your cursor.
        </p>
      </div>
    </div>
  );
}
