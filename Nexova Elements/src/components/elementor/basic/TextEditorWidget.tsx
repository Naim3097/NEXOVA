"use client";

import React from "react";

interface TextEditorWidgetProps {
  content?: string;
  align?: "left" | "center" | "right" | "justify";
  color?: string;
  dropCap?: boolean;
}

export default function TextEditorWidget({
  content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
  align = "left",
  color = "#cccccc",
  dropCap = false,
}: TextEditorWidgetProps) {
  return (
    <div
      className={dropCap ? "first-letter:float-left first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:mt-[-6px]" : ""}
      style={{
        color: color,
        textAlign: align,
        fontSize: "1rem",
        lineHeight: "1.6",
      }}
    >
      {content}
    </div>
  );
}
