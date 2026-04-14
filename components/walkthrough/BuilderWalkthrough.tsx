'use client';

import { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import {
  Wrench,
  Puzzle,
  Palette,
  Settings,
  Smartphone,
  Eye,
  Rocket,
  Zap,
} from 'lucide-react';

const WALKTHROUGH_KEY = 'nexova_builder_walkthrough_completed';

const steps: Step[] = [
  {
    target: 'body',
    content: (
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <Wrench className="w-8 h-8 text-[#5FC7CD]" />
        </div>
        <h3 className="text-xl font-bold text-[#455263] mb-2">
          Welcome to the Page Builder!
        </h3>
        <p className="text-[#969696]">
          Here you can build and customize your sales page with your own
          creativity.
        </p>
      </div>
    ),
    placement: 'center',
    disableBeacon: true,
  },
  {
    target: '[data-tour="elements-panel"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2 flex items-center gap-2">
          <Puzzle className="w-5 h-5 text-[#5FC7CD]" />
          Elements Panel
        </h4>
        <p className="text-sm text-[#969696]">
          Choose elements from here to add to your page. Just click on the
          element you want.
        </p>
        <ul className="text-xs text-[#969696] mt-2 space-y-1">
          <li>
            • <b>Hero</b> - Main header with headline
          </li>
          <li>
            • <b>Features</b> - Product feature list
          </li>
          <li>
            • <b>Testimonials</b> - Customer reviews
          </li>
          <li>
            • <b>Pricing</b> - Price table
          </li>
          <li>
            • <b>Form</b> - Order/lead form
          </li>
        </ul>
      </div>
    ),
    placement: 'right',
  },
  {
    target: '[data-tour="canvas"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2 flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#5FC7CD]" />
          Canvas (Work Area)
        </h4>
        <p className="text-sm text-[#969696]">
          This is the live preview of your sales page. Click on any element to
          select and edit it.
        </p>
        <p className="text-xs text-[#969696] mt-2">
          Tip: Drag elements to rearrange their order.
        </p>
      </div>
    ),
    placement: 'left',
  },
  {
    target: '[data-tour="properties-panel"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2 flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#5FC7CD]" />
          Properties Panel
        </h4>
        <p className="text-sm text-[#969696]">
          When an element is selected, this panel will appear. Here you can:
        </p>
        <ul className="text-xs text-[#969696] mt-2 space-y-1">
          <li>• Edit text and content</li>
          <li>• Change colors and fonts</li>
          <li>• Upload images</li>
          <li>• Set button links</li>
        </ul>
      </div>
    ),
    placement: 'left',
  },
  {
    target: '[data-tour="device-preview"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-[#5FC7CD]" />
          Device Preview
        </h4>
        <p className="text-sm text-[#969696]">
          Switch between Desktop, Tablet, and Mobile to make sure your page
          looks great on all devices.
        </p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="preview-button"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2 flex items-center gap-2">
          <Eye className="w-5 h-5 text-[#5FC7CD]" />
          Preview
        </h4>
        <p className="text-sm text-[#969696]">
          Click to preview your page in a new tab. Test all buttons and forms
          before publishing.
        </p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="publish-button"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2 flex items-center gap-2">
          <Rocket className="w-5 h-5 text-[#5FC7CD]" />
          Publish
        </h4>
        <p className="text-sm text-[#969696]">
          When ready, click Publish to go live! Your page will get a URL that
          you can share with customers.
        </p>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: '[data-tour="more-options"]',
    content: (
      <div>
        <h4 className="font-semibold text-[#455263] mb-2 flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#5FC7CD]" />
          More Options
        </h4>
        <p className="text-sm text-[#969696]">
          Access additional settings here:
        </p>
        <ul className="text-xs text-[#969696] mt-2 space-y-1">
          <li>
            • <b>SEO Settings</b> - Title, description for Google
          </li>
          <li>
            • <b>Tracking Pixels</b> - Facebook Pixel, GA4
          </li>
          <li>
            • <b>Project Settings</b> - Import/export templates
          </li>
        </ul>
      </div>
    ),
    placement: 'bottom',
  },
  {
    target: 'body',
    content: (
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <Wrench className="w-8 h-8 text-[#5FC7CD]" />
        </div>
        <h3 className="text-xl font-bold text-[#455263] mb-2">
          Let&apos;s Start Building!
        </h3>
        <p className="text-[#969696] mb-3">
          Choose an element from the left panel to start building your sales
          page. Click Save to save your changes.
        </p>
        <p className="text-xs text-[#969696]">
          Tip: Use Ctrl/Cmd + Z to undo if you make a mistake.
        </p>
      </div>
    ),
    placement: 'center',
  },
];

interface BuilderWalkthroughProps {
  projectId: string;
}

export default function BuilderWalkthrough({
  projectId,
}: BuilderWalkthroughProps) {
  const [run, setRun] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if user has completed builder walkthrough
    const completed = localStorage.getItem(WALKTHROUGH_KEY);
    if (!completed) {
      // Delay to ensure DOM elements are rendered
      const timer = setTimeout(() => {
        setRun(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [projectId]);

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
export function resetBuilderWalkthrough() {
  localStorage.removeItem(WALKTHROUGH_KEY);
  window.location.reload();
}
