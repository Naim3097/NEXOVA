"use client";

import React from "react";

interface ShortcodeWidgetProps {
  shortcode?: string;
}

export default function ShortcodeWidget({ shortcode = "[my-shortcode]" }: ShortcodeWidgetProps) {
  return (
    <div className="bg-gray-100 border border-dashed border-gray-300 p-4 text-center rounded text-gray-600 font-mono text-sm">
      {shortcode}
    </div>
  );
}
