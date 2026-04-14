"use client";

import React from "react";

interface SidebarWidgetProps {
  sidebar?: string;
}

export default function SidebarWidget({ sidebar = "default-sidebar" }: SidebarWidgetProps) {
  return (
    <div className="bg-white border border-gray-200 p-4 rounded">
      <h4 className="font-bold text-gray-800 mb-4 border-b pb-2">Sidebar: {sidebar}</h4>
      <div className="space-y-4">
        <div className="h-4 bg-gray-100 rounded w-3/4"></div>
        <div className="h-4 bg-gray-100 rounded w-full"></div>
        <div className="h-4 bg-gray-100 rounded w-5/6"></div>
        <div className="h-32 bg-gray-100 rounded w-full"></div>
      </div>
    </div>
  );
}
