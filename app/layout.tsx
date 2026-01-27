import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ConditionalAuthProvider } from '@/components/auth/ConditionalAuthProvider';

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
      <body className={`${satoshi.variable} font-sans overflow-x-hidden`}>
        <ConditionalAuthProvider>{children}</ConditionalAuthProvider>
      </body>
    </html>
  );
}
