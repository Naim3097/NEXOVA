"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface PasswordStrengthDemoProps {
  weakColor?: string;
  fairColor?: string;
  goodColor?: string;
  strongColor?: string;
}

export default function PasswordStrengthDemo(props: PasswordStrengthDemoProps) {
  return <PasswordStrengthImplementation {...props} />;
}

export function PasswordStrengthImplementation({
  weakColor = "#ef4444",
  fairColor = "#f59e0b",
  goodColor = "#eab308",
  strongColor = "#22c55e",
}: PasswordStrengthDemoProps) {
  const [password, setPassword] = useState("");

  const getStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 4) score++;
    if (pass.length > 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    return score;
  };

  const strength = getStrength(password);
  const colors = [weakColor, fairColor, goodColor, strongColor];

  return (
    <div className="w-full h-full min-h-[200px] bg-zinc-900 rounded-lg flex flex-col items-center justify-center gap-4 p-8">
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full max-w-xs bg-zinc-800 border border-zinc-700 rounded-md px-4 py-2 text-white outline-none focus:border-blue-500 transition-colors"
      />
      
      <div className="w-full max-w-xs flex gap-2 h-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex-1 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{
                width: strength > i ? "100%" : "0%",
                backgroundColor: colors[strength - 1] || colors[0],
              }}
              className="h-full"
            />
          </div>
        ))}
      </div>
      
      <span className="text-xs text-zinc-500">
        {["Weak", "Fair", "Good", "Strong"][Math.max(0, strength - 1)]}
      </span>
    </div>
  );
}
