"use client";

import React from "react";
import { Anchor } from "lucide-react";

interface MenuAnchorWidgetProps {
  anchor?: string;
}

export default function MenuAnchorWidget({ anchor = "my-anchor" }: MenuAnchorWidgetProps) {
  return (
    <div className="bg-gray-100 border border-dashed border-gray-300 p-2 text-center rounded text-gray-500 text-xs flex items-center justify-center gap-2">
      <Anchor size={14} />
      <span>Menu Anchor: #{anchor}</span>
    </div>
  );
}
