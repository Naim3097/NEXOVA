import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4 font-sans">
      {/* Gradient number */}
      <p className="text-[120px] sm:text-[180px] font-black leading-none bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] bg-clip-text text-transparent select-none">
        404
      </p>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-3">
        Page not found
      </h1>
      <p className="text-gray-500 max-w-md mb-10">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back on track.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/">
          <Button className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] hover:opacity-90 text-white rounded-full px-8 py-3 shadow-md border-0">
            Go Home
          </Button>
        </Link>
        <Link href="/templates">
          <Button variant="outline" className="rounded-full px-8 py-3">
            Browse Templates
          </Button>
        </Link>
      </div>

      {/* Helpful links */}
      <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl w-full">
        {[
          { label: 'Templates', href: '/templates' },
          { label: 'Elements', href: '/elements' },
          { label: 'Lean.x', href: '/leanx' },
          { label: 'Contact', href: '/contact' },
        ].map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            className="text-sm text-gray-500 hover:text-[#5BC0BE] transition-colors border border-gray-100 rounded-xl py-3 hover:border-[#5BC0BE]/30"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
