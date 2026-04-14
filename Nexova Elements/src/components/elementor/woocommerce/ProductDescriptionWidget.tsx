"use client";

import React from "react";

interface ProductDescriptionWidgetProps {
  description?: string;
}

export default function ProductDescriptionWidget({ 
  description = `
    <p>Experience crystal-clear sound with our premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions, these headphones are perfect for music lovers on the go.</p>
    <ul class="list-disc list-inside mt-2 space-y-1 text-zinc-400">
      <li>Active Noise Cancellation</li>
      <li>Bluetooth 5.0 Connectivity</li>
      <li>Fast Charging Support</li>
    </ul>
  `
}: ProductDescriptionWidgetProps) {
  return (
    <div 
      className="text-zinc-300 text-sm leading-relaxed"
      dangerouslySetInnerHTML={{ __html: description }}
    />
  );
}
