"use client";

import React from "react";

interface HTMLWidgetProps {
  html?: string;
}

export default function HTMLWidget({ html = "<div><p>Enter your HTML code here</p></div>" }: HTMLWidgetProps) {
  return (
    <div className="border border-gray-200 p-4 rounded bg-white">
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
