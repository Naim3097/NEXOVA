/**
 * Curated Google Fonts list and utilities for the page builder.
 */

export interface FontOption {
  name: string;
  value: string; // CSS font-family value
  category: 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'monospace';
}

export const FONT_OPTIONS: FontOption[] = [
  { name: 'Inter', value: "'Inter'", category: 'sans-serif' },
  { name: 'Poppins', value: "'Poppins'", category: 'sans-serif' },
  { name: 'Montserrat', value: "'Montserrat'", category: 'sans-serif' },
  { name: 'Open Sans', value: "'Open Sans'", category: 'sans-serif' },
  { name: 'Lato', value: "'Lato'", category: 'sans-serif' },
  { name: 'Roboto', value: "'Roboto'", category: 'sans-serif' },
  { name: 'Raleway', value: "'Raleway'", category: 'sans-serif' },
  { name: 'Nunito', value: "'Nunito'", category: 'sans-serif' },
  { name: 'Space Grotesk', value: "'Space Grotesk'", category: 'sans-serif' },
  { name: 'Playfair Display', value: "'Playfair Display'", category: 'serif' },
  { name: 'Merriweather', value: "'Merriweather'", category: 'serif' },
  { name: 'Lora', value: "'Lora'", category: 'serif' },
  { name: 'PT Serif', value: "'PT Serif'", category: 'serif' },
  { name: 'Oswald', value: "'Oswald'", category: 'display' },
  { name: 'Bebas Neue', value: "'Bebas Neue'", category: 'display' },
  { name: 'Pacifico', value: "'Pacifico'", category: 'handwriting' },
];

/**
 * Build a Google Fonts <link> URL for a set of font names.
 * Returns empty string if no fonts are provided.
 */
export function buildGoogleFontsUrl(fontNames: string[]): string {
  if (fontNames.length === 0) return '';

  const families = fontNames
    .map((name) => {
      const encoded = name.replace(/ /g, '+');
      // Most fonts need 400,600,700 weights
      return `family=${encoded}:wght@400;600;700`;
    })
    .join('&');

  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

/**
 * Build a Google Fonts <link> tag for embedding in HTML <head>.
 */
export function buildGoogleFontsLinkTag(fontNames: string[]): string {
  const url = buildGoogleFontsUrl(fontNames);
  if (!url) return '';
  return `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${url}" rel="stylesheet">`;
}

/**
 * Get the CSS font-family string (with fallback) for a given font name.
 * Returns undefined if fontName is empty/undefined (use system default).
 */
export function getFontFamilyCSS(
  fontName: string | undefined
): string | undefined {
  if (!fontName) return undefined;

  const font = FONT_OPTIONS.find((f) => f.name === fontName);
  if (!font) return undefined;

  const fallback = font.category === 'serif' ? 'serif' : 'sans-serif';
  return `${font.value}, ${fallback}`;
}

/**
 * Collect all unique font names used across project elements.
 */
export function collectUsedFonts(
  elements: { props: Record<string, any> }[]
): string[] {
  const fonts = new Set<string>();

  for (const el of elements) {
    const p = el.props;
    if (p.headlineFont) fonts.add(p.headlineFont);
    if (p.subheadlineFont) fonts.add(p.subheadlineFont);
    if (p.fontFamily) fonts.add(p.fontFamily);
    if (p.quoteFont) fonts.add(p.quoteFont);
  }

  return Array.from(fonts);
}
