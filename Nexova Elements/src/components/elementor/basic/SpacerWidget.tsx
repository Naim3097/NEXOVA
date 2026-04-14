"use client";

import React from "react";

interface SpacerWidgetProps {
  space?: number;
}

export default function SpacerWidget({ space = 50 }: SpacerWidgetProps) {
  return <div style={{ height: `${space}px`, width: "100%" }} />;
}
