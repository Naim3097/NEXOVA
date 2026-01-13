import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ConditionalAuthProvider } from '@/components/auth/ConditionalAuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Product Page Builder - X.IDE v2',
  description: 'Create high-converting landing pages in minutes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConditionalAuthProvider>{children}</ConditionalAuthProvider>
      </body>
    </html>
  );
}
