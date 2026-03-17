import { Metadata } from 'next';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Changelog — Nexova',
  description:
    "See what's new in Nexova — product updates, new templates, new elements, and feature releases.",
  alternates: { canonical: 'https://nexova.co/changelog' },
  openGraph: {
    title: 'Changelog — Nexova',
    description: 'Product updates, new templates, and feature releases.',
    url: 'https://nexova.co/changelog',
    type: 'website',
  },
};

const ENTRIES = [
  {
    version: 'v1.4.0',
    date: '2025-12-10',
    label: 'major',
    title: 'Unified marketing site & new pages',
    changes: [
      'Launched public Templates marketplace (/templates)',
      'Launched Elements library pages (/elements, /elements/layouts)',
      'Launched Lean.x payment gateway page (/leanx)',
      'New About, Contact, Blog, and Changelog pages',
      'Unified Navbar with real route links and mobile hamburger menu',
      'New 4-column Footer with complete site map',
    ],
  },
  {
    version: 'v1.3.2',
    date: '2025-11-22',
    label: 'minor',
    title: 'Builder improvements & performance',
    changes: [
      '15% faster builder load time via code splitting',
      'Fixed RevealOnScroll jitter on Safari iOS',
      'Added 8 new animation presets to the element picker',
      'Improved template preview thumbnails resolution',
    ],
  },
  {
    version: 'v1.3.0',
    date: '2025-11-01',
    label: 'major',
    title: 'Nexova Elements launch',
    changes: [
      '100+ UI animation presets added to the builder',
      '29 pre-built layout sections across 14 categories',
      'Animations free to preview at /elements',
      'Layouts free to preview at /elements/layouts',
    ],
  },
  {
    version: 'v1.2.1',
    date: '2025-10-15',
    label: 'patch',
    title: 'Lean.x payment fixes',
    changes: [
      'Fixed FPX timeout handling on slow connections',
      'Improved payment webhook retry logic',
      'Added GrabPay and ShopeePay as supported methods',
    ],
  },
  {
    version: 'v1.2.0',
    date: '2025-10-01',
    label: 'major',
    title: 'Lean.x payments integration',
    changes: [
      'Lean.x checkout flow integrated into X.IDE builder',
      'One-click payment page generation from any template',
      'Support for FPX, Visa/Mastercard, and e-wallets',
      'Transaction dashboard in merchant account area',
    ],
  },
  {
    version: 'v1.1.0',
    date: '2025-09-01',
    label: 'major',
    title: 'Templates marketplace — Phase 1',
    changes: [
      'Launched with 40 initial templates across 8 industries',
      'Template preview mode (no sign-in required)',
      'One-click "Use this template" open in builder',
      'Basic category filtering UI',
    ],
  },
];

const LABEL_STYLES: Record<string, string> = {
  major: 'bg-[#5BC0BE]/10 text-[#5BC0BE]',
  minor: 'bg-purple-50 text-purple-600',
  patch: 'bg-gray-100 text-gray-500',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function ChangelogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://nexova.co',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Changelog',
                item: 'https://nexova.co/changelog',
              },
            ],
          }),
        }}
      />

      {/* Hero */}
      <section className="bg-white pt-20 pb-10 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <RevealOnScroll>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#5FC7CD] mb-4">
              Changelog
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              What&apos;s{' '}
              <span className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] bg-clip-text text-transparent">
                new
              </span>
            </h1>
            <p className="text-gray-500 text-lg">
              Every release, every improvement — all in one place.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="relative">
            {/* Vertical line */}
            <div
              aria-hidden
              className="absolute left-[17px] top-2 bottom-2 w-px bg-gradient-to-b from-[#5BC0BE]/30 via-[#7C74EA]/20 to-transparent"
            />

            <ol className="space-y-12">
              {ENTRIES.map((entry, i) => (
                <RevealOnScroll key={entry.version} delay={i * 60}>
                  <li className="relative pl-10">
                    {/* Dot */}
                    <span
                      aria-hidden
                      className="absolute left-0 top-1.5 w-[18px] h-[18px] rounded-full border-2 border-[#5BC0BE] bg-white flex-shrink-0"
                    />

                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="text-sm font-black text-gray-900">
                        {entry.version}
                      </span>
                      <span
                        className={`text-xs font-semibold rounded-full px-2.5 py-0.5 ${
                          LABEL_STYLES[entry.label] ||
                          'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {entry.label}
                      </span>
                      <time className="text-xs text-gray-400">
                        {formatDate(entry.date)}
                      </time>
                    </div>

                    <h2 className="text-base font-semibold text-gray-900 mb-3">
                      {entry.title}
                    </h2>

                    <ul className="space-y-2">
                      {entry.changes.map((change) => (
                        <li
                          key={change}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <span className="text-[#5BC0BE] mt-0.5 flex-shrink-0">
                            •
                          </span>
                          {change}
                        </li>
                      ))}
                    </ul>
                  </li>
                </RevealOnScroll>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
