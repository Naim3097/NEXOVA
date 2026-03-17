import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import './globals.css';
import { ConditionalAuthProvider } from '@/components/auth/ConditionalAuthProvider';
import { SpeedInsights } from '@vercel/speed-insights/next';

const GTM_ID = 'GTM-5GQQ6L8N';

const satoshi = localFont({
  src: [
    {
      path: '../public/fonts/satoshi/Satoshi-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/satoshi/Satoshi-Black.otf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-satoshi',
  display: 'swap',
});

const APP_URL = 'https://nexova.co';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Nexova — Build, Publish & Grow',
    template: '%s | Nexova',
  },
  description:
    'Nexova is the all-in-one platform to build landing pages with X.IDE, browse 70+ pro templates, use 100+ UI elements, and accept payments with Lean.x.',
  keywords: [
    'page builder',
    'landing page',
    'website builder Malaysia',
    'templates',
    'UI elements',
    'Lean.x payments',
    'X.IDE',
    'Nexova',
  ],
  authors: [{ name: 'Nexova', url: APP_URL }],
  creator: 'Nexova',
  openGraph: {
    type: 'website',
    locale: 'en_MY',
    url: APP_URL,
    siteName: 'Nexova',
    title: 'Nexova — Build, Publish & Grow',
    description:
      'Build landing pages with X.IDE, browse 70+ templates, use 100+ UI elements, and accept Malaysian payments with Lean.x.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexova — Build, Publish & Grow',
    description:
      'The all-in-one platform for Malaysian businesses to build and grow online.',
    creator: '@nexovaco',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  },
  alternates: {
    canonical: APP_URL,
  },
};

const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Nexova',
  url: APP_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${APP_URL}/marketplace?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Nexova',
  url: APP_URL,
  logo: `${APP_URL}/assets/landing/logo-nexova.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hello@nexova.co',
    contactType: 'customer service',
  },
  sameAs: [],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_SCHEMA) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ORGANIZATION_SCHEMA),
          }}
        />
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      </head>
      <body className={`${satoshi.variable} font-sans overflow-x-hidden`}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <ConditionalAuthProvider>{children}</ConditionalAuthProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
