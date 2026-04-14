"use client";

import { motion } from "framer-motion";
import { Upload } from "lucide-react";
import { useState } from "react";

interface FileUploadDemoProps {
  activeColor?: string;
  inactiveColor?: string;
  backgroundColor?: string;
  text?: string;
}

export default function FileUploadDemo(props: FileUploadDemoProps) {
  return <FileUploadImplementation {...props} />;
}

export function FileUploadImplementation({
  activeColor = "#3b82f6",
  inactiveColor = "#3f3f46",
  backgroundColor = "rgba(59, 130, 246, 0.1)",
  text = "Drop files here",
}: FileUploadDemoProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg p-8 flex items-center justify-center">
      <motion.div
        onHoverStart={() => setIsDragging(true)}
        onHoverEnd={() => setIsDragging(false)}
        animate={{
          scale: isDragging ? 1.02 : 1,
          borderColor: isDragging ? activeColor : inactiveColor,
          backgroundColor: isDragging ? backgroundColor : "transparent",
        }}
        className="w-full max-w-sm h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
      >
        <motion.div
          animate={{ y: isDragging ? -5 : 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          <Upload className="w-8 h-8" style={{ color: isDragging ? activeColor : "#71717a" }} />
        </motion.div>
        <span className="text-sm font-medium" style={{ color: isDragging ? activeColor : "#71717a" }}>
          {text}
        </span>
      </motion.div>
    </div>
  );
}
