export interface LayoutItem {
  id: string;
  title: string;
  description: string;
  category: "Header" | "Footer" | "Hero" | "Features" | "Testimonials" | "Pricing" | "CTA" | "Team" | "Section" | "Gallery" | "Stats" | "FAQ" | "Contact" | "Blog" | "Process" | "Logos";
  component: React.ComponentType<any>;
  gridSize?: "small" | "medium" | "large" | "full"; 
}

import ModernHeader from "@/components/layouts/headers/ModernHeader";
import CenteredHeader from "@/components/layouts/headers/CenteredHeader";
import SidebarNavigation from "@/components/layouts/headers/SidebarNavigation";
import MinimalFooter from "@/components/layouts/footers/MinimalFooter";
import LargeFooter from "@/components/layouts/footers/LargeFooter";
import GridHero from "@/components/layouts/sections/GridHero";
import SplitScreenHero from "@/components/layouts/heroes/SplitScreenHero";
import VideoBackgroundHero from "@/components/layouts/heroes/VideoBackgroundHero";
import TypographicHero from "@/components/layouts/heroes/TypographicHero";
import SliderHero from "@/components/layouts/heroes/SliderHero";
import FormHero from "@/components/layouts/heroes/FormHero";
import BentoGridFeatures from "@/components/layouts/features/BentoGridFeatures";
import AlternatingFeatures from "@/components/layouts/features/AlternatingFeatures";
import CardGridFeatures from "@/components/layouts/features/CardGridFeatures";
import TabbedFeatures from "@/components/layouts/features/TabbedFeatures";
import StickyScrollFeatures from "@/components/layouts/features/StickyScrollFeatures";
import SimplePricingCards from "@/components/layouts/pricing/SimplePricingCards";
import ComparisonPricingTable from "@/components/layouts/pricing/ComparisonPricingTable";
import TestimonialMarquee from "@/components/layouts/testimonials/TestimonialMarquee";
import TestimonialGrid from "@/components/layouts/testimonials/TestimonialGrid";
import GradientCTA from "@/components/layouts/cta/GradientCTA";
import SplitImageCTA from "@/components/layouts/cta/SplitImageCTA";
import NewsletterSection from "@/components/layouts/cta/NewsletterSection";
import TeamGrid from "@/components/layouts/team/TeamGrid";
import MasonryGallery from "@/components/layouts/gallery/MasonryGallery";
import AnimatedStats from "@/components/layouts/stats/AnimatedStats";
import AccordionFAQ from "@/components/layouts/faq/AccordionFAQ";
import SplitContact from "@/components/layouts/contact/SplitContact";
import BlogGrid from "@/components/layouts/blog/BlogGrid";
import Timeline from "@/components/layouts/process/Timeline";
import LogoCloud from "@/components/layouts/logos/LogoCloud";

