import type { Project, Element, SEOSettings } from '@/types';
import { generateTrackingScript } from '@/lib/analytics/tracking-script';
import { generateTrackingPixelScripts, type TrackingPixelsConfig } from '@/lib/tracking/pixel-scripts';
import { generateBookingFormHTML } from './booking-form-generator';

/**
 * Sanitize element ID for use in JavaScript identifiers
 * Removes invalid characters and replaces hyphens with underscores to avoid syntax errors
 */
function sanitizeId(id: string): string {
  return id.replace(/[^a-zA-Z0-9_]/g, '_');
}

/**
 * Map icon names to SVG paths
 */
function getIconSVG(iconName: string): string {
  const iconMap: Record<string, string> = {
    'check-circle': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
    'star': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>',
    'zap': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>',
    'shield': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>',
    'heart': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>',
    'award': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>',
    'sparkles': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>',
    'rocket': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"></path>',
    'target': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>',
    'trending-up': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>',
    'clock': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
    'users': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>',
    'globe': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
    'lock': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>',
    'settings': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>',
    'dollar-sign': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
    'gift': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path>',
    'thumbs-up': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>',
    'lightbulb': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>',
    'smartphone': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>',
  };

  return iconMap[iconName] || iconMap['check-circle'];
}

/**
 * Generate complete HTML page from project data
 */
export function generateHTML(
  project: Project,
  elements: Element[],
  trackingPixels?: TrackingPixelsConfig | null
): string {
  // Provide default empty object if seo_settings is null/undefined
  const seo_settings = project.seo_settings || {};

  return `<!DOCTYPE html>
<html lang="${seo_settings.language || 'en'}">
<head>
  ${generateHeadContent(project, seo_settings, trackingPixels)}
</head>
<body>
  <!-- Global project configuration -->
  <script>
    window.__PROJECT_ID__ = '${project.id}';

    // Define stub modal functions that will be overridden by payment button elements
    // This prevents errors when buttons reference these functions before they're fully defined
    window.openCheckoutModal = window.openCheckoutModal || function(modalId, productName, productPrice, productId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
      }
    };

    window.closeCheckoutModal = window.closeCheckoutModal || function(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    };
  </script>

  ${generateBodyContent(elements)}
  ${generateAnalyticsScripts(project)}
</body>
</html>`;
}

/**
 * Generate <head> section with SEO meta tags
 */
function generateHeadContent(
  project: Project,
  seo: SEOSettings,
  trackingPixels?: TrackingPixelsConfig | null
): string {
  return `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${seo.title || project.name}</title>
  <meta name="description" content="${seo.description || project.description || ''}">
  ${seo.keywords ? `<meta name="keywords" content="${seo.keywords.join(', ')}">` : ''}

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="${seo.ogType || 'website'}">
  <meta property="og:title" content="${seo.ogTitle || seo.title || project.name}">
  <meta property="og:description" content="${seo.ogDescription || seo.description || ''}">
  ${seo.ogImage ? `<meta property="og:image" content="${seo.ogImage}">` : ''}

  <!-- Twitter -->
  <meta name="twitter:card" content="${seo.twitterCard || 'summary_large_image'}">
  ${seo.twitterSite ? `<meta name="twitter:site" content="${seo.twitterSite}">` : ''}
  <meta name="twitter:title" content="${seo.ogTitle || seo.title || project.name}">
  <meta name="twitter:description" content="${seo.ogDescription || seo.description || ''}">
  ${seo.ogImage ? `<meta name="twitter:image" content="${seo.ogImage}">` : ''}

  <!-- Robots -->
  <meta name="robots" content="${seo.robotsIndex ? 'index' : 'noindex'}, ${seo.robotsFollow ? 'follow' : 'nofollow'}">

  ${seo.canonicalUrl ? `<link rel="canonical" href="${seo.canonicalUrl}">` : ''}

  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico">

  <!-- Tracking Pixels -->
  ${trackingPixels ? generateTrackingPixelScripts(trackingPixels) : ''}

  <!-- Styles -->
  ${generateStyles()}

  ${seo.structuredData ? `
  <script type="application/ld+json">
    ${JSON.stringify(seo.structuredData)}
  </script>
  ` : ''}
`;
}

/**
 * Generate inline CSS styles
 */
function generateStyles(): string {
  return `
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html {
      scroll-behavior: smooth;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: #333;
    }

    section {
      width: 100%;
      position: relative;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .container-sm {
      max-width: 768px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .container-lg {
      max-width: 1536px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    button, .button {
      display: inline-block;
      padding: 0.75rem 2rem;
      font-size: 1rem;
      font-weight: 600;
      text-decoration: none;
      border-radius: 0.5rem;
      border: 2px solid transparent;
      cursor: pointer;
      transition: all 0.2s;
    }

    .button-primary {
      background: #2563eb;
      color: white;
    }

    .button-primary:hover {
      background: #1d4ed8;
    }

    .button-outline {
      background: rgba(255, 255, 255, 0.15);
      border-color: white;
      color: white;
      backdrop-filter: blur(10px);
    }

    .button-outline:hover {
      background: rgba(255, 255, 255, 0.25);
    }

    h1, h2, h3, h4, h5, h6 {
      font-weight: 700;
      line-height: 1.2;
      margin-bottom: 1rem;
    }

    h1 { font-size: 3rem; }
    h2 { font-size: 2.5rem; }
    h3 { font-size: 2rem; }
    h4 { font-size: 1.5rem; }

    p {
      margin-bottom: 1rem;
    }

    img {
      max-width: 100%;
      height: auto;
    }

    .grid {
      display: grid;
      gap: 2rem;
    }

    .grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
    .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
    .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }

    @media (max-width: 768px) {
      h1 { font-size: 2rem; }
      h2 { font-size: 1.75rem; }
      h3 { font-size: 1.5rem; }

      .grid-cols-2,
      .grid-cols-3 {
        grid-template-columns: repeat(1, 1fr);
      }

      /* Responsive pricing and product grids */
      .pricing-grid,
      .products-grid {
        grid-template-columns: 1fr !important;
        gap: 1rem !important;
        padding: 0 0.5rem;
      }
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      /* Tablet: show 2 columns */
      .pricing-grid,
      .products-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }

    /* Utility classes */
    .text-center { text-align: center; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .mb-8 { margin-bottom: 2rem; }
    .mb-12 { margin-bottom: 3rem; }
    .py-20 { padding: 5rem 0; }
    .flex { display: flex; }
    .items-center { align-items: center; }
    .justify-center { justify-content: center; }
    .gap-4 { gap: 1rem; }
    .gap-8 { gap: 2rem; }
  </style>
`;
}

/**
 * Generate body content from elements
 */
function generateBodyContent(elements: Element[]): string {
  // Sort elements by order
  const sortedElements = [...elements].sort((a, b) => a.order - b.order);

  return sortedElements.map(element => {
    switch (element.type) {
      case 'announcement_bar':
        return generateAnnouncementBarHTML(element);
      case 'navigation':
        return generateNavigationHTML(element);
      case 'hero':
        return generateHeroHTML(element);
      case 'features':
        return generateFeaturesHTML(element);
      case 'testimonials':
        return generateTestimonialsHTML(element);
      case 'pricing':
        return generatePricingHTML(element);
      case 'faq':
        return generateFAQHTML(element);
      case 'cta':
        return generateCTAHTML(element);
      case 'payment_button':
        return generatePaymentButtonHTML(element);
      case 'footer':
        return generateFooterHTML(element);
      case 'lead_form':
        return generateLeadFormHTML(element);
      case 'whatsapp_button':
        return generateWhatsAppButtonHTML(element);
      case 'form_with_payment':
        return generateFormWithPaymentHTML(element);
      case 'product_carousel':
        return generateProductCarouselHTML(element);
      case 'booking_form':
        return generateBookingFormHTML(element);
      default:
        return '';
    }
  }).join('\n');
}

/**
 * Generate Hero section HTML
 */
function generateHeroHTML(element: Element): string {
  const {
    variant,
    headline,
    subheadline,
    ctaText,
    ctaUrl,
    image,
    bgColor,
    headlineColor = '#111827',
    subheadlineColor = '#4b5563',
    headlineSize = '5xl',
    subheadlineSize = 'xl',
    imageOpacity = 70,
    buttonBgColor = '#2563eb',
    buttonTextColor = '#ffffff'
  } = element.props;

  // Convert Tailwind sizes to actual CSS values
  const headlineSizeMap: Record<string, string> = {
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem'
  };

  const subheadlineSizeMap: Record<string, string> = {
    'base': '1rem',
    'lg': '1.125rem',
    'xl': '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem'
  };

  const headlineFontSize = headlineSizeMap[headlineSize] || '3rem';
  const subheadlineFontSize = subheadlineSizeMap[subheadlineSize] || '1.25rem';

  if (variant === 'centered') {
    return `
<section id="${element.type}-${element.order}" style="background-color: ${bgColor}; padding: 5rem 1rem; scroll-margin-top: 4rem;">
  <div class="container-sm text-center">
    ${image ? `<img src="${image}" alt="Hero" style="width: 8rem; height: 8rem; margin: 0 auto 2rem; border-radius: 0.5rem; object-fit: cover;">` : ''}
    <h1 style="color: ${headlineColor}; font-size: ${headlineFontSize}; font-weight: bold; margin-bottom: 1.5rem;">${headline}</h1>
    <p style="font-size: ${subheadlineFontSize}; color: ${subheadlineColor}; margin-bottom: 2rem;">${subheadline}</p>
    <a href="${ctaUrl}" class="button" style="background-color: ${buttonBgColor}; color: ${buttonTextColor}; border: none;">${ctaText}</a>
  </div>
</section>`;
  }

  if (variant === 'image_left') {
    return `
<section id="${element.type}-${element.order}" style="background-color: ${bgColor}; padding: 5rem 1rem; scroll-margin-top: 4rem;">
  <div class="container">
    <div class="grid grid-cols-2 gap-8 items-center">
      <div>
        <h1 style="color: ${headlineColor}; font-size: ${headlineFontSize}; font-weight: bold; margin-bottom: 1.5rem;">${headline}</h1>
        <p style="font-size: ${subheadlineFontSize}; color: ${subheadlineColor}; margin-bottom: 2rem;">${subheadline}</p>
        <a href="${ctaUrl}" class="button" style="background-color: ${buttonBgColor}; color: ${buttonTextColor}; border: none;">${ctaText}</a>
      </div>
      <div>
        ${image ? `<img src="${image}" alt="Hero" style="width: 100%; height: 24rem; border-radius: 0.5rem; object-fit: cover; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);">` : '<div style="width: 100%; height: 24rem; background: #e5e7eb; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; color: #9ca3af;">Image placeholder</div>'}
      </div>
    </div>
  </div>
</section>`;
  }

  if (variant === 'image_bg') {
    return `
<section id="${element.type}-${element.order}" style="position: relative; padding: 8rem 1rem; overflow: hidden; scroll-margin-top: 4rem;">
  ${image ? `
  <div style="position: absolute; inset: 0; background-image: url(${image}); background-size: cover; background-position: center;"></div>
  <div style="position: absolute; inset: 0; background-color: ${bgColor}; opacity: ${imageOpacity / 100};"></div>
  ` : `
  <div style="position: absolute; inset: 0; background: #1f2937; display: flex; align-items: center; justify-content: center; color: #6b7280;">
    Background Image
  </div>
  `}
  <div class="container-sm text-center" style="position: relative; z-index: 10;">
    <h1 style="color: ${headlineColor}; font-size: ${headlineFontSize}; font-weight: bold; margin-bottom: 1.5rem;">${headline}</h1>
    <p style="font-size: ${subheadlineFontSize}; color: ${subheadlineColor}; margin-bottom: 2rem;">${subheadline}</p>
    <a href="${ctaUrl}" class="button" style="background-color: ${buttonBgColor}; color: ${buttonTextColor}; border: 2px solid ${buttonTextColor};">${ctaText}</a>
  </div>
</section>`;
  }

  return '';
}

/**
 * Generate Features section HTML
 */
function generateFeaturesHTML(element: Element): string {
  const {
    variant,
    title,
    features,
    backgroundImage,
    backgroundOpacity = 70,
    bgColor = '#000000'
  } = element.props;

  if (variant === 'grid') {
    return `
<section id="${element.type}-${element.order}" style="position: relative; overflow: hidden; background: white; padding: 5rem 1rem; scroll-margin-top: 4rem;">
  ${backgroundImage ? `
  <div style="position: absolute; inset: 0; background-image: url(${backgroundImage}); background-size: cover; background-position: center;"></div>
  <div style="position: absolute; inset: 0; background-color: ${bgColor}; opacity: ${backgroundOpacity / 100};"></div>
  ` : ''}
  <div class="container" style="position: relative; z-index: 10;">
    <h2 class="text-center mb-12">${title}</h2>
    <div class="grid grid-cols-3 gap-8">
      ${features.map((feature: any) => `
        <div style="padding: 1.5rem; border: 1px solid #e5e7eb; border-radius: 0.5rem;">
          <div style="width: 3rem; height: 3rem; background: #dbeafe; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
            <svg style="width: 1.5rem; height: 1.5rem; color: #2563eb;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              ${getIconSVG(feature.icon || 'check-circle')}
            </svg>
          </div>
          <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">${feature.title}</h3>
          <p style="color: #666;">${feature.description}</p>
        </div>
      `).join('')}
    </div>
  </div>
</section>`;
  }

  return '';
}

/**
 * Generate Testimonials section HTML
 */
