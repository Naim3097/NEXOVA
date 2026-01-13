import { AuthLayoutWrapper } from '@/components/auth/AuthLayoutWrapper';
import { ReactNode } from 'react';

export default function TemplatesLayout({ children }: { children: ReactNode }) {
  return <AuthLayoutWrapper>{children}</AuthLayoutWrapper>;
}
