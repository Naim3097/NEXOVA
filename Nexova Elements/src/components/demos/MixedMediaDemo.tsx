"use client";

import { motion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";

interface MixedMediaDemoProps {
  scribbleColor1?: string;
  scribbleColor2?: string;
  scribbleColor3?: string;
}

export default function MixedMediaDemo(props: MixedMediaDemoProps) {
  return <MixedMediaImplementation {...props} />;
}

export function MixedMediaImplementation({
  scribbleColor1 = "#ff0088",
  scribbleColor2 = "#3b82f6",
  scribbleColor3 = "#a855f7",
}: MixedMediaDemoProps) {
  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-200 rounded-lg relative overflow-hidden flex items-center justify-center">
      {/* Photo Placeholder */}
      <div className="w-32 h-40 bg-zinc-400 rounded shadow-lg flex items-center justify-center relative z-10 grayscale">
        <ImageIcon className="text-zinc-600 w-8 h-8" />
      </div>

      {/* Vector Scribbles */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
        <motion.path
          d="M 50 50 Q 100 20 150 50"
          fill="none"
          stroke={scribbleColor1}
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", repeatDelay: 1 }}
        />
        <motion.circle
          cx="180"
          cy="150"
          r="10"
          fill="none"
          stroke={scribbleColor2}
          strokeWidth="3"
          initial={{ scale: 0 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
        />
        <motion.path
          d="M 200 100 L 220 120 L 240 100"
          fill="none"
          stroke={scribbleColor3}
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
        />
      </svg>
      
      {/* Grain Texture Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
    </div>
  );
}
