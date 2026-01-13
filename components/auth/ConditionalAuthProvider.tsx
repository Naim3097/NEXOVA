'use client';

import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

const PUBLIC_ROUTES = ['/p/', '/s/', '/payment/success'];

export function ConditionalAuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Check if current route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route));

  // Skip AuthProvider for public routes
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Use AuthProvider for all other routes
  return <AuthProvider>{children}</AuthProvider>;
}
