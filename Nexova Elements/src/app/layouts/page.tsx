"use client";

import { layouts } from "@/data/layouts";
import LayoutCard from "@/components/LayoutCard";
import UnifiedHeader from "@/components/UnifiedHeader";

export default function LayoutsPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#455263] selection:bg-[#5BC0BE]/30">
      <UnifiedHeader
        title="Layout Blocks"
        description={
          <>
            Production-ready layout blocks. Headers, Footers, Heroes, and more.
            <br />Copy, paste, and customize.
          </>
        }
        gradientClass="from-[#455263] via-[#5BC0BE] to-[#7C74EA]"
        bgGradientClass="from-[#5BC0BE]/20"
        activePage="layouts"
        iconColorClass="text-[#5FC7CD]"
        iconBgClass="bg-[#5FC7CD]/10 border-[#5FC7CD]/20"
        logoColorClass="bg-[#5FC7CD]"
      />
      
      <div className="max-w-7xl mx-auto px-6 pb-20 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {layouts.map((layout, index) => (
            <LayoutCard 
              key={layout.id} 
              layout={layout} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </main>
  );
}
