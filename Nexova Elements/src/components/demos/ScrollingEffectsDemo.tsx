"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ScrollingEffectsDemoProps {
  cardBg?: string;
  borderColor?: string;
  textColor?: string;
  cards?: number[];
}

export default function ScrollingEffectsDemo(props: ScrollingEffectsDemoProps) {
  return <ScrollingEffectsImplementation {...props} />;
}

export function ScrollingEffectsImplementation({
  cardBg = "#27272a",
  borderColor = "#3f3f46",
  textColor = "#52525b",
  cards = [1, 2, 3, 4, 5],
}: ScrollingEffectsDemoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: containerRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66%"]);

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg relative overflow-hidden">
      <div 
        ref={containerRef} 
        className="absolute inset-0 overflow-y-auto scrollbar-hide"
      >
        <div className="h-[300%] relative">
          <div className="sticky top-0 h-full max-h-[200px] flex items-center overflow-hidden">
            <motion.div style={{ x }} className="flex gap-4 px-8">
              {cards.map((i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-48 h-32 rounded-xl border flex items-center justify-center text-2xl font-bold"
                  style={{ backgroundColor: cardBg, borderColor: borderColor, color: textColor }}
                >
                  {i}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 right-4 text-xs text-zinc-500 font-mono pointer-events-none">
        Scroll Down →
      </div>
    </div>
  );
}
