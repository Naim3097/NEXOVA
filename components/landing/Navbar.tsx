'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { X, Menu, ChevronDown } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Templates', href: '/marketplace' },
  { label: 'Elements', href: '/elements' },
  { label: 'Lean.x', href: '/leanx' },
  { label: 'Blog', href: '/blog' },
  { label: 'Pricing', href: '/pricing' },
];

const MORE_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Changelog', href: '/changelog' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-[200] w-full bg-white/80 backdrop-blur-md border-b border-gray-100/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-20 items-center justify-between max-w-7xl">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center flex-shrink-0"
            aria-label="Nexova home"
          >
            <Image
              src="/assets/landing/logo-nexova.png"
              alt="Nexova"
              width={120}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>

          {/* Centered pill nav — desktop */}
          <div className="hidden md:flex items-center justify-center gap-6 flex-1">
            <nav
              aria-label="Main navigation"
              className="flex gap-8 bg-gray-100/80 rounded-full px-8 py-3 backdrop-blur-sm"
            >
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* More dropdown — outside the pill so backdrop-filter doesn't clip it */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                More{' '}
                <ChevronDown
                  size={14}
                  className="transition-transform duration-200 group-hover:rotate-180"
                />
              </button>
              {/* pt-3 bridges the gap between button and card without breaking hover */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 hidden group-hover:block z-[300]">
                <div className="w-40 bg-white rounded-2xl shadow-lg border border-gray-100 py-2">
                  {MORE_LINKS.map(({ label, href }) => (
                    <Link
                      key={href}
                      href={href}
                      className="block px-4 py-2.5 text-sm text-gray-600 hover:text-[#5BC0BE] hover:bg-gray-50 transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right — desktop */}
          <div className="hidden md:flex items-center gap-6 flex-shrink-0">
            <Link
              href="/signup"
              className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
            >
              Sign Up
            </Link>
            <Link href="/builder">
              <Button className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] hover:opacity-90 transition-opacity text-white rounded-full px-6 shadow-md border-0">
                Launch Builder
              </Button>
            </Link>
          </div>

          {/* Hamburger — mobile */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-white/95 backdrop-blur-md flex flex-col pt-20 px-6 md:hidden">
          <nav
            aria-label="Mobile navigation"
            className="flex flex-col gap-6 mt-8"
          >
            {[...NAV_LINKS, ...MORE_LINKS].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="text-lg font-medium text-gray-800 hover:text-gray-900 border-b border-gray-100 pb-4 transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-4 mt-10">
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="text-center text-sm font-medium text-gray-700 border border-gray-200 rounded-full py-3 hover:bg-gray-50 transition-colors"
            >
              Sign Up
            </Link>
            <Link href="/builder" onClick={() => setMobileOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] hover:opacity-90 transition-opacity text-white rounded-full py-3 shadow-md border-0">
                Launch Builder
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
