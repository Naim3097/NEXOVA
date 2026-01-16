'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutTemplate,
  Settings,
  TrendingUp,
  CreditCard,
  Package,
  Zap,
  FileText,
  User,
  ChevronLeft,
  Home,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    description: 'Overview & projects',
  },
  {
    name: 'Builder',
    href: '/builder',
    icon: Layers,
    description: 'Visual page builder',
  },
  {
    name: 'Templates',
    href: '/templates',
    icon: FileText,
    description: 'Pre-built designs',
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: TrendingUp,
    description: 'Track performance',
  },
  {
    name: 'Payments',
    href: '/dashboard/settings/payments',
    icon: CreditCard,
    description: 'Payment settings',
  },
  {
    name: 'Products',
    href: '/dashboard/products',
    icon: Package,
    description: 'Manage inventory',
  },
  {
    name: 'Integrations',
    href: '/dashboard/integrations',
    icon: Zap,
    description: 'Connect tools',
  },
];

interface BuilderSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function BuilderSidebar({ isCollapsed = false, onToggle }: BuilderSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn(
      "flex-shrink-0 h-screen border-r bg-white transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      {/* Logo and Toggle */}
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">X.IDE</span>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/" className="flex items-center justify-center w-full">
            <span className="text-xl font-bold">X</span>
          </Link>
        )}
        {onToggle && !isCollapsed && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0"
            title="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center rounded-lg transition-colors group relative',
                isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5',
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.name}</div>
                  {!isActive && (
                    <div className="text-xs text-gray-500 truncate">{item.description}</div>
                  )}
                </div>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-300">{item.description}</div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Expand button when collapsed */}
      {isCollapsed && onToggle && (
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="w-full h-10 p-0"
            title="Expand sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </Button>
        </div>
      )}

      {/* User Section */}
      {!isCollapsed && (
        <div className="border-t p-4">
          <Link
            href="/account"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">Account</div>
              <div className="text-xs text-gray-500">Manage profile</div>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
}
