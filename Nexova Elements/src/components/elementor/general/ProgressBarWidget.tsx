"use client";

import React from "react";

interface ProgressBarWidgetProps {
  percentage?: number;
  title?: string;
  innerInfo?: boolean;
  color?: string;
}

export default function ProgressBarWidget({
  percentage = 50,
  title = "My Skill",
  innerInfo = false,
  color = "#3b82f6",
}: ProgressBarWidgetProps) {
  return (
    <div className="w-full">
      {!innerInfo && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{title}</span>
          <span className="text-sm font-medium text-gray-700">{percentage}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden relative">
        <div 
          className="h-6 rounded-full transition-all duration-1000 flex items-center justify-end px-2"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        >
          {innerInfo && <span className="text-xs font-bold text-white">{title} {percentage}%</span>}
        </div>
      </div>
    </div>
  );
}
