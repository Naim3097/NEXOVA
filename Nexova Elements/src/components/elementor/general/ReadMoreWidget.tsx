"use client";

import React from "react";

interface ReadMoreWidgetProps {
  text?: string;
  link?: string;
}

export default function ReadMoreWidget({
  text = "Read More",
  link = "#",
}: ReadMoreWidgetProps) {
  return (
    <div className="border-t-2 border-dashed border-gray-300 py-4 text-center relative">
      <span className="bg-white px-4 text-gray-500 text-sm font-medium absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        Read More Cut-off
      </span>
      <a href={link} className="hidden">{text}</a>
    </div>
  );
}
