'use client';

import React, { useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { FONT_OPTIONS, buildGoogleFontsUrl } from '@/lib/fonts';

interface FontSelectorProps {
  label: string;
  value: string | undefined;
  onChange: (fontName: string) => void;
}

// Load Google Fonts into the builder page so previews render correctly
let fontsLoaded = false;
function ensureFontsLoaded() {
  if (fontsLoaded) return;
  fontsLoaded = true;

  const url = buildGoogleFontsUrl(FONT_OPTIONS.map((f) => f.name));
  if (!url) return;

  // Preconnect
  const preconnect1 = document.createElement('link');
  preconnect1.rel = 'preconnect';
  preconnect1.href = 'https://fonts.googleapis.com';
  document.head.appendChild(preconnect1);

  const preconnect2 = document.createElement('link');
  preconnect2.rel = 'preconnect';
  preconnect2.href = 'https://fonts.gstatic.com';
  preconnect2.crossOrigin = 'anonymous';
  document.head.appendChild(preconnect2);

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
}

export const FontSelector: React.FC<FontSelectorProps> = ({
  label,
  value,
  onChange,
}) => {
  useEffect(() => {
    ensureFontsLoaded();
  }, []);

  return (
    <div>
      <Label>{label}</Label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 p-2 border border-[#E2E8F0] rounded-xl focus:ring-[#5FC7CD]"
        style={value ? { fontFamily: `'${value}', sans-serif` } : undefined}
      >
        <option value="">System Default</option>
        {FONT_OPTIONS.map((font) => (
          <option
            key={font.name}
            value={font.name}
            style={{
              fontFamily: `${font.value}, ${font.category === 'serif' ? 'serif' : 'sans-serif'}`,
            }}
          >
            {font.name}
          </option>
        ))}
      </select>
    </div>
  );
};
