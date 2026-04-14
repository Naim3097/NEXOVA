"use client";

import { motion } from "framer-motion";

interface InteractiveChartsDemoProps {
  barColorStart?: string;
  barColorEnd?: string;
  textColor?: string;
  data?: number[];
}

export default function InteractiveChartsDemo(props: InteractiveChartsDemoProps) {
  return <InteractiveChartsImplementation {...props} />;
}

export function InteractiveChartsImplementation({
  barColorStart = "#9333ea",
  barColorEnd = "#3b82f6",
  textColor = "#71717a",
  data = [40, 70, 30, 85, 50, 90, 60],
}: InteractiveChartsDemoProps) {
  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-end justify-center gap-4 p-8">
      {data.map((height, i) => (
        <div key={i} className="relative flex flex-col items-center gap-2 w-8">
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: `${height}%` }}
            transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
            className="w-full rounded-t-md"
            style={{ backgroundImage: `linear-gradient(to top, ${barColorEnd}, ${barColorStart})` }}
          />
          <span className="text-xs font-mono" style={{ color: textColor }}>{i + 1}</span>
        </div>
      ))}
    </div>
  );
}
