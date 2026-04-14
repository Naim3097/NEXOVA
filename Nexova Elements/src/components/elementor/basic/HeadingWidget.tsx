"use client";

import React from "react";

interface HeadingWidgetProps {
  text?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span" | "p";
  align?: "left" | "center" | "right" | "justify";
  color?: string;
}

export default function HeadingWidget({
  text = "This is a Heading",
  tag = "h2",
  align = "left",
  color = "#ffffff",
}: HeadingWidgetProps) {
  const Tag = tag as React.ElementType;

  return (
    <Tag
      style={{
        textAlign: align,
        color: color,
        fontWeight: 700,
        lineHeight: 1.2,
        margin: 0,
        fontSize: tag === "h1" ? "2.5rem" : tag === "h2" ? "2rem" : "1.5rem",
      }}
    >
      {text}
    </Tag>
  );
}
