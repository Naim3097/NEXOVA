'use client';

import Link from 'next/link';
import Image from 'next/image';

const PRODUCT_LINKS = [
  { label: 'X.IDE Builder', href: '/builder' },
  { label: 'Templates', href: '/marketplace' },
  { label: 'Elements', href: '/elements' },
  { label: 'Pricing', href: '/pricing' },
];

const RESOURCES_LINKS = [
  { label: 'UI Elements', href: '/elements' },
  { label: 'Blog', href: '/blog' },
  { label: 'Changelog', href: '/changelog' },
];

const COMPANY_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

const LEANX_LINKS = [
  { label: 'Lean.x Payments', href: '/leanx' },
  { label: 'How It Works', href: '/leanx#how-it-works' },
  { label: 'Pricing', href: '/pricing' },
];

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" aria-label="Nexova home">
              <Image
                src="/assets/landing/logo-nexova.png"
                alt="Nexova"
                width={120}
                height={40}
                className="h-8 w-auto mb-4"
              />
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Build, publish, and grow — with X.IDE, beautiful templates, and
              integrated payments.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-5">
              Product
            </h3>
            <ul className="space-y-3">
              {PRODUCT_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-5">
              Resources
            </h3>
            <ul className="space-y-3">
              {RESOURCES_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-5">
              Company
            </h3>
            <ul className="space-y-3">
              {COMPANY_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Lean.x payment strip */}
        <div className="border-t border-gray-200 pt-10 mb-10">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Payments by
          </p>
          <div className="flex flex-wrap gap-6">
            {LEANX_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © 2026 Nexova. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-gray-700 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-gray-700 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/contact"
              className="text-gray-400 hover:text-gray-700 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
