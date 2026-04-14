"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus } from "lucide-react";

interface AccordionItem {
  q: string;
  a: string;
}

interface AccordionDemoProps {
  items?: AccordionItem[];
  questionColor?: string;
  answerColor?: string;
  iconColor?: string;
}

export default function AccordionDemo(props: AccordionDemoProps) {
  return <AccordionImplementation {...props} />;
}

export function AccordionImplementation({
  items = [
    { q: "Is this component free?", a: "Yes, it is part of the package." },
    { q: "Can I customize the colors?", a: "Absolutely, using Tailwind classes." },
    { q: "Does it support dark mode?", a: "Yes, it is built for dark mode first." },
  ],
  questionColor = "#ffffff",
  answerColor = "#a1a1aa",
  iconColor = "#a1a1aa",
}: AccordionDemoProps) {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-2">
        {items.map((faq, i) => (
          <div key={i} className="bg-zinc-800 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full px-4 py-3 flex items-center justify-between text-left text-sm font-medium"
              style={{ color: questionColor }}
            >
              {faq.q}
              <motion.div
                animate={{ rotate: expanded === i ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Plus className="w-4 h-4" style={{ color: iconColor }} />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {expanded === i && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-4 pb-4 text-sm" style={{ color: answerColor }}>
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
