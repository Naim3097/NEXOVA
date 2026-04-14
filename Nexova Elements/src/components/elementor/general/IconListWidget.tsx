"use client";

import React from "react";
import { Check } from "lucide-react";

interface IconListWidgetProps {
  layout?: "vertical" | "horizontal";
  align?: "left" | "center" | "right";
  iconColor?: string;
  items?: string[];
}

export default function IconListWidget({
  layout = "vertical",
  align = "left",
  iconColor = "#3b82f6",
  items = ["List Item #1", "List Item #2", "List Item #3"],
}: IconListWidgetProps) {
  return (
    <ul 
      className={`flex ${layout === "vertical" ? "flex-col gap-2" : "flex-row gap-6"}`}
      style={{ 
        justifyContent: align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center",
        alignItems: layout === "vertical" ? (align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center") : "center"
      }}
    >
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-2 text-gray-700">
          <Check size={16} color={iconColor} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
