"use client";

import { elementorWidgets } from "@/data/elementor-widgets";
import ElementorWidgetCard from "@/components/ElementorWidgetCard";
import UnifiedHeader from "@/components/UnifiedHeader";

export default function ElementorWidgetsPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#455263] selection:bg-[#5BC0BE]/30">
      <UnifiedHeader
        title="UI Elements"
        description="A comprehensive library of Elementor and Elementor Pro widgets, styling, and controls."
        gradientClass="from-[#455263] via-[#5BC0BE] to-[#7C74EA]"
        bgGradientClass="from-[#7C74EA]/20"
        activePage="elementor"
        iconColorClass="text-[#7C74EA]"
        iconBgClass="bg-[#7C74EA]/10 border-[#7C74EA]/20"
        logoColorClass="bg-[#7C74EA]"
      />
      
      <div className="max-w-7xl mx-auto px-6 pb-20 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {elementorWidgets.map((widget, index) => (
            <ElementorWidgetCard 
              key={widget.id} 
              widget={widget} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </main>
  );
}
