import { animations } from "@/data/animations";
import AnimationCard from "@/components/AnimationCard";
import UnifiedHeader from "@/components/UnifiedHeader";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#455263] selection:bg-[#5BC0BE]/30">
      <UnifiedHeader
        title="Nexova Elements"
        description="A curated gallery of high-end animations, UI elements and layout blocks — built for the Nexova ecosystem."
        gradientClass="from-[#455263] via-[#5BC0BE] to-[#7C74EA]"
        bgGradientClass="from-[#5BC0BE]/20"
        activePage="home"
        iconColorClass="text-[#5FC7CD]"
        iconBgClass="bg-[#5FC7CD]/10 border-[#5FC7CD]/20"
        logoColorClass="bg-[#5FC7CD]"
      />
      
      <div className="max-w-7xl mx-auto px-6 pb-20 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {animations.map((animation, index) => (
            <AnimationCard 
              key={animation.id} 
              animation={animation} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </main>
  );
}

