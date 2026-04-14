'use client';

import { useEffect, useRef, useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface Testimonial {
  name: string;
  role: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Aisyah Rahman',
    role: 'Founder',
    quote:
      'Nexova replaced three tools for me — page builder, inventory tracker, and payment gateway. Launched my kuih raya store in one weekend.',
  },
  {
    name: 'Daniel Lim',
    role: 'Marketer',
    quote:
      'The drag-and-drop builder is incredibly intuitive. Our team ships landing pages 3x faster now without touching code.',
  },
  {
    name: 'Farah Zain',
    role: 'E-commerce Seller',
    quote:
      'Bundle pricing and live inventory updates are game-changers. My conversion rate jumped 40% in the first month.',
  },
  {
    name: 'Hafiz Ismail',
    role: 'Designer',
    quote:
      'I use Nexova for all my client projects. The templates are beautiful, and customization is seamless.',
  },
  {
    name: 'Siti Nurhaliza',
    role: 'CEO',
    quote:
      'From product listing to checkout — everything in one platform. Nexova just works.',
  },
  {
    name: 'Ryan Tan',
    role: 'Growth Hacker',
    quote:
      'We A/B tested five builders. Nexova had the fastest page-load times and the cleanest checkout experience.',
  },
  {
    name: 'Nurul Amin',
    role: 'Business Owner',
    quote:
      'I have zero tech skills and I built a full product page with payments in under an hour. Truly all-in-one.',
  },
  {
    name: 'Wei Jie Ong',
    role: 'Product Manager',
    quote:
      'The inventory management alone is worth it. Real-time stock sync across all my landing pages saved us from overselling.',
  },
];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function QuoteCard({ t, width }: { t: Testimonial; width: string }) {
  return (
    <div
      className="flex-shrink-0 rounded-3xl p-[2px] overflow-hidden"
      style={{
        width,
        height: '13rem',
        background: 'linear-gradient(135deg, #5BC0BE, #7C74EA)',
      }}
    >
      <div className="w-full h-full rounded-[22px] bg-white p-5 flex flex-col justify-between">
        <p className="text-sm text-[#455263] leading-relaxed line-clamp-4">
          &ldquo;{t.quote}&rdquo;
        </p>
        <div className="mt-3">
          <p className="text-sm font-semibold text-[#455263] truncate">
            {t.name}
          </p>
          <p className="text-xs text-[#969696] truncate">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Card widths                                                        */
/* ------------------------------------------------------------------ */

const cardWidths = [
  '16rem',
  '18rem',
  '20rem',
  '17rem',
  '19rem',
  '16.5rem',
  '18.5rem',
  '17.5rem',
];

/* ------------------------------------------------------------------ */
/*  Build row items                                                    */
/* ------------------------------------------------------------------ */

function buildRowItems(
  testimonialSlice: Testimonial[],
  widthOffset: number,
  keyPrefix: string
) {
  return testimonialSlice.map((t, i) => (
    <QuoteCard
      key={`${keyPrefix}-q-${i}`}
      t={t}
      width={cardWidths[(i + widthOffset) % cardWidths.length]}
    />
  ));
}

/* ------------------------------------------------------------------ */
/*  Hook: useInView                                                    */
/* ------------------------------------------------------------------ */

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function Testimonials() {
  const heading = useInView(0.2);
  const grid = useInView(0.1);

  const row1Items = buildRowItems(testimonials.slice(0, 4), 0, 'r1');
  const row2Items = buildRowItems(testimonials.slice(4, 8), 4, 'r2');

  return (
    <section
      className="relative overflow-hidden py-24"
      style={{ backgroundColor: '#FBF9F6' }}
    >
      {/* Marquee keyframes + reduced-motion */}
      <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        .marquee-row-left {
          animation: marquee-left 45s linear infinite;
        }
        .marquee-row-right {
          animation: marquee-right 50s linear infinite;
        }
        .marquee-grid:hover .marquee-row-left,
        .marquee-grid:hover .marquee-row-right {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-row-left,
          .marquee-row-right {
            animation-play-state: paused !important;
          }
        }
      `}</style>

      {/* Heading */}
      <div
        ref={heading.ref}
        className={`max-w-[42rem] mx-auto text-center px-6 mb-16 transition-all duration-[800ms] ease-out ${
          heading.visible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-[60px]'
        }`}
      >
        <h2 className="text-4xl md:text-5xl font-bold text-[#455263] mb-4">
          Loved by{' '}
          <span className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] bg-clip-text text-transparent">
            builders
          </span>
        </h2>
        <p className="text-lg text-[#969696] leading-relaxed">
          See why entrepreneurs and teams choose Nexova to build, sell, and
          scale — all from one platform.
        </p>
      </div>

      {/* Marquee Grid */}
      <div
        ref={grid.ref}
        className={`marquee-grid relative transition-opacity duration-[800ms] delay-200 ${
          grid.visible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Left fade mask */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, #FBF9F6, transparent)',
          }}
        />
        {/* Right fade mask */}
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to left, #FBF9F6, transparent)',
          }}
        />

        {/* Row 1 — scrolls left */}
        <div className="flex overflow-hidden mb-4">
          <div className="marquee-row-left flex gap-4 flex-shrink-0 pr-4">
            {row1Items}
          </div>
          <div
            className="marquee-row-left flex gap-4 flex-shrink-0 pr-4"
            aria-hidden="true"
          >
            {row1Items}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="flex overflow-hidden">
          <div className="marquee-row-right flex gap-4 flex-shrink-0 pr-4">
            {row2Items}
          </div>
          <div
            className="marquee-row-right flex gap-4 flex-shrink-0 pr-4"
            aria-hidden="true"
          >
            {row2Items}
          </div>
        </div>
      </div>

      {/* SVG Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 30C240 60 480 0 720 30C960 60 1200 0 1440 30V60H0V30Z"
            fill="#F8F9FB"
          />
        </svg>
      </div>
    </section>
  );
}
