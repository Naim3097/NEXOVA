"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface PageTransitionDemoProps {
  color1?: string;
  color2?: string;
  color3?: string;
  pages?: { color: string; text: string }[];
}

export default function PageTransitionDemo(props: PageTransitionDemoProps) {
  return <PageTransitionImplementation {...props} />;
}

export function PageTransitionImplementation({
  color1 = "#a855f7",
  color2 = "#ec4899",
  color3 = "#3b82f6",
  pages = [
    { color: color1, text: "Home" },
    { color: color2, text: "About" },
    { color: color3, text: "Contact" },
  ],
}: PageTransitionDemoProps) {
  const [page, setPage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPage((prev) => (prev + 1) % pages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [pages.length]);

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg relative overflow-hidden flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: pages[page].color }}
        >
          <h2 className="text-2xl font-bold text-white">{pages[page].text}</h2>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
