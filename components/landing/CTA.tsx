'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CTA() {
  return (
    <section className="py-20 sm:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join the community of professionals building with X.IDE.
          </p>

          <Link href="/builder">
            <Button size="lg" className="bg-black hover:bg-gray-800 text-white text-base px-8 h-12">
              Launch Builder
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
