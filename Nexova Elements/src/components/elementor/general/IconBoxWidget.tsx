"use client";

import React from "react";
import { Star } from "lucide-react";

interface IconBoxWidgetProps {
  title?: string;
  description?: string;
  view?: "default" | "stacked" | "framed";
  position?: "top" | "left" | "right";
  align?: "left" | "center" | "right" | "justify";
}

export default function IconBoxWidget({
  title = "This is the heading",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  view = "default",
  position = "top",
  align = "center",
}: IconBoxWidgetProps) {
  const isHorizontal = position === "left" || position === "right";
  const flexDirection = position === "right" ? "row-reverse" : position === "left" ? "row" : "column";

  const iconContainerStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: view !== "default" ? "60px" : "auto",
    height: view !== "default" ? "60px" : "auto",
    backgroundColor: view === "stacked" ? "#3b82f6" : "transparent",
    border: view === "framed" ? "2px solid #3b82f6" : "none",
    borderRadius: "50%",
    color: view === "stacked" ? "white" : "#3b82f6",
    marginBottom: isHorizontal ? 0 : "16px",
  };

  return (
    <div 
      className="flex gap-4"
      style={{ 
        flexDirection: flexDirection as React.CSSProperties['flexDirection'],
        textAlign: align,
        alignItems: isHorizontal ? "flex-start" : align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center"
      }}
    >
      <div className="flex-shrink-0">
        <div style={iconContainerStyle}>
          <Star size={24} fill={view === "stacked" ? "white" : "none"} />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}
