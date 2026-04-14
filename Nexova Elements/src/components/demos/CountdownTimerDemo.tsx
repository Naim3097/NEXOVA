"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CountdownTimerDemoProps {
  initialTime?: number;
  labelColor?: string;
  digitColor?: string;
  boxColor?: string;
  borderColor?: string;
}

export default function CountdownTimerDemo(props: CountdownTimerDemoProps) {
  return <CountdownTimerImplementation {...props} />;
}

export function CountdownTimerImplementation({
  initialTime = 3600,
  labelColor = "#f87171",
  digitColor = "#ffffff",
  boxColor = "#27272a",
  borderColor = "#3f3f46",
}: CountdownTimerDemoProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : initialTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [initialTime]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return { h, m, s };
  };

  const { h, m, s } = formatTime(timeLeft);

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex flex-col items-center justify-center gap-4">
      <span 
        className="text-xs font-bold tracking-widest uppercase animate-pulse"
        style={{ color: labelColor }}
      >
        Offer Ends In
      </span>
      <div className="flex gap-4">
        {[h, m, s].map((val, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <div 
              className="w-16 h-16 rounded-lg flex items-center justify-center border"
              style={{ 
                backgroundColor: boxColor,
                borderColor: borderColor
              }}
            >
              <motion.span
                key={val}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-2xl font-mono font-bold"
                style={{ color: digitColor }}
              >
                {String(val).padStart(2, "0")}
              </motion.span>
            </div>
            <span className="text-[10px] text-zinc-500 uppercase">
              {["Hrs", "Min", "Sec"][i]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
