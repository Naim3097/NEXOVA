import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Templates } from '@/components/landing/Templates';
import { VideoDemo } from '@/components/landing/VideoDemo';
import { Pricing } from '@/components/landing/Pricing';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Templates />
        <VideoDemo />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