function generateTestimonialsHTML(element: Element): string {
  const {
    variant,
    title,
    testimonials,
    backgroundImage,
    backgroundOpacity = 70,
    bgColor = '#000000'
  } = element.props;

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => {
      const filled = i < rating;
      return `<svg style="width: 1rem; height: 1rem; display: inline-block; ${filled ? 'color: #fbbf24; fill: #fbbf24;' : 'color: #d1d5db;'}" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>`;
    }).join('');
  };

  if (variant === 'grid') {
    return `
<section id="${element.type}-${element.order}" style="position: relative; overflow: hidden; background: #f9fafb; padding: 5rem 1rem; scroll-margin-top: 4rem;">
  ${backgroundImage ? `
  <div style="position: absolute; inset: 0; background-image: url(${backgroundImage}); background-size: cover; background-position: center;"></div>
  <div style="position: absolute; inset: 0; background-color: ${bgColor}; opacity: ${backgroundOpacity / 100};"></div>
  ` : ''}
  <div class="container" style="position: relative; z-index: 10;">
    <h2 class="text-center mb-12">${title}</h2>
    <div class="grid grid-cols-3 gap-8">
      ${testimonials.map((testimonial: any) => `
        <div style="background: white; padding: 1.5rem; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          <div style="margin-bottom: 1rem;">${renderStars(testimonial.rating)}</div>
          <p style="color: #374151; margin-bottom: 1rem; font-style: italic;">"${testimonial.quote}"</p>
          <div style="margin-top: 1rem;">
            <p style="font-weight: 600; color: #111827; margin: 0;">${testimonial.name}</p>
            <p style="font-size: 0.875rem; color: #6b7280; margin: 0;">${testimonial.role}</p>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</section>`;
  }

  return '';
}

/**
 * Generate FAQ section HTML
 */
function generateFAQHTML(element: Element): string {
  const {
    variant,
    title,
    questions,
    backgroundImage,
    backgroundOpacity = 70,
    bgColor = '#000000'
  } = element.props;

  if (variant === 'single_column') {
    return `
<section id="${element.type}-${element.order}" style="position: relative; overflow: hidden; background: white; padding: 5rem 1rem; scroll-margin-top: 4rem;">
  ${backgroundImage ? `
  <div style="position: absolute; inset: 0; background-image: url(${backgroundImage}); background-size: cover; background-position: center;"></div>
  <div style="position: absolute; inset: 0; background-color: ${bgColor}; opacity: ${backgroundOpacity / 100};"></div>
  ` : ''}
  <div class="container-sm" style="position: relative; z-index: 10;">
    <h2 class="text-center mb-12">${title}</h2>
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      ${questions.map((item: any, index: number) => `
        <details style="border: 1px solid #e5e7eb; border-radius: 0.5rem; overflow: hidden;">
          <summary style="padding: 1rem 1.5rem; font-weight: 600; font-size: 1.125rem; cursor: pointer; background: white; list-style: none;">
            ${item.question}
            <span style="float: right;">▼</span>
          </summary>
          <div style="padding: 1rem 1.5rem; background: #f9fafb; border-top: 1px solid #e5e7eb;">
            <p style="color: #374151; margin: 0;">${item.answer}</p>
          </div>
        </details>
      `).join('')}
    </div>
  </div>
</section>`;
  }

  return '';
}

/**
 * Generate CTA section HTML
 */
function generateCTAHTML(element: Element): string {
  const {
    variant,
    headline,
    description,
    buttonText,
    buttonUrl,
    bgGradient,
    backgroundImage,
    backgroundOpacity = 70,
    buttonColor = '#ffffff',
    buttonTextColor = '#111827',
    buttonSize = 'lg',
    buttonFontSize = '1.125rem',
  } = element.props;

  // Button padding based on size
  const getButtonPadding = () => {
    switch (buttonSize) {
      case 'sm':
        return '0.5rem 1rem';
      case 'md':
        return '0.75rem 1.5rem';
      case 'lg':
        return '1rem 2rem';
      default:
        return '1rem 2rem';
    }
  };

  const buttonStyles = `
    background-color: ${buttonColor};
    color: ${buttonTextColor};
    font-size: ${buttonFontSize};
    border: 2px solid ${buttonTextColor};
    border-radius: 0.5rem;
    font-weight: 600;
    padding: ${getButtonPadding()};
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    transition: opacity 0.2s;
  `.trim();

  if (variant === 'centered') {
    return `
<section id="${element.type}-${element.order}" style="position: relative; overflow: hidden; background: ${bgGradient}; padding: 5rem 1rem; scroll-margin-top: 4rem;">
  ${backgroundImage ? `
  <div style="position: absolute; inset: 0; background-image: url(${backgroundImage}); background-size: cover; background-position: center;"></div>
  <div style="position: absolute; inset: 0; background-color: #000000; opacity: ${backgroundOpacity / 100};"></div>
  ` : ''}
  <div class="container-sm text-center" style="position: relative; z-index: 10; color: white;">
    <h2 style="color: white; font-size: 3rem; margin-bottom: 1.5rem;">${headline}</h2>
    <p style="font-size: 1.5rem; margin-bottom: 2rem; color: rgba(255, 255, 255, 0.9);">${description}</p>
    <a href="${buttonUrl || '#'}" style="${buttonStyles}" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">${buttonText} →</a>
  </div>
</section>`;
  }

  return '';
}

/**
 * Generate Payment Button section HTML
 */
function generatePaymentButtonHTML(element: Element): string {
  const {
    products = [],
    currency,
    buttonText,
    buttonColor,
    buttonSize,
    enableBumpOffer,
    bumpOfferName,
    bumpOfferDescription,
    bumpOfferAmount,
    bumpOfferDiscount,
    successMessage,
    failureMessage,
    bgColor,
    // Legacy fields for backwards compatibility
    productName,
    productDescription,
    amount,
    productImage,
  } = element.props;

  // Use products array or fall back to legacy single product
  const displayProducts = products.length > 0
    ? products
    : [{
        id: '1',
        name: productName || 'Product Name',
        description: productDescription || '',
        price: amount || 0,
        image: productImage,
      }];

  const hasMultipleProducts = displayProducts.length > 1;

  const buttonId = `payment-btn-${element.id}`;
  const checkoutModalId = `checkout-modal-${element.id}`;
  const bumpModalId = `bump-modal-${element.id}`;

  // Calculate bump offer discounted price
  const bumpDiscountedPrice = bumpOfferAmount && bumpOfferDiscount
    ? bumpOfferAmount * (1 - bumpOfferDiscount / 100)
    : bumpOfferAmount;

  // Button size styles
  const sizeStyles: Record<string, string> = {
    sm: 'padding: 0.5rem 1.5rem; font-size: 0.875rem;',
    md: 'padding: 0.75rem 2rem; font-size: 1rem;',
    lg: 'padding: 1rem 2.5rem; font-size: 1.125rem;'
  };
  const buttonSizeStyle = sizeStyles[buttonSize] || sizeStyles['md'];

  // Format currency
  const formatCurrency = (value: number) => {
    // Handle undefined or null values
    const price = value || 0;
    if (currency === 'MYR') return `RM ${price.toFixed(2)}`;
    return `${currency} ${price.toFixed(2)}`;
  };

  // Calculate sanitized element ID once for use in function names
  const sanitizedId = sanitizeId(element.id);

  return `
<section style="background-color: ${bgColor}; padding: 4rem 1rem;" id="${element.type}-${element.order}">
  <div class="container" style="max-width: ${hasMultipleProducts ? '80rem' : '32rem'}; margin: 0 auto;">
    ${hasMultipleProducts ? `
      <!-- Multiple Products Grid -->
      <h2 style="font-size: 2.25rem; font-weight: bold; text-align: center; margin-bottom: 3rem; color: #111827;">Choose Your Product</h2>
      <div class="products-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; max-width: 70rem; margin: 0 auto;">
        ${displayProducts.map((product: any, index: number) => `
          <div style="background: white; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); overflow: hidden; ${product.featured ? 'border: 2px solid #fbbf24; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);' : ''}">
            ${product.featured ? `
            <div style="background: linear-gradient(to right, #fbbf24, #f59e0b); color: white; text-align: center; padding: 0.5rem; font-weight: 600; font-size: 0.875rem;">
              ⭐ Most Popular
            </div>
            ` : ''}

            <!-- Product Image -->
            ${product.image ? `
            <div style="height: 12rem; overflow: hidden;">
              <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            ` : `
            <div style="height: 12rem; background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%); display: flex; align-items: center; justify-content: center;">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            </div>
            `}

            <div style="padding: 1.5rem; text-align: center;">
              <h3 style="font-size: 1.25rem; font-weight: bold; color: #111827; margin-bottom: 0.5rem;">${product.name}</h3>
              ${product.description ? `<p style="color: #6b7280; font-size: 0.875rem; margin-bottom: 1rem;">${product.description}</p>` : ''}
              <div style="margin-bottom: 1.5rem;">
                <span style="font-size: 2rem; font-weight: bold; color: #111827;">${formatCurrency(product.price)}</span>
              </div>
              <button
                onclick="openCheckoutModal('${checkoutModalId}', '${product.name}', ${product.price || 0}, '${product.id || ''}')"
                style="
                  ${buttonSizeStyle}
                  background-color: ${buttonColor};
                  color: white;
                  border: none;
                  border-radius: 0.5rem;
                  font-weight: 600;
                  cursor: pointer;
                  transition: transform 0.2s;
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                  width: 100%;
                "
                onmouseover="this.style.transform='scale(1.05)'"
                onmouseout="this.style.transform='scale(1)'"
              >
                ${buttonText}
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    ` : `
      <!-- Single Product Card -->
      <div style="background: white; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <!-- Product Image -->
        ${displayProducts[0].image ? `
        <div style="height: 16rem; overflow: hidden;">
          <img src="${displayProducts[0].image}" alt="${displayProducts[0].name}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        ` : `
        <div style="padding: 2rem 2rem 0 2rem; text-align: center;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 4rem; height: 4rem; background: #dbeafe; border-radius: 9999px; margin-bottom: 1rem;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          </div>
        </div>
        `}

        <div style="padding: 2rem; text-align: center;">
          <h2 style="font-size: 1.5rem; font-weight: bold; color: #111827; margin-bottom: 0.5rem;">${displayProducts[0].name}</h2>
          ${displayProducts[0].description ? `<p style="color: #6b7280; margin-bottom: 1rem;">${displayProducts[0].description}</p>` : ''}
          <div style="margin-bottom: 1.5rem;">
            <span style="font-size: 2.25rem; font-weight: bold; color: #111827;">${formatCurrency(displayProducts[0].price)}</span>
          </div>
          <button
            id="${buttonId}"
            onclick="openCheckoutModal('${checkoutModalId}', '${displayProducts[0].name}', ${displayProducts[0].price || 0}, '${displayProducts[0].id || ''}')"
            style="
              ${buttonSizeStyle}
              background-color: ${buttonColor};
              color: white;
              border: none;
              border-radius: 0.5rem;
              font-weight: 600;
              cursor: pointer;
              transition: transform 0.2s;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            "
            onmouseover="this.style.transform='scale(1.05)'"
            onmouseout="this.style.transform='scale(1)'"
          >
            ${buttonText}
          </button>
          <p style="font-size: 0.75rem; color: #9ca3af; margin-top: 1rem;">
            Powered by LeanX - Secure Payment
          </p>
        </div>
      </div>
    `}
  </div>

  <!-- Checkout Modal -->
  <div id="${checkoutModalId}" style="display: none; position: fixed; inset: 0; z-index: 50; background: rgba(0, 0, 0, 0.5); padding: 1rem;">
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh;">
      <div style="background: white; border-radius: 0.5rem; max-width: 32rem; width: 100%; max-height: 90vh; overflow-y: auto;">
        <!-- Modal Header -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.5rem; border-bottom: 1px solid #e5e7eb;">
          <h2 style="font-size: 1.25rem; font-weight: 600; margin: 0;">Secure Checkout</h2>
          <button onclick="closeCheckoutModal('${checkoutModalId}')" style="background: none; border: none; cursor: pointer; color: #9ca3af; font-size: 1.5rem;">&times;</button>
        </div>

        <!-- Modal Body -->
        <form id="checkout-form-${element.id}" style="padding: 1.5rem;">
          <!-- Order Summary -->
          <div style="background: #f9fafb; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1.5rem;">
            <h3 style="font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.75rem;">Order Summary</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
              <span>${displayProducts[0].name}</span>
              <span style="font-weight: 600;">${formatCurrency(displayProducts[0].price)}</span>
            </div>
            <div id="shipping-cost-${element.id}" style="display: none; justify-content: space-between; padding-top: 0.5rem; border-top: 1px solid #e5e7eb; margin-top: 0.5rem;">
              <span style="font-size: 0.875rem;">Priority Shipping & Insurance</span>
              <span style="font-size: 0.875rem; font-weight: 600;">RM 10.00</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding-top: 0.75rem; margin-top: 0.75rem; border-top: 1px solid #d1d5db;">
              <span style="font-weight: bold;">Total</span>
              <span id="total-amount-${element.id}" style="font-weight: bold;">${formatCurrency(displayProducts[0].price)}</span>
            </div>
          </div>

          <!-- Shipping Option -->
          <div style="border: 2px solid #fcd34d; background: #fef3c7; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1.5rem;">
            <label style="display: flex; align-items: start; cursor: pointer;">
              <input type="checkbox" id="add-shipping-${element.id}" style="margin-top: 0.25rem; margin-right: 0.75rem;">
              <div>
                <p style="font-weight: 600; margin: 0 0 0.25rem 0;">Yes! Add Priority Shipping & Insurance</p>
                <p style="font-size: 0.875rem; color: #4b5563; margin: 0;">Get your order faster and fully insured against damage.</p>
              </div>
            </label>
          </div>

          <!-- Bank Selection -->
          <div style="margin-bottom: 1.5rem;">
            <h3 style="font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 1rem;">Select Your Bank</h3>

            <!-- Loading State -->
            <div id="banks-loading-${element.id}" style="display: flex; align-items: center; justify-content: center; padding: 2rem;">
              <div style="width: 2rem; height: 2rem; border: 3px solid #e5e7eb; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.6s linear infinite;"></div>
            </div>

            <!-- Error State -->
            <div id="banks-error-${element.id}" style="display: none; background: #fee2e2; border: 1px solid #fca5a5; border-radius: 0.375rem; padding: 1rem; text-align: center;">
              <p style="color: #dc2626; font-size: 0.875rem; margin: 0 0 0.5rem 0;">Failed to load banks</p>
              <button type="button" onclick="window.fetchBanks_${sanitizedId}()" style="font-size: 0.875rem; padding: 0.25rem 0.75rem; background: white; border: 1px solid #dc2626; color: #dc2626; border-radius: 0.25rem; cursor: pointer;">Retry</button>
            </div>

            <!-- Banks List -->
            <div id="banks-list-${element.id}" style="display: none;">
              <!-- Banks will be dynamically inserted here -->
            </div>

            <input type="hidden" id="selected-bank-${element.id}" required>
            <p id="bank-error-${element.id}" style="display: none; font-size: 0.75rem; color: #dc2626; margin-top: 0.25rem;">Please select a bank</p>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem;">
              Email <span style="color: #dc2626;">*</span>
            </label>
            <input
              type="email"
              id="customer-email-${element.id}"
              placeholder="your@email.com"
              required
              style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem;"
            >
            <p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;">We'll send your receipt to this email</p>
          </div>

          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.25rem;">
              Phone Number <span style="color: #dc2626;">*</span>
            </label>
            <input
              type="tel"
              id="customer-phone-${element.id}"
              placeholder="60123456789"
              required
              pattern="[0-9]{10,15}"
              style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.375rem; font-size: 1rem;"
            >
            <p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;">Required for payment verification</p>
          </div>

          <button
            type="submit"
            style="width: 100%; padding: 0.75rem; background: #2563eb; color: white; border: none; border-radius: 0.375rem; font-weight: 600; font-size: 1.125rem; cursor: pointer;"
          >
            Proceed to Secure Payment - <span id="button-total-${element.id}">${formatCurrency(displayProducts[0].price)}</span>
          </button>
<style>
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>

          <div style="text-align: center; margin-top: 1rem;">
            <p style="font-size: 0.875rem; color: #6b7280; margin: 0.25rem 0;">
              <svg style="display: inline; width: 1rem; height: 1rem; vertical-align: middle;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              256-bit SSL Secure Payment
            </p>
            <p style="font-size: 0.75rem; color: #9ca3af; margin: 0.25rem 0;">Powered by LeanX</p>
          </div>
        </form>
      </div>
    </div>
  </div>

  ${enableBumpOffer && bumpOfferName ? `
  <!-- Bump Offer Modal -->
  <div id="${bumpModalId}" style="display: none; position: fixed; inset: 0; z-index: 50; background: rgba(0, 0, 0, 0.5); padding: 1rem;">
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh;">
      <div style="background: white; border-radius: 0.5rem; max-width: 40rem; width: 100%; max-height: 90vh; overflow-y: auto;">
        <!-- Red Banner -->
        <div style="background: #dc2626; color: white; text-align: center; padding: 0.75rem;">
          <p style="font-weight: bold; margin: 0;">WAIT! YOUR ORDER IS NOT COMPLETE YET...</p>
        </div>

        <div style="padding: 2rem;">
          <h2 style="font-size: 1.875rem; font-weight: bold; text-align: center; margin-bottom: 1rem;">Add This Special Offer?</h2>
          <p style="text-align: center; color: #374151; font-size: 1.125rem; margin-bottom: 1.5rem;">${bumpOfferDescription}</p>

          <!-- Product Card -->
          <div style="background: white; border: 2px solid #e5e7eb; border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 1.5rem;">
            <div style="background: #e5e7eb; border-radius: 0.5rem; height: 16rem; display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
              <svg style="width: 5rem; height: 5rem; color: #9ca3af;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>

            <h3 style="font-size: 1.25rem; font-weight: bold; text-align: center; margin-bottom: 1rem;">${bumpOfferName}</h3>

            <div style="text-align: center; margin-bottom: 1.5rem;">
              <p style="color: #6b7280; text-decoration: line-through; font-size: 1.125rem; margin-bottom: 0.25rem;">${formatCurrency(bumpOfferAmount || 0)}</p>
              <div style="display: flex; align-items: center; justify-content: center; gap: 0.75rem;">
                <p style="font-size: 2.25rem; font-weight: bold; color: #dc2626; margin: 0;">${formatCurrency(bumpDiscountedPrice || 0)}</p>
                ${bumpOfferDiscount ? `<span style="background: #fee2e2; color: #dc2626; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600;">${bumpOfferDiscount}% OFF</span>` : ''}
              </div>
            </div>

            <button
              onclick="acceptBumpOffer('${element.id}')"
              style="width: 100%; padding: 1rem; background: #16a34a; color: white; border: none; border-radius: 0.5rem; font-weight: bold; font-size: 1.125rem; cursor: pointer; margin-bottom: 1rem;"
            >
              Yes! Add To My Order
            </button>
          </div>

          <div style="text-align: center;">
            <button
              onclick="declineBumpOffer('${element.id}')"
              style="background: none; border: none; color: #6b7280; text-decoration: underline; font-size: 0.875rem; cursor: pointer;"
            >
              No thanks, I'll pass on this discount
            </button>
          </div>

          <p style="font-size: 0.75rem; text-align: center; color: #9ca3af; margin-top: 1.5rem;">
            This is a one-time offer only available on this page.
          </p>
        </div>
      </div>
    </div>
  </div>
  ` : ''}

  <script>
    (function() {
      const projectId = window.__PROJECT_ID__;
      const elementId = '${element.id}';
      let transactionId = null;
      let addShipping = false;
      let bumpOfferAccepted = false;
      let banks = [];
      let selectedBankId = null;

      // Fetch banks from API
      window.fetchBanks_${sanitizedId} = async function() {
        const loadingEl = document.getElementById('banks-loading-${element.id}');
        const errorEl = document.getElementById('banks-error-${element.id}');
        const listEl = document.getElementById('banks-list-${element.id}');

        loadingEl.style.display = 'flex';
        errorEl.style.display = 'none';
        listEl.style.display = 'none';

        try {
          const response = await fetch('/api/payments/public-banks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_id: projectId })
          });
          const data = await response.json();

          if (data.success && data.banks) {
            banks = data.banks;
            renderBanks(banks);
            loadingEl.style.display = 'none';
            listEl.style.display = 'block';
          } else {
            throw new Error(data.error || 'Failed to load banks');
          }
        } catch (error) {
          console.error('Failed to fetch banks:', error);
          loadingEl.style.display = 'none';
          errorEl.style.display = 'block';
        }
      };

      // Render banks list grouped by type
      function renderBanks(banksList) {
        const listEl = document.getElementById('banks-list-${element.id}');

        // Separate banks by type
        var fpxBanks = banksList.filter(function(b) { return b.type === 'WEB_PAYMENT'; });
        var ewalletBanks = banksList.filter(function(b) { return b.type === 'DIGITAL_PAYMENT'; });

        var html = '';

        // FPX / Online Banking Section
        if (fpxBanks.length > 0) {
          html += '<div style="margin-bottom: 1rem;">' +
            '<h4 style="display: flex; align-items: center; font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 0.5rem;">' +
              '<svg style="width: 1rem; height: 1rem; margin-right: 0.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>' +
              'Online Banking (FPX)' +
            '</h4>' +
            '<div>';

          fpxBanks.forEach(function(bank) {
            var logoHtml = bank.logo ?
              '<img src="' + bank.logo + '" alt="' + bank.name + '" style="width: 2rem; height: 2rem; object-fit: contain;" />' :
              '<svg style="width: 1.5rem; height: 1.5rem; color: #9ca3af;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>';

            html += '<button type="button" onclick="window.selectBank_${sanitizedId}(\\'' + bank.id + '\\')" id="bank-btn-' + bank.id + '" style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; margin-bottom: 0.5rem; border: 2px solid #e5e7eb; border-radius: 0.5rem; background: white; cursor: pointer; transition: all 0.2s;">' +
              '<div style="display: flex; align-items: center; gap: 0.75rem;">' +
                logoHtml +
                '<span style="font-weight: 500; color: #111827;">' + bank.name + '</span>' +
              '</div>' +
              '<div id="bank-check-' + bank.id + '" style="display: none; width: 1.25rem; height: 1.25rem; border-radius: 50%; background: #2563eb; align-items: center; justify-content: center;">' +
                '<svg style="width: 0.75rem; height: 0.75rem; color: white;" fill="currentColor" viewBox="0 0 20 20">' +
                  '<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />' +
                '</svg>' +
              '</div>' +
            '</button>';
          });

          html += '</div></div>';
        }

        // E-Wallets Section
        if (ewalletBanks.length > 0) {
          html += '<div style="margin-bottom: 1rem;">' +
            '<h4 style="display: flex; align-items: center; font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 0.5rem;">' +
              '<svg style="width: 1rem; height: 1rem; margin-right: 0.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>' +
              'E-Wallets' +
            '</h4>' +
            '<div>';

          ewalletBanks.forEach(function(bank) {
            var logoHtml = bank.logo ?
              '<img src="' + bank.logo + '" alt="' + bank.name + '" style="width: 2rem; height: 2rem; object-fit: contain;" />' :
              '<svg style="width: 1.5rem; height: 1.5rem; color: #9ca3af;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>';

            html += '<button type="button" onclick="window.selectBank_${sanitizedId}(\\'' + bank.id + '\\')" id="bank-btn-' + bank.id + '" style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; margin-bottom: 0.5rem; border: 2px solid #e5e7eb; border-radius: 0.5rem; background: white; cursor: pointer; transition: all 0.2s;">' +
              '<div style="display: flex; align-items: center; gap: 0.75rem;">' +
                logoHtml +
                '<span style="font-weight: 500; color: #111827;">' + bank.name + '</span>' +
              '</div>' +
              '<div id="bank-check-' + bank.id + '" style="display: none; width: 1.25rem; height: 1.25rem; border-radius: 50%; background: #2563eb; align-items: center; justify-content: center;">' +
                '<svg style="width: 0.75rem; height: 0.75rem; color: white;" fill="currentColor" viewBox="0 0 20 20">' +
                  '<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />' +
                '</svg>' +
              '</div>' +
            '</button>';
          });

          html += '</div></div>';
        }

        listEl.innerHTML = html;
      }

      // Select bank
      window.selectBank_${sanitizedId} = function(bankId) {
        selectedBankId = bankId;
        document.getElementById('selected-bank-${element.id}').value = bankId;
        document.getElementById('bank-error-${element.id}').style.display = 'none';

        // Update UI - use direct DOM manipulation instead of looping through banks array
        var allButtons = document.querySelectorAll('[id^="bank-btn-"]');
        allButtons.forEach(function(btn) {
          var btnBankId = btn.id.replace('bank-btn-', '');
          var check = document.getElementById('bank-check-' + btnBankId);
          if (btnBankId === bankId) {
            btn.style.borderColor = '#2563eb';
            btn.style.background = '#eff6ff';
            if (check) check.style.display = 'flex';
          } else {
            btn.style.borderColor = '#e5e7eb';
            btn.style.background = 'white';
            if (check) check.style.display = 'none';
          }
        });
      };

      // Handle shipping checkbox
      const shippingCheckbox = document.getElementById('add-shipping-${element.id}');
      if (shippingCheckbox) {
        shippingCheckbox.addEventListener('change', function(e) {
          addShipping = e.target.checked;
          const shippingCost = document.getElementById('shipping-cost-${element.id}');
          const totalEl = document.getElementById('total-amount-${element.id}');
          const buttonTotalEl = document.getElementById('button-total-${element.id}');

          if (shippingCost) shippingCost.style.display = addShipping ? 'flex' : 'none';

          const baseAmount = ${displayProducts[0].price};
          const total = addShipping ? baseAmount + 10 : baseAmount;
          const formatted = '${currency}' === 'MYR' ? 'RM ' + total.toFixed(2) : '${currency} ' + total.toFixed(2);

          if (totalEl) totalEl.textContent = formatted;
          if (buttonTotalEl) buttonTotalEl.textContent = formatted;
        });
      }

      // Open checkout modal
      document.getElementById('${buttonId}').addEventListener('click', function() {
        document.getElementById('${checkoutModalId}').style.display = 'block';
        document.body.style.overflow = 'hidden';
      });

      // Open checkout modal (global function for onclick handlers)
      window.openCheckoutModal = function(modalId, productName, productPrice, productId) {
        document.getElementById(modalId).style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Fetch banks when modal opens
        if (banks.length === 0) {
          window.fetchBanks_${sanitizedId}();
        }
      };

      // Close checkout modal
      window.closeCheckoutModal = function(modalId) {
        document.getElementById(modalId).style.display = 'none';
        document.body.style.overflow = 'auto';
      };

      // Handle checkout form submission
      document.getElementById('checkout-form-${element.id}').addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('customer-email-${element.id}').value;
        const phone = document.getElementById('customer-phone-${element.id}').value;
        const bankId = document.getElementById('selected-bank-${element.id}').value;
        const submitButton = e.target.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;

        // Validate bank selection
        if (!bankId) {
          document.getElementById('bank-error-${element.id}').style.display = 'block';
          return;
        }

        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<span style="display: inline-block; width: 1rem; height: 1rem; border: 2px solid white; border-top-color: transparent; border-radius: 50%; animation: spin 0.6s linear infinite;"></span> Processing...';

        try {
          // Build payment payload for public API
          const payload = {
            project_id: projectId,
            product_id: '${displayProducts[0].id || ''}',
            product_name: '${displayProducts[0].name}',
            product_price: addShipping ? ${displayProducts[0].price} + 10 : ${displayProducts[0].price},
            payment_service_id: bankId,
            customer_name: 'Customer',
            customer_email: email && email.trim() ? email.trim() : '',
            customer_phone: phone && phone.trim() ? phone.trim() : '',
          };

          console.log('Creating payment with payload:', payload);

          // Create payment and get redirect URL
          const createResponse = await fetch('/api/payments/create-public', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          console.log('Response status:', createResponse.status);

          const createResult = await createResponse.json();
          console.log('Response data:', createResult);

          if (!createResult.success || !createResult.redirect_url) {
            console.error('Payment creation failed. Full details:', createResult.details || createResult);
            throw new Error(createResult.error || 'Failed to create payment');
          }

          // Redirect to LeanX bank page
          window.location.href = createResult.redirect_url;

        } catch (error) {
          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonText;
          // Show the actual error message from the API
          const errorMessage = error.message || '${failureMessage}';
          console.error('Payment error details:', error);
          console.error('Error message:', errorMessage);
          alert(errorMessage);
        }
      });

      ${enableBumpOffer && bumpOfferName ? `
      // Accept bump offer
      window.acceptBumpOffer = async function(elemId) {
        bumpOfferAccepted = true;
        document.getElementById('${bumpModalId}').style.display = 'none';

        const cardNumber = document.getElementById('card-number-${element.id}').value.replace(/\\s/g, '');
        const expiryDate = document.getElementById('expiry-date-${element.id}').value.replace(/\\//g, '');
        const cvv = document.getElementById('cvv-${element.id}').value;

        await processPayment(transactionId, cardNumber, expiryDate, cvv, true);
      };

      // Decline bump offer
      window.declineBumpOffer = async function(elemId) {
        bumpOfferAccepted = false;
        document.getElementById('${bumpModalId}').style.display = 'none';

        const cardNumber = document.getElementById('card-number-${element.id}').value.replace(/\\s/g, '');
        const expiryDate = document.getElementById('expiry-date-${element.id}').value.replace(/\\//g, '');
        const cvv = document.getElementById('cvv-${element.id}').value;

        await processPayment(transactionId, cardNumber, expiryDate, cvv, false);
      };
      ` : ''}

      // Process payment
      async function processPayment(txnId, cardNumber, expiryDate, cvv, acceptedBump = false) {
        try {
          const response = await fetch('/api/payments/process', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              transactionId: txnId,
              cardNumber: cardNumber,
              expiryDate: expiryDate,
              cvv: cvv
            })
          });

          const result = await response.json();

          if (result.success) {
            alert('${successMessage}');
            // Reset form
            document.getElementById('checkout-form-${element.id}').reset();
          } else {
            alert('${failureMessage}');
          }
        } catch (error) {
          alert('${failureMessage}');
          console.error('Payment processing error:', error);
        } finally {
          document.body.style.overflow = 'auto';
        }
      }

      // Check for order reference in URL (customer returned from payment)
      const urlParams = new URLSearchParams(window.location.search);
      const orderRef = urlParams.get('order');

      if (orderRef) {
        // Remove order param from URL without page reload
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);

        // Check payment status from database
        fetch('/api/payments/check-status?order=' + orderRef)
          .then(response => response.json())
          .then(data => {
            if (data.status === 'completed' || data.status === 'paid') {
              alert('Payment successful! Your order reference is: ' + orderRef + '\\n\\nThank you for your purchase!');
            } else if (data.status === 'failed' || data.status === 'cancelled') {
              alert('Payment was cancelled or failed.\\n\\nOrder reference: ' + orderRef + '\\n\\nPlease try again if you wish to complete your purchase.');
            } else {
              // Payment is still pending/processing
              alert('Your payment is being processed.\\n\\nOrder reference: ' + orderRef + '\\n\\nYou will receive a confirmation email shortly.');
            }
          })
          .catch(error => {
            console.error('Error checking payment status:', error);
            alert('Your payment is being processed.\\n\\nOrder reference: ' + orderRef + '\\n\\nYou will receive a confirmation email shortly.');
          });
      }
    })();
  </script>
</section>`;
}

/**
 * Generate Announcement Bar HTML
 */
function generateAnnouncementBarHTML(element: Element): string {
  const {
    message,
    bgColor,
    textColor,
    showCountdown,
    countdownLabel,
    countdownEndDate,
    isSticky,
    showCloseButton,
    link,
    linkText
  } = element.props;

  const stickyStyle = isSticky ? 'position: sticky; top: 0; z-index: 50;' : '';

  return `
<div
  id="announcement-${element.id}"
  style="background-color: ${bgColor}; color: ${textColor}; padding: 0.75rem 1rem; ${stickyStyle}"
>
  <div style="max-width: 80rem; margin: 0 auto; display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap; position: relative;">
    <!-- Main centered content -->
    <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap;">
      <span style="font-weight: 500; text-align: center;">${message}</span>
      ${showCountdown && countdownEndDate ? `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          ${countdownLabel ? `<span style="font-size: 0.875rem; opacity: 0.9;">${countdownLabel}</span>` : ''}
          <div id="countdown-${element.id}" style="display: flex; gap: 0.25rem; font-family: monospace;">
            <div style="background: rgba(0,0,0,0.2); padding: 0.25rem 0.5rem; border-radius: 0.25rem; min-width: 2.5rem; text-align: center;">
              <span class="days" style="font-weight: bold;">00</span><span style="font-size: 0.75rem; opacity: 0.75;">d</span>
            </div>
            <span style="font-weight: bold;">:</span>
            <div style="background: rgba(0,0,0,0.2); padding: 0.25rem 0.5rem; border-radius: 0.25rem; min-width: 2.5rem; text-align: center;">
              <span class="hours" style="font-weight: bold;">00</span><span style="font-size: 0.75rem; opacity: 0.75;">h</span>
            </div>
            <span style="font-weight: bold;">:</span>
            <div style="background: rgba(0,0,0,0.2); padding: 0.25rem 0.5rem; border-radius: 0.25rem; min-width: 2.5rem; text-align: center;">
              <span class="minutes" style="font-weight: bold;">00</span><span style="font-size: 0.75rem; opacity: 0.75;">m</span>
            </div>
            <span style="font-weight: bold;">:</span>
            <div style="background: rgba(0,0,0,0.2); padding: 0.25rem 0.5rem; border-radius: 0.25rem; min-width: 2.5rem; text-align: center;">
              <span class="seconds" style="font-weight: bold;">00</span><span style="font-size: 0.75rem; opacity: 0.75;">s</span>
            </div>
          </div>
        </div>
      ` : ''}
      ${link && linkText ? `
        <a href="${link}" style="text-decoration: underline; font-weight: 600; color: inherit;">${linkText}</a>
      ` : ''}
    </div>
    <!-- Close Button - Absolute positioned to the right -->
    ${showCloseButton ? `
      <button
        onclick="document.getElementById('announcement-${element.id}').style.display='none'"
        style="position: absolute; right: 0; padding: 0.25rem; background: transparent; border: none; cursor: pointer; color: inherit; font-size: 1.25rem; transition: opacity 0.2s;"
        onmouseover="this.style.opacity='0.7'"
        onmouseout="this.style.opacity='1'"
        aria-label="Close announcement"
      >&times;</button>
    ` : ''}
  </div>
</div>
${showCountdown && countdownEndDate ? `
<script>
  (function() {
    const countdownEl = document.getElementById('countdown-${element.id}');
    const endDate = new Date('${countdownEndDate}').getTime();

    function updateCountdown() {
      const now = new Date().getTime();
      const difference = endDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        countdownEl.querySelector('.days').textContent = String(days).padStart(2, '0');
        countdownEl.querySelector('.hours').textContent = String(hours).padStart(2, '0');
        countdownEl.querySelector('.minutes').textContent = String(minutes).padStart(2, '0');
        countdownEl.querySelector('.seconds').textContent = String(seconds).padStart(2, '0');
      } else {
        countdownEl.innerHTML = '<span style="font-weight: bold;">EXPIRED</span>';
      }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  })();
</script>
` : ''}`;
}

/**
 * Generate Navigation HTML
 */
function generateNavigationHTML(element: Element): string {
  const {
    logo,
    logoText,
    menuItems,
    ctaButton,
    bgColor,
    textColor,
    isSticky,
    layout
  } = element.props;

  const stickyStyle = isSticky ? 'position: sticky; top: 0; z-index: 40;' : '';
  // Always use space-between for proper spacing between logo and nav items
  const menuGap = layout === 'center' ? '1.5rem' : '2rem';

  return `
<nav
  id="nav-${element.id}"
  style="background-color: ${bgColor}; color: ${textColor}; ${stickyStyle}"
>
  <div style="max-width: 80rem; margin: 0 auto; padding: 0 1rem;">
    <div style="display: flex; align-items: center; justify-content: space-between; height: 4rem;">
      <!-- Logo -->
      <div style="display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0;">
        ${logo ? `<img src="${logo}" alt="${logoText}" style="height: 2rem;">` : ''}
        <span style="font-size: 1.25rem; font-weight: bold;">${logoText}</span>
      </div>

      <!-- Desktop Menu -->
      <div id="menu-${element.id}" style="display: none; align-items: center; gap: ${menuGap};">
        ${menuItems.map((item: any) => `
          <a href="${item.url}" style="color: ${textColor}; text-decoration: none; font-weight: 500; transition: opacity 0.2s; white-space: nowrap;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'">${item.label}</a>
        `).join('')}
        ${ctaButton ? `
          <a href="${ctaButton.url}" class="button button-primary" style="padding: 0.5rem 1.5rem; white-space: nowrap;">${ctaButton.text}</a>
        ` : ''}
      </div>

      <!-- Mobile Menu Button -->
      <button
        id="mobile-menu-btn-${element.id}"
        onclick="document.getElementById('mobile-menu-${element.id}').style.display = document.getElementById('mobile-menu-${element.id}').style.display === 'none' ? 'block' : 'none'"
        style="padding: 0.5rem; background: transparent; border: none; cursor: pointer; color: ${textColor};"
      >
        <svg style="width: 1.5rem; height: 1.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div id="mobile-menu-${element.id}" style="display: none; padding-bottom: 1rem;">
      ${menuItems.map((item: any) => `
        <a href="${item.url}" style="display: block; padding: 0.75rem 0; color: ${textColor}; text-decoration: none; font-weight: 500;">${item.label}</a>
      `).join('')}
      ${ctaButton ? `
        <a href="${ctaButton.url}" class="button button-primary" style="display: inline-block; margin-top: 0.5rem; padding: 0.5rem 1.5rem;">${ctaButton.text}</a>
      ` : ''}
    </div>
  </div>
</nav>
<script>
  // Show desktop menu on larger screens
  function checkMenuDisplay() {
    const desktopMenu = document.getElementById('menu-${element.id}');
    const mobileBtn = document.getElementById('mobile-menu-btn-${element.id}');
    if (window.innerWidth >= 768) {
      desktopMenu.style.display = 'flex';
      mobileBtn.style.display = 'none';
    } else {
      desktopMenu.style.display = 'none';
      mobileBtn.style.display = 'block';
    }
  }
  checkMenuDisplay();
  window.addEventListener('resize', checkMenuDisplay);
</script>`;
}

/**
 * Generate Pricing HTML
 */
function generatePricingHTML(element: Element): string {
  const {
    title,
    subtitle,
    plans,
    layout,
    backgroundImage,
    backgroundOpacity = 70,
    bgColor = '#000000',
    enablePaymentIntegration = false
  } = element.props;

  const checkoutModalId = `pricing-checkout-modal-${element.id}`;

  if (layout === 'cards') {
    return `
<section id="${element.type}-${element.order}" style="position: relative; overflow: hidden; padding: 5rem 1rem; background: #f9fafb; scroll-margin-top: 4rem;">
  ${backgroundImage ? `
  <div style="position: absolute; inset: 0; background-image: url(${backgroundImage}); background-size: cover; background-position: center;"></div>
  <div style="position: absolute; inset: 0; background-color: ${bgColor}; opacity: ${backgroundOpacity / 100};"></div>
  ` : ''}
  <div style="max-width: 80rem; margin: 0 auto; position: relative; z-index: 10;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 3rem;">
      <h2 style="font-size: 2.25rem; font-weight: bold; color: #111; margin-bottom: 1rem;">${title}</h2>
      ${subtitle ? `<p style="font-size: 1.25rem; color: #666; max-width: 42rem; margin: 0 auto;">${subtitle}</p>` : ''}
    </div>

    <!-- Pricing Cards -->
    <div class="pricing-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; max-width: 1200px; margin: 0 auto;">
      ${plans.map((plan: any) => `
        <div style="background: white; border-radius: 1rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); padding: 2rem; display: flex; flex-direction: column; ${plan.highlighted ? 'border: 2px solid #3b82f6; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);' : ''}">
          ${plan.highlighted ? `
            <div style="background: #3b82f6; color: white; font-size: 0.875rem; font-weight: 600; padding: 0.25rem 0.75rem; border-radius: 9999px; align-self: flex-start; margin-bottom: 1rem;">Most Popular</div>
          ` : ''}
          <h3 style="font-size: 1.5rem; font-weight: bold; color: #111; margin-bottom: 0.5rem;">${plan.name}</h3>
          <p style="color: #666; margin-bottom: 1.5rem;">${plan.description}</p>
          <div style="margin-bottom: 1.5rem;">
            <span style="font-size: 3rem; font-weight: bold; color: #111;">${plan.currency} ${plan.price}</span>
            <span style="color: #666; margin-left: 0.5rem;">/ ${plan.period}</span>
          </div>
          <ul style="list-style: none; margin-bottom: 2rem; flex: 1;">
            ${plan.features.map((feature: string) => `
              <li style="display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.75rem;">
                <svg style="width: 1.25rem; height: 1.25rem; color: #10b981; flex-shrink: 0; margin-top: 0.125rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span style="color: #374151;">${feature}</span>
              </li>
            `).join('')}
          </ul>
          ${enablePaymentIntegration ? `
            <button
              onclick="openCheckoutModal('${checkoutModalId}', '${plan.name}', ${plan.priceNumeric || parseFloat(plan.price) || 0}, 'plan-${plan.name}')"
              style="
                width: 100%;
                padding: 0.75rem 1.5rem;
                background-color: ${plan.highlighted ? '#3b82f6' : 'transparent'};
                color: ${plan.highlighted ? 'white' : '#3b82f6'};
                border: ${plan.highlighted ? 'none' : '2px solid #3b82f6'};
                border-radius: 0.5rem;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s;
                text-align: center;
              "
              onmouseover="this.style.transform='scale(1.05)'"
              onmouseout="this.style.transform='scale(1)'"
            >
              ${plan.buttonText}
            </button>
          ` : `
            <a href="${plan.buttonUrl}" style="display: block; width: 100%; padding: 0.75rem 1.5rem; background-color: ${plan.highlighted ? '#3b82f6' : 'transparent'}; color: ${plan.highlighted ? 'white' : '#3b82f6'}; border: ${plan.highlighted ? 'none' : '2px solid #3b82f6'}; border-radius: 0.5rem; font-weight: 600; text-align: center; text-decoration: none;">${plan.buttonText}</a>
          `}
        </div>
      `).join('')}
    </div>
  </div>
</section>

${enablePaymentIntegration ? `
<!-- Checkout Modal for Pricing -->
<div id="${checkoutModalId}" style="display: none; position: fixed; inset: 0; z-index: 50; background: rgba(0, 0, 0, 0.5); padding: 1rem;">
  <div style="display: flex; align-items: center; justify-center; min-height: 100vh;">
    <div style="background: white; border-radius: 0.5rem; max-width: 32rem; width: 100%; max-height: 90vh; overflow-y: auto;">
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.5rem; border-bottom: 1px solid #e5e7eb;">
        <h2 style="font-size: 1.25rem; font-weight: 600; margin: 0;">Complete Purchase</h2>
        <button onclick="if(window.closeCheckoutModal) closeCheckoutModal('${checkoutModalId}')" style="background: none; border: none; cursor: pointer; color: #9ca3af; font-size: 1.5rem;">&times;</button>
      </div>
      <div style="padding: 1.5rem; text-align: center;">
        <p style="color: #6b7280; margin-bottom: 1rem;">Checkout modal opened successfully!</p>
        <p style="color: #6b7280; font-size: 0.875rem;">Add a Payment Button element to enable full checkout functionality.</p>
      </div>
    </div>
  </div>
</div>

<script>
  // Define openCheckoutModal for pricing if not already defined
  if (typeof window.openCheckoutModal === 'undefined') {
    window.openCheckoutModal = function(modalId, productName, productPrice, productId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Try to trigger bank fetching if available
        // Look for any fetchBanks function and call it
        for (let key in window) {
          if (key.startsWith('fetchBanks_') && typeof window[key] === 'function') {
            try {
              window[key]();
              break;
            } catch (e) {
              console.log('Could not fetch banks:', e);
            }
          }
        }
      }
    };
  }

  // Define closeCheckoutModal if not already defined
  if (typeof window.closeCheckoutModal === 'undefined') {
    window.closeCheckoutModal = function(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    };
  }
</script>
` : ''}`;
  } else {
    // Table layout
    return `
<section id="${element.type}-${element.order}" style="position: relative; overflow: hidden; padding: 5rem 1rem; background: #f9fafb; scroll-margin-top: 4rem;">
  ${backgroundImage ? `
  <div style="position: absolute; inset: 0; background-image: url(${backgroundImage}); background-size: cover; background-position: center;"></div>
  <div style="position: absolute; inset: 0; background-color: ${bgColor}; opacity: ${backgroundOpacity / 100};"></div>
  ` : ''}
  <div style="max-width: 80rem; margin: 0 auto; position: relative; z-index: 10;">
    <div style="text-align: center; margin-bottom: 3rem;">
      <h2 style="font-size: 2.25rem; font-weight: bold; color: #111; margin-bottom: 1rem;">${title}</h2>
      ${subtitle ? `<p style="font-size: 1.25rem; color: #666; max-width: 42rem; margin: 0 auto;">${subtitle}</p>` : ''}
    </div>
    <div style="overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 0.5rem; overflow: hidden;">
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="padding: 1rem; text-align: left; font-weight: 600;">Plan</th>
            <th style="padding: 1rem; text-align: left; font-weight: 600;">Price</th>
            <th style="padding: 1rem; text-align: left; font-weight: 600;">Features</th>
            <th style="padding: 1rem; text-align: left; font-weight: 600;">Action</th>
          </tr>
        </thead>
        <tbody>
          ${plans.map((plan: any, index: number) => `
            <tr style="${index % 2 === 0 ? 'background: white;' : 'background: #f9fafb;'}">
              <td style="padding: 1rem;">
                <div style="font-weight: bold; color: #111;">${plan.name}</div>
                <div style="font-size: 0.875rem; color: #666;">${plan.description}</div>
              </td>
              <td style="padding: 1rem;">
                <div style="font-size: 1.5rem; font-weight: bold; color: #111;">${plan.currency}${plan.price}</div>
                <div style="font-size: 0.875rem; color: #666;">/ ${plan.period}</div>
              </td>
              <td style="padding: 1rem;">
                <ul style="list-style: none; padding: 0;">
                  ${plan.features.slice(0, 3).map((feature: string) => `
                    <li style="font-size: 0.875rem; color: #374151; margin-bottom: 0.25rem;">✓ ${feature}</li>
                  `).join('')}
                  ${plan.features.length > 3 ? `<li style="font-size: 0.875rem; color: #666;">+${plan.features.length - 3} more</li>` : ''}
                </ul>
              </td>
              <td style="padding: 1rem;">
                ${enablePaymentIntegration ? `
                  <button
                    onclick="openCheckoutModal('${checkoutModalId}', '${plan.name}', ${plan.priceNumeric || parseFloat(plan.price) || 0}, 'plan-${plan.name}')"
                    style="
                      padding: 0.5rem 1.25rem;
                      background-color: ${plan.highlighted ? '#3b82f6' : 'transparent'};
                      color: ${plan.highlighted ? 'white' : '#3b82f6'};
                      border: ${plan.highlighted ? 'none' : '2px solid #3b82f6'};
                      border-radius: 0.375rem;
                      font-weight: 600;
                      cursor: pointer;
                    "
                  >
                    ${plan.buttonText}
                  </button>
                ` : `
                  <a href="${plan.buttonUrl}" style="display: inline-block; padding: 0.5rem 1.25rem; background-color: ${plan.highlighted ? '#3b82f6' : 'transparent'}; color: ${plan.highlighted ? 'white' : '#3b82f6'}; border: ${plan.highlighted ? 'none' : '2px solid #3b82f6'}; border-radius: 0.375rem; font-weight: 600; text-decoration: none;">${plan.buttonText}</a>
                `}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  </div>
</section>

${enablePaymentIntegration ? `
<!-- Checkout Modal for Pricing -->
<div id="${checkoutModalId}" style="display: none; position: fixed; inset: 0; z-index: 50; background: rgba(0, 0, 0, 0.5); padding: 1rem;">
  <div style="display: flex; align-items: center; justify-center; min-height: 100vh;">
    <div style="background: white; border-radius: 0.5rem; max-width: 32rem; width: 100%; max-height: 90vh; overflow-y: auto;">
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.5rem; border-bottom: 1px solid #e5e7eb;">
        <h2 style="font-size: 1.25rem; font-weight: 600; margin: 0;">Complete Purchase</h2>
        <button onclick="if(window.closeCheckoutModal) closeCheckoutModal('${checkoutModalId}')" style="background: none; border: none; cursor: pointer; color: #9ca3af; font-size: 1.5rem;">&times;</button>
      </div>
      <div style="padding: 1.5rem; text-align: center;">
        <p style="color: #6b7280; margin-bottom: 1rem;">Checkout modal opened successfully!</p>
        <p style="color: #6b7280; font-size: 0.875rem;">Add a Payment Button element to enable full checkout functionality.</p>
      </div>
    </div>
  </div>
</div>

<script>
  // Define openCheckoutModal for pricing if not already defined
  if (typeof window.openCheckoutModal === 'undefined') {
    window.openCheckoutModal = function(modalId, productName, productPrice, productId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Try to trigger bank fetching if available
        // Look for any fetchBanks function and call it
        for (let key in window) {
          if (key.startsWith('fetchBanks_') && typeof window[key] === 'function') {
            try {
              window[key]();
              break;
            } catch (e) {
              console.log('Could not fetch banks:', e);
            }
          }
        }
      }
    };
  }

  // Define closeCheckoutModal if not already defined
  if (typeof window.closeCheckoutModal === 'undefined') {
    window.closeCheckoutModal = function(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
    };
  }
</script>
` : ''}`;
  }
}

/**
 * Generate Footer HTML
 */
function generateFooterHTML(element: Element): string {
  const {
    logo,
    logoText,
    description,
    columns,
    socialLinks,
    copyright,
    bgColor,
    textColor,
    backgroundImage,
    backgroundOpacity = 70
  } = element.props;

  const socialIcons: any = {
    facebook: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
    twitter: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z',
    instagram: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 2h11A4.5 4.5 0 0122 6.5v11a4.5 4.5 0 01-4.5 4.5h-11A4.5 4.5 0 012 17.5v-11A4.5 4.5 0 016.5 2z',
    linkedin: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z',
    youtube: 'M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z M9.75 15.02l5.75-3.27-5.75-3.27v6.54z'
  };

  return `
<footer style="position: relative; overflow: hidden; background-color: ${bgColor || '#1f2937'}; color: ${textColor || '#f3f4f6'}; padding: 3rem 1rem 1.5rem;">
  ${backgroundImage ? `
  <div style="position: absolute; inset: 0; background-image: url(${backgroundImage}); background-size: cover; background-position: center;"></div>
  <div style="position: absolute; inset: 0; background-color: ${bgColor || '#1f2937'}; opacity: ${backgroundOpacity / 100};"></div>
  ` : ''}
  <div style="max-width: 80rem; margin: 0 auto; position: relative; z-index: 10;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-bottom: 2rem;">
      <!-- Logo & Description -->
      <div>
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
          ${logo ? `<img src="${logo}" alt="${logoText}" style="height: 2rem;">` : ''}
          <span style="font-size: 1.25rem; font-weight: bold;">${logoText}</span>
        </div>
        ${description ? `<p style="color: ${textColor || '#d1d5db'}; font-size: 0.875rem; line-height: 1.6;">${description}</p>` : ''}

        ${socialLinks && socialLinks.length > 0 ? `
          <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
            ${socialLinks.map((social: any) => `
              <a href="${social.url}" style="color: ${textColor || '#d1d5db'}; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">
                <svg style="width: 1.5rem; height: 1.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="${socialIcons[social.platform] || ''}"></path>
                </svg>
              </a>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <!-- Link Columns -->
      ${columns.map((column: any) => `
        <div>
          <h4 style="font-weight: 600; margin-bottom: 1rem; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">${column.title}</h4>
          <ul style="list-style: none; padding: 0;">
            ${column.links.map((link: any) => `
              <li style="margin-bottom: 0.75rem;">
                <a href="${link.url}" style="color: ${textColor || '#d1d5db'}; font-size: 0.875rem; text-decoration: none; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.7'" onmouseout="this.style.opacity='1'">${link.label}</a>
              </li>
            `).join('')}
          </ul>
        </div>
      `).join('')}
    </div>

    <!-- Copyright -->
    <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 1.5rem; text-align: center;">
      <p style="color: ${textColor || '#9ca3af'}; font-size: 0.875rem;">${copyright}</p>
    </div>
  </div>
</footer>`;
}

/**
 * Generate Lead Form HTML
 */
function generateLeadFormHTML(element: Element): string {
  const {
    title = 'Get In Touch',
    description = 'Fill out the form below and we\'ll get back to you soon.',
    nameLabel = 'Your Name',
    emailLabel = 'Email Address',
    phoneLabel = 'Phone Number (optional)',
    messageLabel = 'Message (optional)',
    submitButtonText = 'Submit',
    submitButtonColor = '#2563eb',
    successMessage = 'Thank you! We\'ll be in touch soon.',
    fields = {
      showPhone: true,
      showMessage: true,
      phoneRequired: false,
      messageRequired: false,
    },
    bgColor = '#ffffff',
    google_sheets_enabled = false,
    google_sheets_url = '',
  } = element.props;

  const sanitizedId = sanitizeId(element.id);
  const formId = `lead-form-${sanitizedId}`;

  return `
<section style="background-color: ${bgColor}; padding: 4rem 1rem;" id="${element.type}-${element.order}">
  <div class="container" style="max-width: 42rem; margin: 0 auto;">
    <div style="background: white; border-radius: 0.5rem; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); padding: 2.5rem;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 2rem;">
        <h2 style="font-size: 2rem; font-weight: bold; color: #111827; margin-bottom: 0.5rem;">${title}</h2>
        ${description ? `<p style="color: #6b7280; font-size: 1rem;">${description}</p>` : ''}
      </div>

      <!-- Form -->
      <form id="${formId}" onsubmit="return submitLeadForm_${sanitizedId}(event)">
        <!-- Name Field -->
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">
            ${nameLabel} <span style="color: #dc2626;">*</span>
          </label>
          <input
            type="text"
            id="name-${sanitizedId}"
            name="name"
            required
            placeholder="John Doe"
            style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem; transition: border-color 0.2s;"
            onfocus="this.style.borderColor='#2563eb'"
            onblur="this.style.borderColor='#d1d5db'"
          >
        </div>

        <!-- Email Field -->
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">
            ${emailLabel} <span style="color: #dc2626;">*</span>
          </label>
          <input
            type="email"
            id="email-${sanitizedId}"
            name="email"
            required
            placeholder="john@example.com"
            style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem; transition: border-color 0.2s;"
            onfocus="this.style.borderColor='#2563eb'"
            onblur="this.style.borderColor='#d1d5db'"
          >
          <p style="font-size: 0.75rem; color: #6b7280; margin-top: 0.25rem;">We'll never share your email with anyone else.</p>
        </div>

        <!-- Phone Field (conditional) -->
        ${fields.showPhone ? `
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">
            ${phoneLabel}${fields.phoneRequired ? ' <span style="color: #dc2626;">*</span>' : ''}
          </label>
          <input
            type="tel"
            id="phone-${sanitizedId}"
            name="phone"
            ${fields.phoneRequired ? 'required' : ''}
            placeholder="+60123456789"
            style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem; transition: border-color 0.2s;"
            onfocus="this.style.borderColor='#2563eb'"
            onblur="this.style.borderColor='#d1d5db'"
          >
        </div>
        ` : ''}

        <!-- Message Field (conditional) -->
        ${fields.showMessage ? `
        <div style="margin-bottom: 1.5rem;">
          <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.5rem;">
            ${messageLabel}${fields.messageRequired ? ' <span style="color: #dc2626;">*</span>' : ''}
          </label>
          <textarea
            id="message-${sanitizedId}"
            name="message"
            ${fields.messageRequired ? 'required' : ''}
            rows="4"
            placeholder="Tell us more about your inquiry..."
            style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem; resize: vertical; transition: border-color 0.2s;"
            onfocus="this.style.borderColor='#2563eb'"
            onblur="this.style.borderColor='#d1d5db'"
          ></textarea>
        </div>
        ` : ''}

        <!-- Submit Button -->
        <button
          type="submit"
          id="submit-${sanitizedId}"
          style="width: 100%; padding: 0.875rem; background-color: ${submitButtonColor}; color: white; border: none; border-radius: 0.5rem; font-size: 1rem; font-weight: 600; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"
          onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 10px 15px -3px rgba(0, 0, 0, 0.1)'"
          onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.1)'"
        >
          ${submitButtonText}
        </button>

        <!-- Status Messages -->
        <div id="status-${sanitizedId}" style="margin-top: 1rem; display: none; padding: 0.75rem; border-radius: 0.5rem; font-size: 0.875rem;"></div>
      </form>

      <!-- Privacy Note -->
      <p style="text-align: center; font-size: 0.75rem; color: #9ca3af; margin-top: 1.5rem;">
        🔒 Your information is secure and will never be shared.
      </p>
    </div>
  </div>

  <!-- Lead Form JavaScript -->
  <script>
    (function() {
      window.submitLeadForm_${sanitizedId} = async function(event) {
        event.preventDefault();

        const form = document.getElementById('${formId}');
        const submitBtn = document.getElementById('submit-${sanitizedId}');
        const statusDiv = document.getElementById('status-${sanitizedId}');

        // Get form data
        const name = document.getElementById('name-${sanitizedId}').value;
        const email = document.getElementById('email-${sanitizedId}').value;
        const phone = ${fields.showPhone ? `document.getElementById('phone-${sanitizedId}').value` : `''`};
        const message = ${fields.showMessage ? `document.getElementById('message-${sanitizedId}').value` : `''`};

        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'not-allowed';

        try {
          // Submit to API
          const response = await fetch('/api/leads/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              project_id: window.__PROJECT_ID__,
              element_id: '${element.id}',
              customer_name: name,
              customer_email: email,
              customer_phone: phone,
              message: message,
            }),
          });

          const data = await response.json();

          // Log response for debugging
          console.log('Lead submission response:', data);

          if (response.ok) {
            // Success
            statusDiv.style.display = 'block';
            statusDiv.style.backgroundColor = '#d1fae5';
            statusDiv.style.color = '#065f46';
            statusDiv.style.borderLeft = '4px solid #10b981';
            statusDiv.textContent = '${successMessage.replace(/'/g, "\\'")}';

            // Log Google Sheets sync status
            if (data.google_sheets_synced) {
              console.log('Successfully synced to Google Sheets');
            } else {
              console.warn('Failed to sync to Google Sheets', data.debug);
            }

            // Reset form
            form.reset();

            // Track analytics
            if (typeof gtag !== 'undefined') {
              gtag('event', 'generate_lead', {
                event_category: 'Lead Form',
                event_label: '${element.id}',
              });
            }

            // Scroll to success message
            statusDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } else {
            // Error
            throw new Error(data.error || 'Submission failed');
          }
        } catch (error) {
          console.error('Lead submission error:', error);

          statusDiv.style.display = 'block';
          statusDiv.style.backgroundColor = '#fee2e2';
          statusDiv.style.color = '#991b1b';
          statusDiv.style.borderLeft = '4px solid #ef4444';
          statusDiv.textContent = error.message === 'You have already submitted this form'
            ? 'You have already submitted this form. Thank you!'
            : 'Sorry, there was an error submitting the form. Please try again.';
        } finally {
          // Re-enable button
          submitBtn.disabled = false;
          submitBtn.textContent = '${submitButtonText}';
          submitBtn.style.opacity = '1';
          submitBtn.style.cursor = 'pointer';
        }
      };
    })();
  </script>
