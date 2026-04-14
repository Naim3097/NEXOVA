"use client";

import React from "react";
import { ShoppingBag } from "lucide-react";

interface MenuCartWidgetProps {
  count?: number;
  total?: string;
  link?: string;
}

export default function MenuCartWidget({ count = 3, total = "$249.00", link = "#" }: MenuCartWidgetProps) {
  return (
    <a href={link} className="inline-flex items-center gap-2 text-white hover:text-emerald-500 transition-colors">
      <div className="relative">
        <ShoppingBag className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
          {count}
        </span>
      </div>
      <span className="font-bold text-sm">{total}</span>
    </a>
  );
}
