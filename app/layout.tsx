import type { Metadata } from 'next';
import localFont from 'next/font/local';
// import Script from 'next/script';
import './globals.css';
import { ConditionalAuthProvider } from '@/components/auth/ConditionalAuthProvider';
// import { SpeedInsights } from '@vercel/speed-insights/next';

// Temporarily disabled for debugging
// const GTM_ID = 'GTM-5GQQ6L8N';

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
});

export const metadata: Metadata = {
  title: 'Nexova - Build Landing Pages',
  description: 'Create high-converting landing pages in minutes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>{/* GTM temporarily disabled for debugging */}</head>
      <body className={`${satoshi.variable} font-sans overflow-x-hidden`}>
        <ConditionalAuthProvider>{children}</ConditionalAuthProvider>
        {/* <SpeedInsights /> */}
      </body>
    </html>
  );
}
