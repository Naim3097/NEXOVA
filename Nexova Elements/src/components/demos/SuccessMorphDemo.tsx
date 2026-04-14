"use client";

import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
import { Check, X } from "lucide-react";

interface SuccessMorphDemoProps {
  successColor?: string;
  errorColor?: string;
  idleColor?: string;
}

export default function SuccessMorphDemo(props: SuccessMorphDemoProps) {
  return <SuccessMorphImplementation {...props} />;
}

export function SuccessMorphImplementation({
  successColor = "#22c55e",
  errorColor = "#ef4444",
  idleColor = "#27272a",
}: SuccessMorphDemoProps) {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const controls = useAnimation();

  const handleClick = async (newStatus: "success" | "error") => {
    setStatus(newStatus);
    await controls.start({ scale: [1, 1.2, 1], transition: { duration: 0.3 } });
    setTimeout(() => setStatus("idle"), 2000);
  };

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex flex-col items-center justify-center gap-8">
      <motion.div
        animate={controls}
        className="w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-500"
        style={{
          backgroundColor: status === "idle" ? idleColor : status === "success" ? successColor : errorColor
        }}
      >
        <motion.div
          initial={false}
          animate={{
            scale: status === "idle" ? 0 : 1,
            opacity: status === "idle" ? 0 : 1,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          {status === "success" ? (
            <Check className="w-8 h-8 text-white" />
          ) : (
            <X className="w-8 h-8 text-white" />
          )}
        </motion.div>
      </motion.div>

      <div className="flex gap-4">
        <button
          onClick={() => handleClick("success")}
          className="px-4 py-2 rounded transition-colors"
          style={{ backgroundColor: `${successColor}1A`, color: successColor }}
        >
          Success
        </button>
        <button
          onClick={() => handleClick("error")}
          className="px-4 py-2 rounded transition-colors"
          style={{ backgroundColor: `${errorColor}1A`, color: errorColor }}
        >
          Error
        </button>
      </div>
    </div>
  );
}
