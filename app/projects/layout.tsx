import { AuthLayoutWrapper } from '@/components/auth/AuthLayoutWrapper';
import { ReactNode } from 'react';

export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return <AuthLayoutWrapper>{children}</AuthLayoutWrapper>;
}
