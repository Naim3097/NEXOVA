"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

function Counter({ value }: { value: number }) {
  const spring = useSpring(0, { bounce: 0, duration: 2000 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span>{display}</motion.span>;
}

interface NumberCounterDemoProps {
  gradientStart?: string;
  gradientEnd?: string;
  textColor?: string;
  endValue?: number;
}

export default function NumberCounterDemo(props: NumberCounterDemoProps) {
  return <NumberCounterImplementation {...props} />;
}

export function NumberCounterImplementation({
  gradientStart = "#60a5fa",
  gradientEnd = "#a855f7",
  textColor = "#a1a1aa",
  endValue = 1000,
}: NumberCounterDemoProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => (prev === endValue ? 0 : endValue));
    }, 3000);
    return () => clearInterval(interval);
  }, [endValue]);

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex flex-col items-center justify-center gap-4">
      <div 
        className="text-5xl font-bold text-transparent bg-clip-text"
        style={{ backgroundImage: `linear-gradient(to right, ${gradientStart}, ${gradientEnd})` }}
      >
        <Counter value={count} />+
      </div>
      <span className="text-sm uppercase tracking-wider" style={{ color: textColor }}>Happy Customers</span>
    </div>
  );
}
