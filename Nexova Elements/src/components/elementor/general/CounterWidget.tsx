"use client";

import React from "react";

interface CounterWidgetProps {
  start?: number;
  end?: number;
  prefix?: string;
  suffix?: string;
  title?: string;
  duration?: number;
}

export default function CounterWidget({
  start: _start = 0,
  end = 100,
  prefix = "",
  suffix = "%",
  title = "Cool Number",
  duration: _duration = 2000,
}: CounterWidgetProps) {
  return (
    <div className="text-center p-4">
      <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
        <span className="text-gray-400 text-2xl mr-1">{prefix}</span>
        {end}
        <span className="text-gray-400 text-2xl ml-1">{suffix}</span>
      </div>
      <div className="text-lg text-gray-600 font-medium">{title}</div>
    </div>
  );
}
