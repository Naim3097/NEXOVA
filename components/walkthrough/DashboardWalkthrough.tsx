'use client';

import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import {
  Sparkles,
  FilePlus,
  Palette,
  FolderOpen,
  Package,
  TrendingUp,
  CreditCard,
  Link,
  Globe,
  Rocket,
} from 'lucide-react';

const WALKTHROUGH_KEY = 'nexova_dashboard_walkthrough_completed';

const steps: Step[] = [
  {
    target: 'body',
    content: (
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <Sparkles className="w-8 h-8 text-[#5FC7CD]" />
        </div>
        <h3 className="text-xl font-bold text-[#455263] mb-2">
          Welcome to Nexova!
        </h3>
        <p className="text-[#969696]">
          Let us show you how to use this platform to build high-converting
          sales pages.
        </p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="create-project"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2 flex items-center gap-2">
          <FilePlus className="w-5 h-5 text-[#5FC7CD]" />
          Create New Project
        </h4>
        <p className="text-sm text-[#969696]">
          Click here to start building a new sales page. You can choose from
          templates or start from scratch.
        </p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="templates"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2 flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#5FC7CD]" />
          Browse Templates
        </h4>
        <p className="text-sm text-[#969696]">
          We have many professional templates for various industries -
          photography, automotive, food business and more!
        </p>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="projects-list"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2 flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-[#5FC7CD]" />
          Your Projects
        </h4>
        <p className="text-sm text-[#969696]">
          All your sales pages will be displayed here. Click to edit, or use the
          icons to preview and publish.
        </p>
      </div>
    ),
    placement: 'top',
  },
  {
    target: '[data-tour="sidebar-products"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2 flex items-center gap-2">
          <Package className="w-5 h-5 text-[#5FC7CD]" />
          Manage Products
        </h4>
        <p className="text-sm text-[#969696]">
          Add your products here. Set prices, variations (size/color), and
          bundle pricing options.
        </p>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="sidebar-analytics"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#5FC7CD]" />
          Analytics & Performance
        </h4>
        <p className="text-sm text-[#969696]">
          Monitor page views, clicks, and conversion rates for each of your
          sales pages.
        </p>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="sidebar-transactions"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#5FC7CD]" />
          Payment Integration
        </h4>
        <p className="text-sm text-[#969696]">
          Connect your LeanX account here to receive payments from customers
          directly on your sales pages.
        </p>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="sidebar-integrations"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2 flex items-center gap-2">
          <Link className="w-5 h-5 text-[#5FC7CD]" />
          Integrations
        </h4>
        <p className="text-sm text-[#969696]">
          Connect Google Analytics, Google Sheets, Google Calendar, and Facebook
          Pixel for tracking and automation.
        </p>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="sidebar-settings"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2 flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#5FC7CD]" />
          Subdomain & Domain
        </h4>
        <p className="text-sm text-[#969696]">
          Claim your unique subdomain (yourname.nexova.my) or connect your own
          custom domain here.
        </p>
      </div>
    ),
    placement: 'right',
  },
  {
    target: 'body',
    content: (
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <Rocket className="w-8 h-8 text-[#5FC7CD]" />
        </div>
        <h3 className="text-xl font-bold text-[#455263] mb-2">
          You&apos;re All Set!
        </h3>
        <p className="text-[#969696] mb-3">
          Now, let&apos;s create your first sales page. Click &quot;Create New
          Site&quot; or browse templates to get started.
        </p>
        <p className="text-xs text-[#969696]">
          Tip: You can replay this tutorial anytime from Settings.
        </p>
      </div>
    ),
    placement: 'center',
  },
];

export default function DashboardWalkthrough() {
  const [run, setRun] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if user has completed walkthrough
    const completed = localStorage.getItem(WALKTHROUGH_KEY);
    console.log('[Walkthrough] Dashboard check:', { completed });

    if (!completed) {
      // Delay to ensure DOM elements are rendered
      const timer = setTimeout(() => {
        console.log('[Walkthrough] Starting dashboard tour...');
        setRun(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem(WALKTHROUGH_KEY, 'true');
    }
  };

  if (!mounted) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleCallback}
      scrollToFirstStep
      disableOverlayClose
      spotlightClicks
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip',
      }}
      styles={{
        options: {
          primaryColor: '#5FC7CD',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 12,
          padding: 20,
        },
        tooltipContent: {
          padding: '10px 0',
        },
        buttonNext: {
          backgroundColor: '#5FC7CD',
          borderRadius: 8,
          padding: '10px 20px',
          fontSize: 14,
          fontWeight: 600,
        },
        buttonBack: {
          color: '#969696',
          marginRight: 10,
        },
        buttonSkip: {
          color: '#969696',
          fontSize: 13,
        },
        spotlight: {
          borderRadius: 12,
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
      floaterProps={{
        disableAnimation: true,
      }}
    />
  );
}

// Export function to manually trigger walkthrough
export function resetDashboardWalkthrough() {
  localStorage.removeItem(WALKTHROUGH_KEY);
  window.location.reload();
}