</section>`;
}

/**
 * Generate WhatsApp button HTML
 */
function generateWhatsAppButtonHTML(element: Element): string {
  const {
    phoneNumber = '60123456789',
    message = '',
    buttonText = 'Chat on WhatsApp',
    buttonColor = '#25D366',
    buttonSize = 'md',
    position = 'fixed',
    showIcon = true,
    customIcon = '',
    tooltipText = 'Need help? Chat with us!',
    showHeadline = false,
    headlineText = 'Want to know more about this product?',
    headlineColor = '#1f2937',
  } = element.props;

  // Ensure fixedPosition has a valid value (fallback to bottom-right if undefined/invalid)
  const validPositions = ['bottom-right', 'bottom-left', 'top-right', 'top-left'];
  const fixedPosition = validPositions.includes(element.props.fixedPosition)
    ? element.props.fixedPosition
    : 'bottom-right';

  // Clean phone number (remove all non-digit characters)
  const cleanPhone = phoneNumber.replace(/\D/g, '');

  // Encode the message for URL
  const encodedMessage = message ? encodeURIComponent(message) : '';

  // Construct WhatsApp URL
  const whatsappUrl = `https://wa.me/${cleanPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`;

  // Size classes
  const sizeStyles = {
    sm: 'padding: 0.5rem 1rem; font-size: 0.875rem;',
    md: 'padding: 0.75rem 1.5rem; font-size: 1rem;',
    lg: 'padding: 1rem 2rem; font-size: 1.125rem;',
  };

  // Icon size
  const iconSizes = {
    sm: '16px',
    md: '20px',
    lg: '24px',
  };

  // Position classes for fixed
  const positionStyles = {
    'bottom-right': 'bottom: 1.5rem; right: 1.5rem;',
    'bottom-left': 'bottom: 1.5rem; left: 1.5rem;',
    'top-right': 'top: 1.5rem; right: 1.5rem;',
    'top-left': 'top: 1.5rem; left: 1.5rem;',
  };

  const buttonStyle = `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    ${sizeStyles[buttonSize as keyof typeof sizeStyles]}
    font-weight: 600;
    border-radius: 9999px;
    transition: all 0.3s ease;
    text-decoration: none;
    background-color: ${buttonColor};
    color: #ffffff;
    border: none;
    cursor: pointer;
    box-shadow: ${position === 'fixed' ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' : 'none'};
    ${position === 'fixed' ? 'z-index: 9999;' : ''}
  `;

  // Use different container styles - fixed needs position !important to override CSS rules
  const containerStyle = position === 'fixed'
    ? `position: fixed !important; ${positionStyles[fixedPosition as keyof typeof positionStyles]} z-index: 9999;`
    : 'padding: 5rem 1rem; text-align: center;';

  // Use div for fixed position to avoid section CSS rules
  const containerTag = position === 'fixed' ? 'div' : 'section';

  // WhatsApp icon SVG
  const whatsappIcon = `<svg width="${iconSizes[buttonSize as keyof typeof iconSizes]}" height="${iconSizes[buttonSize as keyof typeof iconSizes]}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
  </svg>`;

  const sanitizedId = sanitizeId(element.id);

  return `
<${containerTag} id="${element.type}-${element.order}" style="${containerStyle}">
  ${position === 'inline' && showHeadline ? `
  <div style="
    max-width: 42rem;
    margin: 0 auto 2rem auto;
  ">
    <h2 style="
      font-size: 2.5rem;
      font-weight: bold;
      line-height: 1.2;
      color: ${headlineColor};
      margin: 0 0 1rem 0;
      text-align: center;
    ">${headlineText}</h2>
  </div>
  ` : ''}

  ${position === 'fixed' && tooltipText ? `
  <div id="wa-tooltip-${sanitizedId}" style="
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-0.75rem);
    white-space: nowrap;
    background-color: #1f2937;
    color: #ffffff;
    font-size: 0.875rem;
    padding: 0.375rem 0.75rem;
    border-radius: 0.5rem;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
  ">
    ${tooltipText}
    <div style="
      position: absolute;
      bottom: -0.25rem;
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
      width: 0.5rem;
      height: 0.5rem;
      background-color: #1f2937;
    "></div>
  </div>
  ` : ''}

  <a
    href="${whatsappUrl}"
    target="_blank"
    rel="noopener noreferrer"
    id="wa-btn-${sanitizedId}"
    style="${buttonStyle}"
    onmouseover="this.style.transform='scale(1.05)'; ${position === 'fixed' && tooltipText ? `document.getElementById('wa-tooltip-${sanitizedId}').style.opacity='1';` : ''}"
    onmouseout="this.style.transform='scale(1)'; ${position === 'fixed' && tooltipText ? `document.getElementById('wa-tooltip-${sanitizedId}').style.opacity='0';` : ''}"
    onclick="if (typeof gtag !== 'undefined') { gtag('event', 'whatsapp_click', { event_category: 'WhatsApp', event_label: '${element.id}' }); }"
  >
    ${showIcon ? (customIcon ? `<img src="${customIcon}" alt="WhatsApp" style="width: ${iconSizes[buttonSize as keyof typeof iconSizes]}; height: ${iconSizes[buttonSize as keyof typeof iconSizes]};">` : whatsappIcon) : ''}
    <span>${buttonText}</span>
    ${position === 'fixed' ? `
    <span style="
      position: absolute;
      inset: 0;
      border-radius: 9999px;
      background-color: ${buttonColor};
      opacity: 0.2;
      animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
    "></span>
    ` : ''}
  </a>
</${containerTag}>

${position === 'fixed' ? `
<style>
  @keyframes ping {
    75%, 100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }
