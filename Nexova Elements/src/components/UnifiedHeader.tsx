"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface UnifiedHeaderProps {
  title: string;
  description: React.ReactNode;
  icon?: LucideIcon;
  gradientClass: string;
  bgGradientClass?: string;   // kept for API compat, no longer used
  activePage: "home" | "layouts" | "elementor";
  iconColorClass: string;
  iconBgClass: string;
  logoColorClass?: string;    // kept for API compat, no longer used
}

export default function UnifiedHeader({
  title,
  description,
  icon: Icon,
  gradientClass,
  activePage,
  iconColorClass,
  iconBgClass,
}: UnifiedHeaderProps) {
  return (
    <>
      {/* ── Sticky Nexova Navbar ─────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 hover:opacity-80 transition-opacity">
            <Image src="/logo-nexova.png" alt="Nexova" width={120} height={40} className="h-7 w-auto" />
          </Link>

          {/* Centred nav pill */}
          <div className="hidden sm:flex gap-1 items-center bg-gray-100/80 rounded-full px-2 py-1.5 backdrop-blur-sm">
            <Link
              href="/"
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                activePage === "home"
                  ? "bg-[#5FC7CD]/15 text-[#5FC7CD] font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
              )}
            >
              Animations
            </Link>
            <Link
              href="/layouts"
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                activePage === "layouts"
                  ? "bg-[#5FC7CD]/15 text-[#5FC7CD] font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
              )}
            >
              Layouts
            </Link>
            <Link
              href="/elementor-widgets"
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                activePage === "elementor"
                  ? "bg-[#5FC7CD]/15 text-[#5FC7CD] font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
              )}
            >
              Elements
            </Link>
          </div>

          {/* CTA */}
          <Link href="http://localhost:3001">
            <button className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] hover:opacity-90 transition-opacity text-white rounded-full px-6 py-2.5 text-sm font-medium shadow-md border-0">
              Go to Nexova
            </button>
          </Link>
        </div>
      </nav>

      {/* ── Page Hero ───────────────────────────────────────────────── */}
      <header className="py-20 px-6 text-center relative overflow-hidden bg-white">
        {/* Ambient glow — same pattern as Landing Page CTA section */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#5BC0BE]/8 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#7C74EA]/8 rounded-full blur-[100px] translate-y-10" />
        </div>

        {/* Decorative dotted SVG lines — same as Landing Page Hero */}
        <div className="absolute inset-0 -z-10 pointer-events-none hidden md:block">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 1200 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 350 Q 60 180, 220 80" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="6 6" fill="none" />
            <path d="M80 350 Q 40 180, 200 80" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="6 6" fill="none" opacity="0.6" />
            <path d="M1100 350 Q 1140 180, 980 80" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="6 6" fill="none" />
            <path d="M1120 350 Q 1160 180, 1000 80" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="6 6" fill="none" opacity="0.6" />
          </svg>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          {Icon && (
            <div className="flex justify-center mb-6">
              <div className={cn("p-3 rounded-2xl border", iconBgClass, iconColorClass)}>
                <Icon className="w-8 h-8" />
              </div>
            </div>
          )}

          <h1 className={cn(
            "text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r mb-6 tracking-tight",
            gradientClass
          )}>
            {title}
          </h1>

          <div className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            {description}
          </div>
        </motion.div>
      </header>
    </>
  );
}
