'use client';

import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { sortedElementsAtom, currentProjectAtom } from '@/store/builder';
import { generateHTML } from '@/lib/publishing/html-generator';
import type { Project, Element } from '@/types';
import Link from 'next/link';

export default function GuestPreviewPage() {
  const elements = useAtomValue(sortedElementsAtom);
  const currentProject = useAtomValue(currentProjectAtom);
  const [html, setHtml] = useState('');

  useEffect(() => {
    if (currentProject && elements) {
      // Generate HTML from current elements
      const generatedHTML = generateHTML(
        currentProject as Project,
        elements as Element[]
      );
      setHtml(generatedHTML);
    }
  }, [currentProject, elements]);

  if (!html) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5FC7CD] mx-auto mb-4"></div>
          <p className="text-[#969696]">Generating preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Preview header with close button */}
      <div className="fixed top-0 left-0 right-0 bg-[#455263] text-white px-4 py-3 flex items-center justify-between z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-[#5FC7CD]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span className="font-semibold">Preview Mode</span>
          </div>
          <span className="text-[#969696] text-sm hidden md:inline">
            Guest Project
          </span>
        </div>
        <Link
          href="/builder"
          className="flex items-center gap-2 bg-white text-[#455263] px-4 py-2 rounded-xl hover:bg-[#F8FAFC] transition-colors text-sm font-medium"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span className="hidden sm:inline">Close Preview</span>
          <span className="sm:hidden">Close</span>
        </Link>
      </div>

      {/* Preview content with top padding to account for fixed header */}
      <div className="pt-14">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