</style>
` : ''}`;
}

/**
 * Generate Form with Payment HTML
 */
function generateFormWithPaymentHTML(element: Element): string {
  const {
    title = 'Order Form',
    description = '',
    nameLabel = 'Name',
    mobileLabel = 'Mobile Number',
    emailLabel = 'Email',
    showName = true,
    showMobile = true,
    showEmail = true,
    nameRequired = true,
    mobileRequired = true,
    emailRequired = true,
    defaultCountryCode = 'MY',
    products = [],
    currency = 'MYR',
    submitButtonText = 'Complete Payment',
    submitButtonColor = '#ef4444',
    bgColor = '#ffffff',
    termsUrl = '#',
    policyUrl = '#',
    contactUrl = '#',
    companyName = 'Your Company Name',
    companyRegistration = 'Company Registration Number',
  } = element.props;

  const sanitizedId = sanitizeId(element.id);
  const formId = `payment-form-${sanitizedId}`;

  // Country codes mapping
  const countryCodes: Record<string, { dial: string; flag: string }> = {
    MY: { dial: '+60', flag: '🇲🇾' },
    SG: { dial: '+65', flag: '🇸🇬' },
    ID: { dial: '+62', flag: '🇮🇩' },
    TH: { dial: '+66', flag: '🇹🇭' },
    PH: { dial: '+63', flag: '🇵🇭' },
    VN: { dial: '+84', flag: '🇻🇳' },
    US: { dial: '+1', flag: '🇺🇸' },
    GB: { dial: '+44', flag: '🇬🇧' },
  };

  const selectedCountry = countryCodes[defaultCountryCode] || countryCodes['MY'];

  // Format currency helper
  const formatCurrency = (value: number) => {
    if (currency === 'MYR') {
      return `RM ${value.toFixed(2)}`;
    }
    return `${currency} ${value.toFixed(2)}`;
  };

  // Generate products HTML
  const productsHTML = products.map((product: any) => {
    const isOutOfStock = product.stock !== undefined && product.stock <= 0;

    const stockStatusHTML = isOutOfStock
      ? '<span style="color: #ef4444; font-weight: 500; font-size: 0.875rem;">Out of Stock</span>'
      : `
        <div style="display: flex; align-items: center; gap: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;">
          <button type="button" onclick="updateQty_${sanitizedId}('${product.id}', -1)" style="padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; color: #6b7280;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
          <span id="qty-${sanitizedId}-${product.id}" style="width: 2rem; text-align: center; font-weight: 500;">0</span>
          <button type="button" onclick="updateQty_${sanitizedId}('${product.id}', 1, ${product.stock || 999})" style="padding: 0.5rem 0.75rem; background: none; border: none; cursor: pointer; color: #6b7280;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>
      `;

    const amountHTML = isOutOfStock
      ? '<span style="color: #9ca3af;">-</span>'
      : `<span id="amount-${sanitizedId}-${product.id}">${formatCurrency(0)}</span>`;

    return `
      <div style="display: grid; grid-template-columns: 5fr 4fr 3fr; gap: 1rem; padding: 1rem; border-bottom: 1px solid #f3f4f6; align-items: center;">
        <div>
          <div style="font-weight: 500; color: #111827;">${product.name}</div>
          <div style="color: #3b82f6; font-size: 0.875rem; font-weight: 500;">${formatCurrency(product.price)}</div>
        </div>
        <div style="display: flex; justify-content: center;">${stockStatusHTML}</div>
        <div style="text-align: right; color: #111827; font-weight: 500;">${amountHTML}</div>
      </div>
    `;
  }).join('');

  // Products data for JavaScript
  const productsDataJS = JSON.stringify(products.map((product: any) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    stock: product.stock,
    currency: product.currency || currency,
  })));

  return `
<section style="background-color: ${bgColor}; padding: 2rem 1rem;" id="${element.type}-${element.order}">
  <div class="container" style="max-width: 42rem; margin: 0 auto;">
    ${title || description ? `
    <div style="text-align: center; margin-bottom: 1.5rem;">
      ${title ? `<h2 style="font-size: 1.5rem; font-weight: bold; color: #111827; margin-bottom: 0.5rem;">${title}</h2>` : ''}
      ${description ? `<p style="color: #6b7280;">${description}</p>` : ''}
    </div>
    ` : ''}

    <form id="${formId}" onsubmit="return submitPaymentForm_${sanitizedId}(event)">
      <!-- Customer Fields -->
      <div style="margin-bottom: 1.5rem;">
        ${showName ? `
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #111827; margin-bottom: 0.375rem;">
            ${nameLabel}${nameRequired ? '<span style="color: #ef4444;">*</span>' : ''}
          </label>
          <input type="text" id="name-${sanitizedId}" name="name" ${nameRequired ? 'required' : ''}
            style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem; box-sizing: border-box;"
            placeholder="Enter your name">
        </div>
        ` : ''}

        ${showMobile ? `
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #111827; margin-bottom: 0.375rem;">
            ${mobileLabel}${mobileRequired ? '<span style="color: #ef4444;">*</span>' : ''}
          </label>
          <div style="display: flex;">
            <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; border: 1px solid #d1d5db; border-right: none; border-radius: 0.5rem 0 0 0.5rem; background: #f9fafb;">
              <span style="font-size: 1.125rem;">${selectedCountry.flag}</span>
              <span style="color: #6b7280; font-size: 0.75rem;">▼</span>
            </div>
            <input type="tel" id="mobile-${sanitizedId}" name="mobile" ${mobileRequired ? 'required' : ''}
              style="flex: 1; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0 0.5rem 0.5rem 0; font-size: 1rem; box-sizing: border-box;"
              placeholder="012-345 6789">
          </div>
        </div>
        ` : ''}

        ${showEmail ? `
        <div style="margin-bottom: 1rem;">
          <label style="display: block; font-size: 0.875rem; font-weight: 500; color: #111827; margin-bottom: 0.375rem;">
            ${emailLabel}${emailRequired ? '<span style="color: #ef4444;">*</span>' : ''}
          </label>
          <input type="email" id="email-${sanitizedId}" name="email" ${emailRequired ? 'required' : ''}
            style="width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 0.5rem; font-size: 1rem; box-sizing: border-box;"
            placeholder="your@email.com">
        </div>
        ` : ''}
      </div>

      <!-- Products Table -->
      ${products.length > 0 ? `
      <div style="border: 1px solid #e5e7eb; border-radius: 0.5rem; overflow: hidden; margin-bottom: 1.5rem;">
        <div style="display: grid; grid-template-columns: 5fr 4fr 3fr; gap: 1rem; padding: 0.75rem 1rem; background: #f9fafb; border-bottom: 1px solid #e5e7eb;">
          <div style="font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Item</div>
          <div style="font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; text-align: center;">Qty</div>
          <div style="font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; text-align: right;">Amount</div>
        </div>
        ${productsHTML}
      </div>
      ` : `
      <div style="border: 2px dashed #d1d5db; border-radius: 0.5rem; padding: 2rem; margin-bottom: 1.5rem; text-align: center;">
        <p style="color: #6b7280;">No products configured.</p>
      </div>
      `}

      <!-- Total Amount -->
      <div style="background: #f9fafb; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1.5rem;">
        <div style="display: flex; justify-content: space-between; font-size: 1.125rem; font-weight: bold; color: #111827;">
          <span>Total Amount:</span>
          <span id="total-${sanitizedId}">${formatCurrency(0)}</span>
        </div>
        <p id="empty-msg-${sanitizedId}" style="color: #6b7280; font-size: 0.875rem; margin-top: 0.5rem;">Please select your items above.</p>
      </div>

      <!-- Security Badge -->
      <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; color: #6b7280; font-size: 0.875rem; margin-bottom: 1.5rem;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
        <span>Your payment is secured & encrypted</span>
      </div>

      <!-- Submit Button -->
      <button type="submit" id="submit-btn-${sanitizedId}"
        style="width: 100%; padding: 1rem; background-color: ${submitButtonColor}; color: white; border: none; border-radius: 0.5rem; font-size: 1.125rem; font-weight: 600; cursor: pointer; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">
        ${submitButtonText}
      </button>

      <!-- Status Messages -->
      <div id="status-${sanitizedId}" style="margin-top: 1rem; display: none; padding: 0.75rem; border-radius: 0.5rem; font-size: 0.875rem;"></div>
    </form>

    <!-- Bank Selection Checkout Modal -->
    <div id="checkout-modal-${sanitizedId}" style="display: none; position: fixed; inset: 0; z-index: 50; background: rgba(0, 0, 0, 0.5); padding: 1rem;">
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh;">
        <div style="background: white; border-radius: 0.5rem; max-width: 32rem; width: 100%; max-height: 90vh; overflow-y: auto;">
          <!-- Modal Header -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 1.5rem; border-bottom: 1px solid #e5e7eb;">
            <h2 style="font-size: 1.25rem; font-weight: 600; margin: 0;">Secure Checkout</h2>
            <button onclick="closeCheckoutModal_${sanitizedId}()" style="background: none; border: none; cursor: pointer; color: #9ca3af; font-size: 1.5rem;">&times;</button>
          </div>

          <!-- Modal Body -->
          <div style="padding: 1.5rem;">
            <!-- Order Summary -->
            <div style="background: #f9fafb; border-radius: 0.5rem; padding: 1rem; margin-bottom: 1.5rem;">
              <h3 style="font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.75rem;">Order Summary</h3>
              <div id="modal-order-summary-${sanitizedId}">
                <!-- Order items will be populated by JS -->
              </div>
              <div style="display: flex; justify-content: space-between; padding-top: 0.75rem; margin-top: 0.75rem; border-top: 1px solid #d1d5db;">
                <span style="font-weight: bold;">Total</span>
                <span id="modal-total-${sanitizedId}" style="font-weight: bold;">${formatCurrency(0)}</span>
              </div>
            </div>

            <!-- Bank Selection -->
            <div style="margin-bottom: 1.5rem;">
              <h3 style="font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 1rem;">Select Your Bank</h3>

              <!-- Loading State -->
              <div id="banks-loading-${sanitizedId}" style="display: flex; align-items: center; justify-content: center; padding: 2rem;">
                <div style="width: 2rem; height: 2rem; border: 3px solid #e5e7eb; border-top-color: #2563eb; border-radius: 50%; animation: spin 0.6s linear infinite;"></div>
              </div>

              <!-- Error State -->
              <div id="banks-error-${sanitizedId}" style="display: none; background: #fee2e2; border: 1px solid #fca5a5; border-radius: 0.375rem; padding: 1rem; text-align: center;">
                <p style="color: #dc2626; font-size: 0.875rem; margin: 0 0 0.5rem 0;">Failed to load banks</p>
                <button type="button" onclick="fetchBanks_${sanitizedId}()" style="font-size: 0.875rem; padding: 0.25rem 0.75rem; background: white; border: 1px solid #dc2626; color: #dc2626; border-radius: 0.25rem; cursor: pointer;">Retry</button>
              </div>

              <!-- Banks List -->
              <div id="banks-list-${sanitizedId}" style="display: none;">
                <!-- Banks will be dynamically inserted here -->
              </div>

              <input type="hidden" id="selected-bank-${sanitizedId}">
              <p id="bank-error-${sanitizedId}" style="display: none; font-size: 0.75rem; color: #dc2626; margin-top: 0.25rem;">Please select a bank</p>
            </div>

            <button
              type="button"
              id="proceed-payment-btn-${sanitizedId}"
              onclick="proceedToPayment_${sanitizedId}()"
              style="width: 100%; padding: 0.75rem; background: #2563eb; color: white; border: none; border-radius: 0.375rem; font-weight: 600; font-size: 1.125rem; cursor: pointer;"
            >
              Proceed to Secure Payment - <span id="modal-btn-total-${sanitizedId}">${formatCurrency(0)}</span>
            </button>

            <style>
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            </style>

            <div style="text-align: center; margin-top: 1rem;">
              <p style="font-size: 0.875rem; color: #6b7280; margin: 0.25rem 0;">
                <svg style="display: inline; width: 1rem; height: 1rem; vertical-align: middle;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                256-bit SSL Secure Payment
              </p>
              <p style="font-size: 0.75rem; color: #9ca3af; margin: 0.25rem 0;">Powered by LeanX</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Links -->
    <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; margin-top: 1.5rem; font-size: 0.875rem;">
      <a href="${termsUrl}" style="color: #3b82f6; text-decoration: none;">Terms & Conditions</a>
      <span style="color: #d1d5db;">|</span>
      <a href="${policyUrl}" style="color: #3b82f6; text-decoration: none;">Policy</a>
      <span style="color: #d1d5db;">|</span>
      <a href="${contactUrl}" style="color: #3b82f6; text-decoration: none;">Contact Us</a>
    </div>

    <!-- Company Info -->
    <div style="text-align: center; color: #6b7280; font-size: 0.875rem; margin-top: 1rem;">
      <p>&copy; ${new Date().getFullYear()} ${companyName}.</p>
      <p>${companyRegistration}</p>
    </div>
  </div>

  <!-- Form with Payment JavaScript -->
  <script>
    (function() {
      const products_${sanitizedId} = ${productsDataJS};
      const quantities_${sanitizedId} = {};
      const currencyCode_${sanitizedId} = '${currency}';

      // Initialize quantities
      products_${sanitizedId}.forEach(product => {
        quantities_${sanitizedId}[product.id] = 0;
      });

      function formatCurrency_${sanitizedId}(value) {
        if (currencyCode_${sanitizedId} === 'MYR') {
          return 'RM ' + value.toFixed(2);
        }
        return currencyCode_${sanitizedId} + ' ' + value.toFixed(2);
      }

      window.updateQty_${sanitizedId} = function(productId, delta, maxStock) {
        const product = products_${sanitizedId}.find(p => p.id === productId);
        if (!product) return;

        // Check stock
        if (product.stock !== undefined && product.stock <= 0) return;

        const current = quantities_${sanitizedId}[productId] || 0;
        let newQty = Math.max(0, current + delta);

        // Respect stock limit
        if (maxStock !== undefined && newQty > maxStock) {
          newQty = maxStock;
        }

        quantities_${sanitizedId}[productId] = newQty;

        // Update quantity display
        const qtyEl = document.getElementById('qty-${sanitizedId}-' + productId);
        if (qtyEl) qtyEl.textContent = newQty;

        // Update amount display
        const amountEl = document.getElementById('amount-${sanitizedId}-' + productId);
        if (amountEl) amountEl.textContent = formatCurrency_${sanitizedId}(product.price * newQty);

        updateTotal_${sanitizedId}();
      };

      function updateTotal_${sanitizedId}() {
        let total = 0;
        products_${sanitizedId}.forEach(product => {
          if (product.stock === undefined || product.stock > 0) {
            total += product.price * (quantities_${sanitizedId}[product.id] || 0);
          }
        });

        document.getElementById('total-${sanitizedId}').textContent = formatCurrency_${sanitizedId}(total);

        const emptyMsg = document.getElementById('empty-msg-${sanitizedId}');
        if (emptyMsg) {
          emptyMsg.style.display = total === 0 ? 'block' : 'none';
        }
      }

      // Bank selection state
      let banks_${sanitizedId} = [];
      let selectedBankId_${sanitizedId} = null;
      let pendingOrderData_${sanitizedId} = null;

      // Fetch banks from API
      window.fetchBanks_${sanitizedId} = async function() {
        const loadingEl = document.getElementById('banks-loading-${sanitizedId}');
        const errorEl = document.getElementById('banks-error-${sanitizedId}');
        const listEl = document.getElementById('banks-list-${sanitizedId}');

        loadingEl.style.display = 'flex';
        errorEl.style.display = 'none';
        listEl.style.display = 'none';

        try {
          const response = await fetch('/api/payments/public-banks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ project_id: window.__PROJECT_ID__ })
          });
          const data = await response.json();

          if (data.success && data.banks) {
            banks_${sanitizedId} = data.banks;
            renderBanks_${sanitizedId}(banks_${sanitizedId});
            loadingEl.style.display = 'none';
            listEl.style.display = 'block';
          } else {
            throw new Error(data.error || 'Failed to load banks');
          }
        } catch (error) {
          console.error('Failed to fetch banks:', error);
          loadingEl.style.display = 'none';
          errorEl.style.display = 'block';
        }
      };

      // Render banks list grouped by type
      function renderBanks_${sanitizedId}(banksList) {
        const listEl = document.getElementById('banks-list-${sanitizedId}');

        var fpxBanks = banksList.filter(function(b) { return b.type === 'WEB_PAYMENT'; });
        var ewalletBanks = banksList.filter(function(b) { return b.type === 'DIGITAL_PAYMENT'; });

        var html = '';

        // FPX / Online Banking Section
        if (fpxBanks.length > 0) {
          html += '<div style="margin-bottom: 1rem;">' +
            '<h4 style="display: flex; align-items: center; font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 0.5rem;">' +
              '<svg style="width: 1rem; height: 1rem; margin-right: 0.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>' +
              'Online Banking (FPX)' +
            '</h4>' +
            '<div>';

          fpxBanks.forEach(function(bank) {
            var logoHtml = bank.logo ?
              '<img src="' + bank.logo + '" alt="' + bank.name + '" style="width: 2rem; height: 2rem; object-fit: contain;" />' :
              '<svg style="width: 1.5rem; height: 1.5rem; color: #9ca3af;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>';

            html += '<button type="button" onclick="selectBank_${sanitizedId}(\\'' + bank.id + '\\')" id="form-bank-btn-${sanitizedId}-' + bank.id + '" style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; margin-bottom: 0.5rem; border: 2px solid #e5e7eb; border-radius: 0.5rem; background: white; cursor: pointer; transition: all 0.2s;">' +
              '<div style="display: flex; align-items: center; gap: 0.75rem;">' +
                logoHtml +
                '<span style="font-weight: 500; color: #111827;">' + bank.name + '</span>' +
              '</div>' +
              '<div id="form-bank-check-${sanitizedId}-' + bank.id + '" style="display: none; width: 1.25rem; height: 1.25rem; border-radius: 50%; background: #2563eb; align-items: center; justify-content: center;">' +
                '<svg style="width: 0.75rem; height: 0.75rem; color: white;" fill="currentColor" viewBox="0 0 20 20">' +
                  '<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />' +
                '</svg>' +
              '</div>' +
            '</button>';
          });

          html += '</div></div>';
        }

        // E-Wallets Section
        if (ewalletBanks.length > 0) {
          html += '<div style="margin-bottom: 1rem;">' +
            '<h4 style="display: flex; align-items: center; font-size: 0.75rem; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 0.5rem;">' +
              '<svg style="width: 1rem; height: 1rem; margin-right: 0.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>' +
              'E-Wallets' +
            '</h4>' +
            '<div>';

          ewalletBanks.forEach(function(bank) {
            var logoHtml = bank.logo ?
              '<img src="' + bank.logo + '" alt="' + bank.name + '" style="width: 2rem; height: 2rem; object-fit: contain;" />' :
              '<svg style="width: 1.5rem; height: 1.5rem; color: #9ca3af;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>';

            html += '<button type="button" onclick="selectBank_${sanitizedId}(\\'' + bank.id + '\\')" id="form-bank-btn-${sanitizedId}-' + bank.id + '" style="width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; margin-bottom: 0.5rem; border: 2px solid #e5e7eb; border-radius: 0.5rem; background: white; cursor: pointer; transition: all 0.2s;">' +
              '<div style="display: flex; align-items: center; gap: 0.75rem;">' +
                logoHtml +
                '<span style="font-weight: 500; color: #111827;">' + bank.name + '</span>' +
              '</div>' +
              '<div id="form-bank-check-${sanitizedId}-' + bank.id + '" style="display: none; width: 1.25rem; height: 1.25rem; border-radius: 50%; background: #2563eb; align-items: center; justify-content: center;">' +
                '<svg style="width: 0.75rem; height: 0.75rem; color: white;" fill="currentColor" viewBox="0 0 20 20">' +
                  '<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />' +
                '</svg>' +
              '</div>' +
            '</button>';
          });

          html += '</div></div>';
        }

        listEl.innerHTML = html;
      }

      // Select bank
      window.selectBank_${sanitizedId} = function(bankId) {
        selectedBankId_${sanitizedId} = bankId;
        document.getElementById('selected-bank-${sanitizedId}').value = bankId;
        document.getElementById('bank-error-${sanitizedId}').style.display = 'none';

        // Update UI
        var allButtons = document.querySelectorAll('[id^="form-bank-btn-${sanitizedId}-"]');
        allButtons.forEach(function(btn) {
          var btnBankId = btn.id.replace('form-bank-btn-${sanitizedId}-', '');
          var check = document.getElementById('form-bank-check-${sanitizedId}-' + btnBankId);
          if (btnBankId === bankId) {
            btn.style.borderColor = '#2563eb';
            btn.style.background = '#eff6ff';
            if (check) check.style.display = 'flex';
          } else {
            btn.style.borderColor = '#e5e7eb';
            btn.style.background = 'white';
            if (check) check.style.display = 'none';
          }
        });
      };

      // Open checkout modal
      window.openCheckoutModal_${sanitizedId} = function(orderItems, total) {
        const modal = document.getElementById('checkout-modal-${sanitizedId}');
        const summaryEl = document.getElementById('modal-order-summary-${sanitizedId}');
        const modalTotal = document.getElementById('modal-total-${sanitizedId}');
        const btnTotal = document.getElementById('modal-btn-total-${sanitizedId}');

        // Build order summary HTML
        let summaryHTML = '';
        orderItems.forEach(function(item) {
          summaryHTML += '<div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">' +
            '<span>' + item.name + ' x' + item.quantity + '</span>' +
            '<span style="font-weight: 600;">' + formatCurrency_${sanitizedId}(item.amount) + '</span>' +
          '</div>';
        });
        summaryEl.innerHTML = summaryHTML;

        // Update totals
        modalTotal.textContent = formatCurrency_${sanitizedId}(total);
        btnTotal.textContent = formatCurrency_${sanitizedId}(total);

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        // Fetch banks when modal opens
        if (banks_${sanitizedId}.length === 0) {
          fetchBanks_${sanitizedId}();
        }
      };

      // Close checkout modal
      window.closeCheckoutModal_${sanitizedId} = function() {
        const modal = document.getElementById('checkout-modal-${sanitizedId}');
        modal.style.display = 'none';
        document.body.style.overflow = '';
      };

      // Proceed to payment
      window.proceedToPayment_${sanitizedId} = async function() {
        // Validate bank selection
        if (!selectedBankId_${sanitizedId}) {
          document.getElementById('bank-error-${sanitizedId}').style.display = 'block';
          return;
        }

        const btn = document.getElementById('proceed-payment-btn-${sanitizedId}');
        btn.disabled = true;
        btn.textContent = 'Processing...';
        btn.style.opacity = '0.7';

        try {
          const response = await fetch('/api/payments/create-public', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              project_id: window.__PROJECT_ID__,
              product_id: pendingOrderData_${sanitizedId}.orderItems[0].id,
              product_name: pendingOrderData_${sanitizedId}.productName,
              product_price: pendingOrderData_${sanitizedId}.total.toFixed(2),
              payment_service_id: selectedBankId_${sanitizedId},
              customer_name: pendingOrderData_${sanitizedId}.name,
              customer_email: pendingOrderData_${sanitizedId}.email,
              customer_phone: pendingOrderData_${sanitizedId}.mobile,
            }),
          });

          const data = await response.json();

          if (response.ok && data.redirect_url) {
            window.location.href = data.redirect_url;
          } else {
            throw new Error(data.error || 'Failed to create payment');
          }
        } catch (error) {
          btn.disabled = false;
          btn.innerHTML = 'Proceed to Secure Payment - <span id="modal-btn-total-${sanitizedId}">' + formatCurrency_${sanitizedId}(pendingOrderData_${sanitizedId}.total) + '</span>';
          btn.style.opacity = '1';

          alert(error.message || 'An error occurred. Please try again.');
        }
      };

      window.submitPaymentForm_${sanitizedId} = async function(event) {
        event.preventDefault();

        const statusDiv = document.getElementById('status-${sanitizedId}');

        // Calculate total and collect order items
        let total = 0;
        const orderItems = [];
        products_${sanitizedId}.forEach(product => {
          const qty = quantities_${sanitizedId}[product.id] || 0;
          if (qty > 0 && (product.stock === undefined || product.stock > 0)) {
            const amount = product.price * qty;
            total += amount;
            orderItems.push({
              id: product.id,
              name: product.name,
              price: product.price,
              quantity: qty,
              amount: amount
            });
          }
        });

        if (orderItems.length === 0) {
          statusDiv.style.display = 'block';
          statusDiv.style.backgroundColor = '#fef2f2';
          statusDiv.style.color = '#991b1b';
          statusDiv.style.borderLeft = '4px solid #ef4444';
          statusDiv.textContent = 'Please select at least one item.';
          return false;
        }

        // Get form data
        const name = document.getElementById('name-${sanitizedId}')?.value || '';
        const mobile = document.getElementById('mobile-${sanitizedId}')?.value || '';
        const email = document.getElementById('email-${sanitizedId}')?.value || '';

        // Build product name for payment
        const productName = orderItems.map(item => item.name + ' x' + item.quantity).join(', ');

        // Store order data for later use
        pendingOrderData_${sanitizedId} = {
          orderItems,
          total,
          name,
          mobile,
          email,
          productName
        };

        // Open checkout modal with bank selection
        openCheckoutModal_${sanitizedId}(orderItems, total);

        return false;
      };

      // Check for payment status on page load (after redirect from payment gateway)
      const urlParams = new URLSearchParams(window.location.search);
      const orderRef = urlParams.get('order');

      if (orderRef) {
        // Remove order param from URL without page reload
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);

        // Check payment status from database
        fetch('/api/payments/check-status?order=' + orderRef)
          .then(response => response.json())
          .then(data => {
            if (data.status === 'completed' || data.status === 'paid') {
              showPaymentResult_${sanitizedId}('success', orderRef);
            } else if (data.status === 'failed' || data.status === 'cancelled') {
              showPaymentResult_${sanitizedId}('failed', orderRef);
            } else {
              // Payment is still pending/processing
              showPaymentResult_${sanitizedId}('pending', orderRef);
            }
          })
          .catch(error => {
            console.error('Error checking payment status:', error);
            showPaymentResult_${sanitizedId}('pending', orderRef);
          });
      }

      // Show payment result modal
      function showPaymentResult_${sanitizedId}(status, orderRef) {
        // Create modal element
        const modal = document.createElement('div');
        modal.id = 'payment-result-modal-${sanitizedId}';
        modal.style.cssText = 'position: fixed; inset: 0; z-index: 100; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; padding: 1rem;';

        let icon, title, message, bgColor;

        if (status === 'success') {
          icon = '<svg style="width: 4rem; height: 4rem; color: #22c55e;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
          title = 'Payment Successful!';
          message = 'Thank you for your purchase. Your order has been confirmed.';
          bgColor = '#dcfce7';
        } else if (status === 'failed') {
          icon = '<svg style="width: 4rem; height: 4rem; color: #ef4444;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
          title = 'Payment Cancelled';
          message = 'Your payment was cancelled or failed. Please try again if you wish to complete your purchase.';
          bgColor = '#fee2e2';
        } else {
          icon = '<svg style="width: 4rem; height: 4rem; color: #f59e0b;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
          title = 'Payment Processing';
          message = 'Your payment is being processed. You will receive a confirmation email shortly.';
          bgColor = '#fef3c7';
        }

        modal.innerHTML = \`
          <div style="background: white; border-radius: 0.75rem; max-width: 28rem; width: 100%; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
            <div style="background: \${bgColor}; padding: 2rem; text-align: center;">
              <div style="display: flex; justify-content: center; margin-bottom: 1rem;">
                \${icon}
              </div>
              <h2 style="font-size: 1.5rem; font-weight: bold; color: #111827; margin: 0 0 0.5rem 0;">\${title}</h2>
            </div>
            <div style="padding: 1.5rem;">
              <p style="color: #4b5563; text-align: center; margin: 0 0 1rem 0;">\${message}</p>
              <div style="background: #f3f4f6; border-radius: 0.5rem; padding: 0.75rem; margin-bottom: 1.5rem;">
                <p style="font-size: 0.875rem; color: #6b7280; margin: 0 0 0.25rem 0; text-align: center;">Order Reference</p>
                <p style="font-weight: 600; color: #111827; margin: 0; text-align: center; font-family: monospace;">\${orderRef}</p>
              </div>
              <button onclick="document.getElementById('payment-result-modal-${sanitizedId}').remove()" style="width: 100%; padding: 0.75rem; background: #2563eb; color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer;">
                Close
              </button>
            </div>
          </div>
        \`;

        document.body.appendChild(modal);
      }
    })();
  </script>
</section>`;
}

