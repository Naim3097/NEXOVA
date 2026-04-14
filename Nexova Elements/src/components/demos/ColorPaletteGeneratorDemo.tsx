"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { RefreshCw } from "lucide-react";

const generateColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

interface ColorPaletteGeneratorDemoProps {
  initialColors?: string[];
  buttonColor?: string;
  iconColor?: string;
}

export default function ColorPaletteGeneratorDemo(props: ColorPaletteGeneratorDemoProps) {
  return <ColorPaletteGeneratorImplementation {...props} />;
}

export function ColorPaletteGeneratorImplementation({
  initialColors = ["#FF5733", "#33FF57", "#3357FF", "#F333FF"],
  buttonColor = "#ffffff",
  iconColor = "#000000",
}: ColorPaletteGeneratorDemoProps) {
  const [colors, setColors] = useState(initialColors);

  const regenerate = () => {
    setColors([generateColor(), generateColor(), generateColor(), generateColor()]);
  };

  return (
    <div className="w-full h-full min-h-[200px] flex flex-col bg-zinc-900 relative group">
      <div className="flex-1 flex w-full h-full">
        {colors.map((color, index) => (
          <motion.div
            key={index}
            className="flex-1 h-full flex items-end justify-center pb-4"
            initial={{ backgroundColor: color }}
            animate={{ backgroundColor: color }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-xs font-mono bg-black/20 text-white px-1 rounded backdrop-blur-sm">
              {color}
            </span>
          </motion.div>
        ))}
      </div>
      
      <button
        onClick={regenerate}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-3 rounded-full shadow-xl hover:scale-110 active:scale-90 transition-transform"
        style={{ backgroundColor: buttonColor, color: iconColor }}
      >
        <RefreshCw className="w-5 h-5" />
      </button>
    </div>
  );
}
