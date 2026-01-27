'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-24 items-center justify-between max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image 
            src="/assets/landing/logo-nexova.png" 
            alt="Nexova" 
            width={120} 
            height={40} 
            className="h-8 w-auto"
          />
        </Link>

        {/* Centered Navigation */}
        <div className="hidden md:flex items-center justify-center flex-1">
          <nav className="flex gap-8 bg-gray-100/80 rounded-full px-8 py-3 backdrop-blur-sm">
            <Link href="#pipeline" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              How It Works
            </Link>
            <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="#business-types" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Solutions
            </Link>
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <Link href="/login" className="text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link href="/builder">
            <Button className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] hover:opacity-90 transition-opacity text-white rounded-full px-6 shadow-md border-0">
              Launch Builder
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
