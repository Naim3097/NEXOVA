"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, CheckCircle } from "lucide-react";

interface ToastNotificationDemoProps {
  duration?: number;
  successColor?: string;
}

export default function ToastNotificationDemo(props: ToastNotificationDemoProps) {
  return <ToastNotificationImplementation {...props} />;
}

export function ToastNotificationImplementation({
  duration = 3000,
  successColor = "#22c55e",
}: ToastNotificationDemoProps) {
  const [toasts, setToasts] = useState<{ id: number; text: string }[]>([]);

  const addToast = () => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text: "Action completed successfully" }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex items-center justify-center relative overflow-hidden">
      <button
        onClick={addToast}
        className="px-4 py-2 bg-white text-black rounded-md font-medium hover:bg-zinc-200 transition-colors"
      >
        Show Toast
      </button>

      <div className="absolute bottom-4 right-4 flex flex-col gap-2 items-end pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 20, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              layout
              className="bg-zinc-800 border border-zinc-700 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 pointer-events-auto min-w-[280px]"
            >
              <CheckCircle className="w-5 h-5" style={{ color: successColor }} />
              <span className="text-sm">{toast.text}</span>
              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="ml-auto text-zinc-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                className="absolute bottom-0 left-0 h-0.5"
                style={{ backgroundColor: successColor }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
