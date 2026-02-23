import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Problem } from '@/components/landing/Problem';
import { Features } from '@/components/landing/Features';
import { Testimonials } from '@/components/landing/Testimonials';
import { Pipeline } from '@/components/landing/Pipeline';
import { JugglingTools } from '@/components/landing/JugglingTools';
import { GridFeatures } from '@/components/landing/GridFeatures';
import { BusinessTypes } from '@/components/landing/BusinessTypes';
import { Pricing } from '@/components/landing/Pricing';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <Navbar />
      <main>
        <RevealOnScroll className="relative z-50">
          <Hero />
        </RevealOnScroll>
        <RevealOnScroll delay={200} className="relative z-0">
          <Problem />
        </RevealOnScroll>
        <RevealOnScroll delay={200}>
          <Features />
        </RevealOnScroll>
        <RevealOnScroll delay={200}>
          <Testimonials />
        </RevealOnScroll>
        <RevealOnScroll delay={200}>
          <Pipeline />
        </RevealOnScroll>
        <RevealOnScroll delay={200}>
          <JugglingTools />
        </RevealOnScroll>
        <RevealOnScroll delay={200}>
          <GridFeatures />
        </RevealOnScroll>
        <RevealOnScroll delay={200}>
          <BusinessTypes />
        </RevealOnScroll>
        <RevealOnScroll delay={200}>
          <Pricing />
        </RevealOnScroll>
        <RevealOnScroll delay={200}>
          <CTA />
        </RevealOnScroll>
      </main>
      <Footer />
    </div>
  );
}
