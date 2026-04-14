"use client";

import React from "react";

interface DividerWidgetProps {
  style?: "solid" | "dashed" | "dotted" | "double";
  width?: number;
  align?: "left" | "center" | "right";
  color?: string;
  weight?: number;
  gap?: number;
}

export default function DividerWidget({
  style = "solid",
  width = 100,
  align = "center",
  color = "#ffffff",
  weight = 1,
  gap = 15,
}: DividerWidgetProps) {
  return (
    <div
      style={{
        paddingTop: `${gap}px`,
        paddingBottom: `${gap}px`,
        display: "flex",
        justifyContent: align === "left" ? "flex-start" : align === "right" ? "flex-end" : "center",
      }}
    >
      <div
        style={{
          width: `${width}%`,
          borderTopWidth: `${weight}px`,
          borderTopStyle: style,
          borderTopColor: color,
        }}
      />
    </div>
  );
}