export const layouts: LayoutItem[] = [
  {
    id: "modern-header",
    title: "Modern Header",
    description: "Responsive header with mega menu and transparent glassmorphism effect.",
    category: "Header",
    component: ModernHeader,
    gridSize: "full"
  },
  {
    id: "centered-header",
    title: "Centered Header",
    description: "Classic centered logo with split navigation and search.",
    category: "Header",
    component: CenteredHeader,
    gridSize: "full"
  },
  {
    id: "sidebar-navigation",
    title: "Sidebar Navigation",
    description: "Collapsible vertical sidebar for dashboard or documentation sites.",
    category: "Header",
    component: SidebarNavigation,
    gridSize: "full"
  },
  {
    id: "grid-hero",
    title: "Grid Hero Section",
    description: "High-impact hero section with bento-grid style layout and entrance animations.",
    category: "Hero",
    component: GridHero,
    gridSize: "full"
  },
  {
    id: "split-screen-hero",
    title: "Split Screen Hero",
    description: "Classic split layout with typographic focus and large imagery.",
    category: "Hero",
    component: SplitScreenHero,
    gridSize: "full"
  },
  {
    id: "video-bg-hero",
    title: "Video Background Hero",
    description: "Immersive full-screen video background with centered content.",
    category: "Hero",
    component: VideoBackgroundHero,
    gridSize: "full"
  },
  {
    id: "typographic-hero",
    title: "Typographic Hero",
    description: "Bold, large-scale typography driven hero section.",
    category: "Hero",
    component: TypographicHero,
    gridSize: "full"
  },
  {
    id: "slider-hero",
    title: "Slider Hero",
    description: "Full-screen image slider with animated text transitions.",
    category: "Hero",
    component: SliderHero,
    gridSize: "full"
  },
  {
    id: "form-hero",
    title: "Form Hero",
    description: "Conversion-focused hero with embedded lead generation form.",
    category: "Hero",
    component: FormHero,
    gridSize: "full"
  },
  {
    id: "bento-grid-features",
    title: "Bento Grid Features",
    description: "Modern bento-box style grid layout for showcasing features.",
    category: "Features",
    component: BentoGridFeatures,
    gridSize: "full"
  },
  {
    id: "alternating-features",
    title: "Alternating Features",
    description: "Zig-zag layout with text and image pairs.",
    category: "Features",
    component: AlternatingFeatures,
    gridSize: "full"
  },
  {
    id: "card-grid-features",
    title: "Card Grid Features",
    description: "Clean grid of feature cards with icons and hover effects.",
    category: "Features",
    component: CardGridFeatures,
    gridSize: "full"
  },
  {
    id: "tabbed-features",
    title: "Tabbed Features",
    description: "Interactive tabs to organize complex feature sets without clutter.",
    category: "Features",
    component: TabbedFeatures,
    gridSize: "full"
  },
  {
    id: "sticky-scroll-features",
    title: "Sticky Scroll Features",
    description: "Immersive storytelling layout where text scrolls past sticky visuals.",
    category: "Features",
    component: StickyScrollFeatures,
    gridSize: "full"
  },
  {
    id: "simple-pricing",
    title: "Simple Pricing Cards",
    description: "Three-column pricing layout with monthly/yearly toggle.",
    category: "Pricing",
    component: SimplePricingCards,
    gridSize: "full"
  },
  {
    id: "comparison-pricing",
    title: "Comparison Table",
    description: "Detailed feature comparison table for pricing plans.",
    category: "Pricing",
    component: ComparisonPricingTable,
    gridSize: "full"
  },
  {
    id: "testimonial-marquee",
    title: "Testimonial Marquee",
    description: "Infinite scrolling marquee of user testimonials.",
    category: "Testimonials",
    component: TestimonialMarquee,
    gridSize: "full"
  },
  {
    id: "testimonial-grid",
    title: "Testimonial Grid",
    description: "Masonry-style grid of testimonials with author details.",
    category: "Testimonials",
    component: TestimonialGrid,
    gridSize: "full"
  },
  {
    id: "gradient-cta",
    title: "Gradient CTA",
    description: "High-impact call to action with animated gradient background.",
    category: "CTA",
    component: GradientCTA,
    gridSize: "full"
  },
  {
    id: "split-image-cta",
    title: "Split Image CTA",
    description: "Half-width CTA with complementary image.",
    category: "CTA",
    component: SplitImageCTA,
    gridSize: "full"
  },
  {
    id: "newsletter-section",
    title: "Newsletter Section",
    description: "Clean, centered newsletter subscription form with background pattern.",
    category: "CTA",
    component: NewsletterSection,
    gridSize: "full"
  },
  {
    id: "team-grid",
    title: "Team Grid",
    description: "Grid layout for team members with social links on hover.",
    category: "Team",
    component: TeamGrid,
    gridSize: "full"
  },
  {
    id: "masonry-gallery",
    title: "Masonry Gallery",
    description: "Dynamic masonry grid for photography or portfolio work.",
    category: "Gallery",
    component: MasonryGallery,
    gridSize: "full"
  },
  {
    id: "animated-stats",
    title: "Animated Stats",
    description: "Large, bold statistic counters with entrance animations.",
    category: "Stats",
    component: AnimatedStats,
    gridSize: "full"
  },
  {
    id: "accordion-faq",
    title: "Accordion FAQ",
    description: "Clean, expandable accordion list for frequently asked questions.",
    category: "FAQ",
    component: AccordionFAQ,
    gridSize: "full"
  },
  {
    id: "split-contact",
    title: "Split Contact Form",
    description: "Modern contact section with info sidebar and form.",
    category: "Contact",
    component: SplitContact,
    gridSize: "full"
  },
  {
    id: "blog-grid",
    title: "Blog Grid",
    description: "Responsive grid layout for blog posts or news articles.",
    category: "Blog",
    component: BlogGrid,
    gridSize: "full"
  },
  {
    id: "timeline-process",
    title: "Process Timeline",
    description: "Vertical timeline layout to showcase steps or history.",
    category: "Process",
    component: Timeline,
    gridSize: "full"
  },
  {
    id: "logo-cloud",
    title: "Logo Cloud",
    description: "Grayscale logo grid for social proof and partners.",
    category: "Logos",
    component: LogoCloud,
    gridSize: "full"
  },
  {
    id: "minimal-footer",
    title: "Minimal Footer",
    description: "Clean footer layout with newsletter signup and social links.",
    category: "Footer",
    component: MinimalFooter,
    gridSize: "full"
  },
  {
    id: "large-footer",
    title: "Large Footer",
    description: "Comprehensive multi-column footer for large sites.",
    category: "Footer",
    component: LargeFooter,
    gridSize: "full"
  }
];
