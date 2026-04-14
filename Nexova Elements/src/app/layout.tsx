import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const satoshi = localFont({
  src: [
    { path: "../../public/fonts/satoshi/Satoshi-Light.otf",   weight: "300", style: "normal" },
    { path: "../../public/fonts/satoshi/Satoshi-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/satoshi/Satoshi-Medium.otf",  weight: "500", style: "normal" },
    { path: "../../public/fonts/satoshi/Satoshi-Bold.otf",    weight: "700", style: "normal" },
    { path: "../../public/fonts/satoshi/Satoshi-Black.otf",   weight: "900", style: "normal" },
  ],
  variable: "--font-satoshi",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexova Elements | Design Gallery",
  description: "A curated collection of high-end website animation examples and UI elements by Nexova.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${satoshi.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
