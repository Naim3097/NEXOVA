"use client";

import React from "react";

interface GoogleMapsWidgetProps {
  address?: string;
  zoom?: number;
  height?: number;
}

export default function GoogleMapsWidget({
  address = "London Eye, London, United Kingdom",
  zoom = 14,
  height = 400,
}: GoogleMapsWidgetProps) {
  const encodedAddress = encodeURIComponent(address);
  
  return (
    <div className="w-full overflow-hidden rounded-lg shadow-sm border border-gray-200 bg-gray-100 relative">
      <iframe
        width="100%"
        height={height}
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src={`https://maps.google.com/maps?q=${encodedAddress}&t=m&z=${zoom}&ie=UTF8&iwloc=&output=embed`}
        title="Google Map"
        className="w-full block filter grayscale-[0.1] hover:grayscale-0 transition-all duration-500"
        loading="lazy"
      ></iframe>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] rounded-lg"></div>
    </div>
  );
}
