'use client';

import { useState } from 'react';
import { BuilderSidebar } from '@/components/builder/BuilderSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <BuilderSidebar
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
      <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">{children}</main>
    </div>
  );
}
