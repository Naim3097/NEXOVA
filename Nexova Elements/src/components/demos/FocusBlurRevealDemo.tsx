"use client";

import { motion } from "framer-motion";

interface FocusCard {
  title: string;
  text: string;
}

interface FocusBlurRevealDemoProps {
  cards?: FocusCard[];
}

export default function FocusBlurRevealDemo(props: FocusBlurRevealDemoProps) {
  return <FocusBlurRevealImplementation {...props} />;
}

export function FocusBlurRevealImplementation({
  cards = [
    { title: "Focus Section 1", text: "Scroll to see me sharpen into view." },
    { title: "Focus Section 2", text: "Scroll to see me sharpen into view." },
    { title: "Focus Section 3", text: "Scroll to see me sharpen into view." },
  ],
}: FocusBlurRevealDemoProps) {
  return (
    <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center bg-zinc-900 gap-8 p-8">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ filter: "blur(10px)", opacity: 0 }}
          whileInView={{ filter: "blur(0px)", opacity: 1 }}
          viewport={{ once: false, margin: "-20%" }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-2">{card.title}</h3>
          <p className="text-zinc-400">{card.text}</p>
        </motion.div>
      ))}
    </div>
  );
}
