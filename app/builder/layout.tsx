import { AuthLayoutWrapper } from '@/components/auth/AuthLayoutWrapper';
import { ReactNode } from 'react';

export default function BuilderLayout({ children }: { children: ReactNode }) {
  return <AuthLayoutWrapper>{children}</AuthLayoutWrapper>;
}
