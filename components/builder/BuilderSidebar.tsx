'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAtomValue } from 'jotai';
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
  Globe,
  ChevronUp,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { currentProjectAtom } from '@/store/builder';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Home,
    isDynamic: false,
  },
  {
    name: 'Builder',
    href: '/builder',
    icon: Layers,
    isDynamic: true,
  },
  {
    name: 'Templates',
    href: '/templates',
    icon: FileText,
    isDynamic: false,
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: TrendingUp,
    isDynamic: false,
  },
  {
    name: 'Payments',
    href: '/dashboard/settings/payments',
    icon: CreditCard,
    isDynamic: false,
  },
  {
    name: 'Products',
    href: '/dashboard/products',
    icon: Package,
    isDynamic: false,
  },
  {
    name: 'Integrations',
    href: '/dashboard/integrations',
    icon: Zap,
    isDynamic: false,
  },
  {
    name: 'Subdomain',
    href: '/dashboard/settings/subdomain',
    icon: Globe,
    isDynamic: false,
  },
  {
    name: 'Affiliate',
    href: '/dashboard/affiliate',
    icon: Users,
    isDynamic: false,
  },
];

interface BuilderSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export function BuilderSidebar({
  isCollapsed = false,
  onToggle,
}: BuilderSidebarProps) {
  const pathname = usePathname();
  const currentProject = useAtomValue(currentProjectAtom);
  const { profile } = useAuth();

  const displayName = profile?.display_name || 'User';
  const planLabel = profile?.subscription_plan
    ? profile.subscription_plan.charAt(0).toUpperCase() +
      profile.subscription_plan.slice(1) +
      ' Plan'
    : 'Free Plan';
  const initial = displayName.charAt(0).toUpperCase();

  // Function to get the correct href for navigation items
  const getHref = (item: (typeof navigation)[0]) => {
    if (item.isDynamic && currentProject) {
      const projectId = currentProject.id;
      const isRealProject =
        projectId &&
        !projectId.startsWith('temp-project-') &&
        !projectId.startsWith('guest-project');

      if (isRealProject) {
        return `/projects/${projectId}/edit`;
      }
    }
    return item.href;
  };

  // Function to check if a navigation item is active
  const isActive = (item: (typeof navigation)[0]) => {
    const href = getHref(item);
    if (item.name === 'Builder') {
      return (
        pathname === '/builder' ||
        (pathname?.startsWith('/projects/') && pathname?.endsWith('/edit'))
      );
    }
    // Dashboard should only match exactly, not sub-routes
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname === href || pathname?.startsWith(href + '/');
  };

  return (
    <aside
      className={cn(
        'flex flex-col flex-shrink-0 h-screen border-r border-[#E2E8F0] bg-white transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo and Toggle */}
      <div className="flex h-16 items-center justify-between border-b border-[#E2E8F0] px-4">
        {!isCollapsed && (
          <Link href="/" className="flex items-center">
            <img
              src="/images/logo-nexova.webp"
              alt="Nexova"
              className="h-6 w-auto"
            />
          </Link>
        )}
        {isCollapsed && (
          <Link href="/" className="flex items-center justify-center w-full">
            <img
              src="/images/logo-nexova.webp"
              alt="Nexova"
              className="h-8 w-auto object-contain"
            />
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
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const itemIsActive = isActive(item);
          const href = getHref(item);

          return (
            <Link
              key={item.name}
              href={href}
              className={cn(
                'flex items-center rounded-xl transition-all group relative',
                isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5',
                itemIsActive
                  ? 'bg-[#5FC7CD] text-white'
                  : 'text-[#455263] hover:bg-[#F8FAFC]'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium truncate">
                  {item.name}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-[#455263] text-white text-sm rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 pointer-events-none">
                  <div className="font-medium">{item.name}</div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Expand button when collapsed */}
      {isCollapsed && onToggle && (
        <div className="border-t border-[#E2E8F0] p-2">
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

      {/* User Profile Section */}
      {!isCollapsed && (
        <div className="border-t border-[#E2E8F0] p-4">
          <Link
            href="/account"
            className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium text-[#455263] hover:bg-[#F8FAFC] transition-all"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFCE33] text-[#455263] font-bold text-sm flex-shrink-0">
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[#455263] truncate">
                {displayName}
              </div>
              <div className="text-xs text-[#969696]">{planLabel}</div>
            </div>
            <ChevronUp className="h-4 w-4 text-[#969696] flex-shrink-0" />
          </Link>
        </div>
      )}

      {/* Collapsed user avatar */}
      {isCollapsed && (
        <div className="border-t border-[#E2E8F0] p-2 flex justify-center">
          <Link
            href="/account"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFCE33] text-[#455263] font-bold text-sm"
            title={displayName}
          >
            {initial}
          </Link>
        </div>
      )}
    </aside>
  );
}
