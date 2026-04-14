"use client";

import React from "react";
import { ControlSchema } from "@/data/controls";
import { Settings2 } from "lucide-react";

interface ControlPanelProps {
  schema: Record<string, ControlSchema>;
  values: Record<string, string | number | boolean>;
  onChange: (key: string, value: string | number | boolean) => void;
}

export default function ControlPanel({ schema, values, onChange }: ControlPanelProps) {
  return (
    <div className="absolute top-4 right-4 z-20 w-64 bg-white border border-[#E2E8F0] rounded-xl p-4 shadow-xl animate-in fade-in slide-in-from-right-4 duration-200">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#E2E8F0]">
        <Settings2 className="w-4 h-4 text-[#5FC7CD]" />
        <h3 className="text-sm font-medium text-[#455263]">Controls</h3>
      </div>
      
      <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
        {Object.entries(schema).map(([key, config]) => (
          <div key={key} className="space-y-1.5">
            <label className="text-xs text-[#455263] font-medium flex justify-between">
              {config.label}
              {config.type === "number" && (
                <span className="text-[#969696] font-mono">{values[key]}</span>
              )}
            </label>

            {config.type === "text" && (
              <input
                type="text"
                value={String(values[key] || "")}
                onChange={(e) => onChange(key, e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded px-2 py-1 text-xs text-[#455263] focus:outline-none focus:border-[#5FC7CD]"
              />
            )}

            {config.type === "select" && (
              <select
                value={String(values[key] || "")}
                onChange={(e) => onChange(key, e.target.value)}
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded px-2 py-1 text-xs text-[#455263] focus:outline-none focus:border-[#5FC7CD]"
              >
                {config.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}

            {config.type === "number" && (
              <input
                type="range"
                min={config.min}
                max={config.max}
                step={config.step || 1}
                value={Number(values[key] || 0)}
                onChange={(e) => onChange(key, parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#5FC7CD]"
              />
            )}

            {config.type === "color" && (
              <div className="flex gap-2">
                <input
                  type="color"
                  value={String(values[key] || "#000000")}
                  onChange={(e) => onChange(key, e.target.value)}
                  className="w-8 h-6 bg-transparent border-0 p-0 cursor-pointer rounded"
                />
                <input
                  type="text"
                  value={String(values[key] || "")}
                  onChange={(e) => onChange(key, e.target.value)}
                  className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded px-2 py-1 text-xs text-[#455263] font-mono focus:outline-none focus:border-[#5FC7CD]"
                />
              </div>
            )}

            {config.type === "boolean" && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(values[key] || false)}
                  onChange={(e) => onChange(key, e.target.checked)}
                  className="w-4 h-4 rounded border-[#E2E8F0] bg-[#F8FAFC] text-[#5FC7CD] focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-xs text-gray-500">Enabled</span>
              </label>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