/**
 * Generate analytics scripts
 */
function generateAnalyticsScripts(project: Project): string {
  const scripts: string[] = [];

  // Add comprehensive tracking script for our own analytics
  scripts.push(generateTrackingScript(project.id));

  // Add custom integrations if configured
  if (project.integrations) {
    // Meta Pixel
    if (project.integrations.metaPixel) {
      scripts.push(`
  <!-- Meta Pixel Code -->
  <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${project.integrations.metaPixel}');
    fbq('track', 'PageView');
  </script>
      `);
    }

    // Google Analytics
    if (project.integrations.googleAnalytics) {
      scripts.push(`
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${project.integrations.googleAnalytics}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${project.integrations.googleAnalytics}');
  </script>
      `);
    }
  }

  return scripts.join('\n');
}

/**
 * Generate Product Carousel HTML
 */
function generateProductCarouselHTML(element: Element): string {
  const {
    title = 'Our Products',
    subtitle = '',
    products = [],
    layout = 'grid',
    columns = 3,
    showPrice = true,
    showDescription = true,
    cardStyle = 'shadow',
    bgColor = '#ffffff',
    textColor = '#1f2937',
    priceColor = '#2563eb',
    backgroundImage,
    backgroundOpacity = 70,
  } = element.props;

  const sanitizedId = sanitizeId(element.id);

  // Card style classes
  const cardClasses = cardStyle === 'minimal'
    ? 'background: white;'
    : cardStyle === 'bordered'
    ? 'background: white; border: 1px solid #e5e7eb;'
    : 'background: white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);';

  // Generate product cards HTML
  const productsHTML = products.map((product: any, index: number) => {
    const variationsHTML = product.variations && product.variations.length > 0
      ? `<div style="margin-bottom: 12px; display: flex; flex-wrap: wrap; gap: 8px;">
          ${product.variations.map((variation: any) =>
            variation.type === 'color'
              ? `<div style="display: flex; gap: 4px;">
                  ${variation.options.slice(0, 4).map((opt: any) =>
                    `<div style="width: 16px; height: 16px; border-radius: 50%; border: 1px solid #d1d5db; background-color: ${opt.colorCode || '#ccc'};" title="${opt.label}"></div>`
                  ).join('')}
                  ${variation.options.length > 4 ? `<span style="font-size: 12px; color: #6b7280;">+${variation.options.length - 4}</span>` : ''}
                </div>`
              : `<span style="font-size: 12px; color: #6b7280;">${variation.options.length} ${variation.name.toLowerCase()}s</span>`
          ).join('')}
        </div>`
      : '';

    return `
      <div style="${cardClasses} border-radius: 12px; overflow: hidden; transition: transform 0.2s;" class="product-card-${sanitizedId}">
        <div style="aspect-ratio: 1; background: #f3f4f6; position: relative; overflow: hidden;">
          ${product.image_url
            ? `<img src="${product.image_url}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" />`
            : `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #9ca3af;">
                <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>`
          }
        </div>
        <div style="padding: 16px;">
          <h3 style="font-weight: 600; font-size: 18px; margin-bottom: 4px; color: ${textColor};">${product.name}</h3>
          ${showDescription && product.description
            ? `<p style="font-size: 14px; opacity: 0.7; margin-bottom: 12px; color: ${textColor}; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${product.description}</p>`
            : ''
          }
          ${variationsHTML}
          ${showPrice
            ? `<p style="font-weight: 700; font-size: 18px; color: ${priceColor};">${product.currency} ${typeof product.base_price === 'number' ? product.base_price.toFixed(2) : product.base_price}</p>`
            : ''
          }
        </div>
      </div>
    `;
  }).join('');

  // Determine grid columns CSS
  const gridCSS = `
    display: grid;
    gap: 24px;
    grid-template-columns: repeat(${columns}, minmax(0, 1fr));
  `;

  const backgroundHTML = backgroundImage
    ? `
      <div style="position: absolute; inset: 0; background-image: url('${backgroundImage}'); background-size: cover; background-position: center;"></div>
      <div style="position: absolute; inset: 0; background-color: ${bgColor}; opacity: ${backgroundOpacity / 100};"></div>
    `
    : '';

  return `
    <section id="product-carousel-${sanitizedId}" style="position: relative; padding: 64px 16px; background-color: ${bgColor}; overflow: hidden;">
      ${backgroundHTML}
      <div style="position: relative; z-index: 10; max-width: 1280px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 48px;">
          <h2 style="font-size: 30px; font-weight: 700; margin-bottom: 16px; color: ${textColor};">${title}</h2>
          ${subtitle ? `<p style="font-size: 18px; opacity: 0.8; max-width: 672px; margin: 0 auto; color: ${textColor};">${subtitle}</p>` : ''}
        </div>

        ${products.length === 0
          ? `<div style="text-align: center; padding: 48px; border: 2px dashed #d1d5db; border-radius: 8px;">
              <p style="color: #6b7280; font-size: 18px;">No products to display</p>
            </div>`
          : `<div style="${gridCSS}">${productsHTML}</div>`
        }
      </div>
      <style>
        .product-card-${sanitizedId}:hover {
          transform: scale(1.02);
        }
        @media (max-width: 768px) {
          #product-carousel-${sanitizedId} > div > div:last-child {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 480px) {
          #product-carousel-${sanitizedId} > div > div:last-child {
            grid-template-columns: 1fr !important;
          }
        }
      </style>
    </section>
  `;
}
