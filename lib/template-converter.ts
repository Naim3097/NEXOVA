/**
 * Template Converter Utility
 * Converts JSON templates from various page builders to our schema format
 */

import { ElementType } from '@/types';

// Our standard template format
export interface ConvertedTemplate {
  version: '1.0';
  exportedAt: string;
  source: string; // Original source detected
  project: {
    name: string;
    description: string | null;
    seo_settings: any;
  };
  elements: Array<{
    type: ElementType;
    order: number;
    props: Record<string, any>;
  }>;
  conversionNotes?: string[]; // Notes about what was converted or skipped
}

// Supported source types
type SourceType =
  | 'native'           // Our own format
  | 'elementor'        // WordPress Elementor
  | 'webflow'          // Webflow
  | 'unbounce'         // Unbounce
  | 'leadpages'        // Leadpages
  | 'clickfunnels'     // ClickFunnels
  | 'instapage'        // Instapage
  | 'carrd'            // Carrd
  | 'framer'           // Framer
  | 'product_page'     // Product/landing page with hero, reviews, faq, variants
  | 'generic'          // Generic/unknown format
  | 'unknown';

interface DetectionResult {
  source: SourceType;
  confidence: number; // 0-1
  version?: string;
}

/**
 * Detect the source page builder from JSON structure
 */
export function detectSource(data: any): DetectionResult {
  // Check for our native format first
  if (data.version === '1.0' && data.elements && data.project) {
    return { source: 'native', confidence: 1.0, version: data.version };
  }

  // Elementor detection
  if (data.content && Array.isArray(data.content) && data.content[0]?.elType) {
    return { source: 'elementor', confidence: 0.95, version: data.version };
  }
  if (data.type === 'elementor' || data.widgetType) {
    return { source: 'elementor', confidence: 0.9 };
  }

  // Webflow detection
  if (data.payload && data.payload.nodes) {
    return { source: 'webflow', confidence: 0.95 };
  }
  if (data._id && data.slug && data.nodes) {
    return { source: 'webflow', confidence: 0.85 };
  }

  // Unbounce detection
  if (data.page && data.page.sections) {
    return { source: 'unbounce', confidence: 0.9 };
  }
  if (data.variant && data.sections) {
    return { source: 'unbounce', confidence: 0.85 };
  }

  // ClickFunnels detection
  if (data.funnel_step || data.funnel_id) {
    return { source: 'clickfunnels', confidence: 0.9 };
  }
  if (data.rows && data.rows[0]?.columns) {
    return { source: 'clickfunnels', confidence: 0.7 };
  }

  // Leadpages detection
  if (data.template_id && data.widgets) {
    return { source: 'leadpages', confidence: 0.9 };
  }

  // Instapage detection
  if (data.blocks && data.blocks[0]?.blockType) {
    return { source: 'instapage', confidence: 0.85 };
  }

  // Carrd detection
  if (data.site && data.site.cards) {
    return { source: 'carrd', confidence: 0.9 };
  }

  // Framer detection
  if (data.root && data.components) {
    return { source: 'framer', confidence: 0.85 };
  }

  // Product page detection - has hero object with headline/subheadline and other sections
  if (data.hero && (data.hero.headline || data.hero.subheadline)) {
    return { source: 'product_page', confidence: 0.95 };
  }

  // Product page detection - has reviews/faq/variants at root level
  if ((data.reviews && Array.isArray(data.reviews)) ||
      (data.faq && Array.isArray(data.faq)) ||
      (data.variants && Array.isArray(data.variants))) {
    return { source: 'product_page', confidence: 0.85 };
  }

  // Generic structure detection - look for common patterns
  if (data.sections || data.blocks || data.components || data.widgets) {
    return { source: 'generic', confidence: 0.5 };
  }

  // Check for array of elements with type/props pattern
  if (Array.isArray(data) && data[0]?.type && data[0]?.props) {
    return { source: 'generic', confidence: 0.6 };
  }

  return { source: 'unknown', confidence: 0 };
}

/**
 * Map external element types to our element types
 */
function mapElementType(externalType: string, source: SourceType): ElementType | null {
  const typeMap: Record<string, ElementType> = {
    // Hero sections
    'hero': 'hero',
    'hero-section': 'hero',
    'hero_section': 'hero',
    'banner': 'hero',
    'header': 'hero',
    'heading': 'hero',
    'jumbotron': 'hero',
    'cover': 'hero',

    // Navigation
    'nav': 'navigation',
    'navbar': 'navigation',
    'navigation': 'navigation',
    'menu': 'navigation',
    'header-nav': 'navigation',

    // Features
    'features': 'features',
    'feature': 'features',
    'feature-list': 'features',
    'feature_list': 'features',
    'benefits': 'features',
    'icon-box': 'features',
    'icon-list': 'features',
    'services': 'features',

    // Testimonials
    'testimonials': 'testimonials',
    'testimonial': 'testimonials',
    'reviews': 'testimonials',
    'review': 'testimonials',
    'social-proof': 'testimonials',
    'quotes': 'testimonials',

    // FAQ
    'faq': 'faq',
    'faqs': 'faq',
    'accordion': 'faq',
    'questions': 'faq',
    'toggle-list': 'faq',

    // CTA
    'cta': 'cta',
    'call-to-action': 'cta',
    'action': 'cta',
    'conversion': 'cta',

    // Pricing
    'pricing': 'pricing',
    'pricing-table': 'pricing',
    'pricing_table': 'pricing',
    'plans': 'pricing',
    'packages': 'pricing',

    // Footer
    'footer': 'footer',
    'site-footer': 'footer',

    // Forms
    'form': 'lead_form',
    'lead-form': 'lead_form',
    'contact-form': 'lead_form',
    'opt-in': 'lead_form',
    'signup': 'lead_form',
    'subscribe': 'lead_form',

    // Announcement
    'announcement': 'announcement_bar',
    'announcement-bar': 'announcement_bar',
    'notification-bar': 'announcement_bar',
    'promo-bar': 'announcement_bar',
    'top-bar': 'announcement_bar',

    // Payment
    'payment': 'payment_button',
    'checkout': 'payment_button',
    'buy-button': 'payment_button',
    'order-form': 'form_with_payment',
  };

  const normalizedType = externalType.toLowerCase().replace(/\s+/g, '-');
  return typeMap[normalizedType] || null;
}

/**
 * Convert Elementor format to our schema
 */
function convertElementor(data: any): ConvertedTemplate {
  const notes: string[] = [];
  const elements: ConvertedTemplate['elements'] = [];
  let order = 0;

  const processElementorElement = (el: any) => {
    if (!el) return;

    const elType = el.widgetType || el.elType;
    const mappedType = mapElementType(elType, 'elementor');

    if (mappedType) {
      const props = convertElementorProps(el, mappedType);
      elements.push({
        type: mappedType,
        order: order++,
        props,
      });
    } else if (elType && elType !== 'section' && elType !== 'column') {
      notes.push(`Skipped unsupported Elementor element: ${elType}`);
    }

    // Process nested elements
    if (el.elements && Array.isArray(el.elements)) {
      el.elements.forEach(processElementorElement);
    }
  };

  // Process content array
  if (data.content && Array.isArray(data.content)) {
    data.content.forEach(processElementorElement);
  }

  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    source: 'elementor',
    project: {
      name: data.title || 'Imported from Elementor',
      description: null,
      seo_settings: extractSEOFromElementor(data),
    },
    elements,
    conversionNotes: notes.length > 0 ? notes : undefined,
  };
}

function convertElementorProps(el: any, targetType: ElementType): Record<string, any> {
  const settings = el.settings || {};

  switch (targetType) {
    case 'hero':
      return {
        variant: 'centered',
        headline: settings.title || settings.heading || 'Welcome',
        subheadline: settings.description || settings.subtitle || '',
        ctaText: settings.button_text || 'Get Started',
        ctaUrl: settings.button_link?.url || '#',
        bgColor: settings.background_color || '#f9fafb',
        image: settings.image?.url || settings.background_image?.url || '',
      };
    case 'features':
      return {
        variant: 'grid',
        title: settings.title || 'Features',
        features: (settings.items || settings.features || []).map((item: any) => ({
          icon: item.icon?.value || 'check',
          title: item.title || item.heading || 'Feature',
          description: item.description || item.text || '',
        })),
      };
    case 'testimonials':
      return {
        variant: 'grid',
        title: settings.title || 'Testimonials',
        testimonials: (settings.testimonials || settings.items || []).map((t: any) => ({
          name: t.name || t.author || 'Customer',
          role: t.title || t.position || '',
          avatar: t.image?.url || '',
          quote: t.content || t.text || t.testimonial || '',
          rating: t.rating || 5,
        })),
      };
    default:
      return settings;
  }
}

function extractSEOFromElementor(data: any): any {
  return {
    title: data.title || '',
    description: data.excerpt || '',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    robotsIndex: true,
    robotsFollow: true,
    language: 'en',
  };
}

/**
 * Convert Webflow format to our schema
 */
function convertWebflow(data: any): ConvertedTemplate {
  const notes: string[] = [];
  const elements: ConvertedTemplate['elements'] = [];
  let order = 0;

  const nodes = data.payload?.nodes || data.nodes || [];

  const processWebflowNode = (node: any) => {
    if (!node) return;

    const nodeType = node.type || node.tag;
    const mappedType = mapElementType(nodeType, 'webflow');

    if (mappedType) {
      const props = convertWebflowProps(node, mappedType);
      elements.push({
        type: mappedType,
        order: order++,
        props,
      });
    } else if (nodeType && !['div', 'section', 'container'].includes(nodeType.toLowerCase())) {
      notes.push(`Skipped unsupported Webflow element: ${nodeType}`);
    }

    // Process children
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(processWebflowNode);
    }
  };

  nodes.forEach(processWebflowNode);

  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    source: 'webflow',
    project: {
      name: data.name || data.title || 'Imported from Webflow',
      description: data.description || null,
      seo_settings: {
        title: data.seo?.title || data.name || '',
        description: data.seo?.description || '',
        ogType: 'website',
        twitterCard: 'summary_large_image',
        robotsIndex: true,
        robotsFollow: true,
        language: 'en',
      },
    },
    elements,
    conversionNotes: notes.length > 0 ? notes : undefined,
  };
}

function convertWebflowProps(node: any, targetType: ElementType): Record<string, any> {
  const data = node.data || {};
  const styles = node.styles || {};

  switch (targetType) {
    case 'hero':
      return {
        variant: 'centered',
        headline: data.text || data.heading || 'Welcome',
        subheadline: data.subtext || data.paragraph || '',
        ctaText: data.buttonText || 'Get Started',
        ctaUrl: data.buttonLink || '#',
        bgColor: styles.backgroundColor || '#f9fafb',
      };
    default:
      return data;
  }
}

/**
 * Convert product page format to our schema
 * Handles object-based structures with hero, reviews, faq, variants, etc.
 */
function convertProductPage(data: any): ConvertedTemplate {
  const notes: string[] = [];
  const elements: ConvertedTemplate['elements'] = [];
  let order = 0;

  // Extract theme colors for consistent styling
  const theme = data.theme || {};
  const primaryColor = theme.primary || '#3b82f6';
  const bgColor = theme.bg || '#ffffff';
  const textColor = theme.text || '#111827';

  // 1. Convert Hero section
  if (data.hero) {
    const hero = data.hero;
    elements.push({
      type: 'hero',
      order: order++,
      props: {
        variant: hero.media_type === 'image' ? 'image_left' : 'centered',
        headline: hero.headline || 'Welcome',
        subheadline: hero.subheadline || hero.subtitle || '',
        ctaText: hero.cta_text || hero.ctaText || 'Shop Now',
        ctaUrl: hero.cta_url || hero.ctaUrl || '#order',
        bgColor: theme.bg || '#1a1a1a',
        image: hero.media_url || hero.image || hero.image_url || '',
        headlineColor: theme.text || '#ffffff',
        subheadlineColor: theme.text || '#f0f0f0',
        buttonBgColor: primaryColor,
        buttonTextColor: '#ffffff',
      },
    });
    notes.push('Converted hero section');
  }

  // 2. Convert Variants/Products to Pricing
  if (data.variants && Array.isArray(data.variants) && data.variants.length > 0) {
    elements.push({
      type: 'pricing',
      order: order++,
      props: {
        title: 'Choose Your Package',
        subtitle: 'Select the best option for you',
        layout: 'cards',
        bgColor: theme.light_bg || '#2d2d2d',
        plans: data.variants.map((v: any, idx: number) => ({
          name: v.label || v.name || `Option ${idx + 1}`,
          price: String(v.price || 0),
          currency: 'RM',
          period: 'one-time',
          description: v.description || '',
          features: v.features || [],
          buttonText: 'Select',
          buttonUrl: '#order',
          highlighted: idx === Math.floor(data.variants.length / 2), // Highlight middle option
          priceNumeric: v.price || 0,
          productId: v.id || `variant_${idx}`,
        })),
      },
    });
    notes.push(`Converted ${data.variants.length} product variants to pricing table`);
  }

  // 3. Convert Reviews to Testimonials
  if (data.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) {
    elements.push({
      type: 'testimonials',
      order: order++,
      props: {
        variant: 'grid',
        title: 'What Our Customers Say',
        bgColor: theme.bg || '#1a1a1a',
        testimonials: data.reviews.map((r: any) => ({
          name: r.author || r.name || 'Customer',
          role: r.role || r.title || '',
          avatar: r.avatar || r.image || '',
          quote: r.text || r.content || r.review || r.quote || '',
          rating: r.rating || r.stars || 5,
        })),
      },
    });
    notes.push(`Converted ${data.reviews.length} reviews to testimonials`);
  }

  // 4. Convert FAQ
  if (data.faq && Array.isArray(data.faq) && data.faq.length > 0) {
    elements.push({
      type: 'faq',
      order: order++,
      props: {
        variant: 'single_column',
        title: 'Frequently Asked Questions',
        bgColor: theme.light_bg || '#2d2d2d',
        questions: data.faq.map((f: any) => ({
          question: f.q || f.question || 'Question',
          answer: f.a || f.answer || 'Answer',
        })),
      },
    });
    notes.push(`Converted ${data.faq.length} FAQ items`);
  }

  // 5. Convert Upsell page to CTA if present
  if (data.upsell_page) {
    const upsell = data.upsell_page;
    elements.push({
      type: 'cta',
      order: order++,
      props: {
        variant: 'centered',
        headline: upsell.headline || 'Special Offer',
        description: upsell.subheadline || '',
        buttonText: upsell.cta_yes || 'Yes, Add to Order',
        buttonUrl: '#',
        bgGradient: `linear-gradient(135deg, ${primaryColor} 0%, ${theme.bg || '#1a1a1a'} 100%)`,
        backgroundImage: upsell.image_url || '',
      },
    });
    notes.push('Converted upsell page to CTA section');
  }

  // 6. Add bump offer as a feature highlight if present
  if (data.products?.bump) {
    const bump = data.products.bump;
    elements.push({
      type: 'features',
      order: order++,
      props: {
        variant: 'grid',
        title: 'Enhance Your Order',
        bgColor: theme.light_bg || '#2d2d2d',
        features: [
          {
            icon: 'plus',
            title: bump.label || 'Add-on',
            description: `Only RM${bump.price || 0} - Add this to your order!`,
          },
        ],
      },
    });
    notes.push('Converted bump offer to features section');
  }

  // 7. Add Footer
  elements.push({
    type: 'footer',
    order: order++,
    props: {
      logo: '',
      logoText: data.brand || data.name || 'Brand',
      description: '',
      bgColor: theme.bg || '#1a1a1a',
      textColor: theme.text || '#ffffff',
      copyright: `© ${new Date().getFullYear()} All rights reserved.`,
      columns: [],
      socialLinks: [],
    },
  });

  // Extract project name from hero headline or data
  const projectName = data.name || data.title ||
    (data.hero?.headline ? data.hero.headline.substring(0, 50) : 'Product Page');

  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    source: 'product_page',
    project: {
      name: projectName,
      description: data.hero?.subheadline || data.description || null,
      seo_settings: {
        title: projectName,
        description: data.hero?.subheadline || '',
        ogType: 'product',
        twitterCard: 'summary_large_image',
        robotsIndex: true,
        robotsFollow: true,
        language: 'en',
      },
    },
    elements,
    conversionNotes: notes.length > 0 ? notes : undefined,
  };
}

/**
 * Convert generic/unknown format to our schema
 * Attempts to intelligently map common structures
 */
function convertGeneric(data: any): ConvertedTemplate {
  const notes: string[] = [];
  const elements: ConvertedTemplate['elements'] = [];
  let order = 0;

  // Try to find the main content array
  let contentArray: any[] = [];

  if (Array.isArray(data)) {
    contentArray = data;
  } else if (data.sections) {
    contentArray = data.sections;
  } else if (data.blocks) {
    contentArray = data.blocks;
  } else if (data.components) {
    contentArray = data.components;
  } else if (data.widgets) {
    contentArray = data.widgets;
  } else if (data.elements) {
    contentArray = data.elements;
  } else if (data.content) {
    contentArray = Array.isArray(data.content) ? data.content : [data.content];
  }

  const processGenericItem = (item: any) => {
    if (!item || typeof item !== 'object') return;

    // Try to determine the type
    const itemType = item.type || item.elementType || item.component || item.widget || item.name || item.id;

    if (typeof itemType === 'string') {
      const mappedType = mapElementType(itemType, 'generic');

      if (mappedType) {
        const props = convertGenericProps(item, mappedType);
        elements.push({
          type: mappedType,
          order: order++,
          props,
        });
      } else {
        // Try to infer from content
        const inferredType = inferTypeFromContent(item);
        if (inferredType) {
          const props = convertGenericProps(item, inferredType);
          elements.push({
            type: inferredType,
            order: order++,
            props,
          });
        } else {
          notes.push(`Could not map element type: ${itemType}`);
        }
      }
    }

    // Process nested items
    const nestedArrays = ['children', 'items', 'content', 'elements', 'blocks'];
    for (const key of nestedArrays) {
      if (item[key] && Array.isArray(item[key])) {
        item[key].forEach(processGenericItem);
      }
    }
  };

  contentArray.forEach(processGenericItem);

  // If no elements were found, create a default hero
  if (elements.length === 0) {
    notes.push('No compatible elements found. Created a default hero section.');
    elements.push({
      type: 'hero',
      order: 0,
      props: {
        variant: 'centered',
        headline: data.title || data.name || 'Imported Page',
        subheadline: data.description || 'Edit this page to customize your content',
        ctaText: 'Get Started',
        ctaUrl: '#',
        bgColor: '#f9fafb',
      },
    });
  }

  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    source: 'generic',
    project: {
      name: data.title || data.name || data.pageName || 'Imported Template',
      description: data.description || null,
      seo_settings: {
        title: data.seo?.title || data.title || '',
        description: data.seo?.description || data.description || '',
        ogType: 'website',
        twitterCard: 'summary_large_image',
        robotsIndex: true,
        robotsFollow: true,
        language: 'en',
      },
    },
    elements,
    conversionNotes: notes.length > 0 ? notes : undefined,
  };
}

/**
 * Infer element type from content structure
 */
function inferTypeFromContent(item: any): ElementType | null {
  // Check for hero indicators
  if (item.headline || item.hero || (item.title && item.ctaText)) {
    return 'hero';
  }

  // Check for features indicators
  if (item.features || (Array.isArray(item.items) && item.items[0]?.icon)) {
    return 'features';
  }

  // Check for testimonials indicators
  if (item.testimonials || item.reviews || (Array.isArray(item.items) && item.items[0]?.quote)) {
    return 'testimonials';
  }

  // Check for FAQ indicators
  if (item.faqs || item.questions || (Array.isArray(item.items) && item.items[0]?.question)) {
    return 'faq';
  }

  // Check for pricing indicators
  if (item.plans || item.pricing || (Array.isArray(item.items) && item.items[0]?.price)) {
    return 'pricing';
  }

  // Check for form indicators
  if (item.fields || item.inputs || item.formFields) {
    return 'lead_form';
  }

  return null;
}

function convertGenericProps(item: any, targetType: ElementType): Record<string, any> {
  // If the item already has a props object, merge it
  const baseProps = item.props || item.settings || item.data || {};

  switch (targetType) {
    case 'hero':
      return {
        variant: baseProps.variant || 'centered',
        headline: baseProps.headline || item.headline || item.title || item.heading || 'Welcome',
        subheadline: baseProps.subheadline || item.subheadline || item.subtitle || item.description || '',
        ctaText: baseProps.ctaText || item.ctaText || item.buttonText || 'Get Started',
        ctaUrl: baseProps.ctaUrl || item.ctaUrl || item.buttonUrl || item.link || '#',
        bgColor: baseProps.bgColor || item.bgColor || item.backgroundColor || '#f9fafb',
        image: baseProps.image || item.image || item.backgroundImage || '',
      };

    case 'features':
      const features = baseProps.features || item.features || item.items || [];
      return {
        variant: baseProps.variant || 'grid',
        title: baseProps.title || item.title || 'Features',
        features: features.map((f: any) => ({
          icon: f.icon || 'check',
          title: f.title || f.heading || f.name || 'Feature',
          description: f.description || f.text || f.content || '',
        })),
      };

    case 'testimonials':
      const testimonials = baseProps.testimonials || item.testimonials || item.reviews || item.items || [];
      return {
        variant: baseProps.variant || 'grid',
        title: baseProps.title || item.title || 'Testimonials',
        testimonials: testimonials.map((t: any) => ({
          name: t.name || t.author || t.customer || 'Customer',
          role: t.role || t.title || t.position || t.company || '',
          avatar: t.avatar || t.image || t.photo || '',
          quote: t.quote || t.text || t.content || t.testimonial || t.review || '',
          rating: t.rating || t.stars || 5,
        })),
      };

    case 'faq':
      const questions = baseProps.questions || item.questions || item.faqs || item.items || [];
      return {
        variant: baseProps.variant || 'single_column',
        title: baseProps.title || item.title || 'FAQ',
        questions: questions.map((q: any) => ({
          question: q.question || q.title || q.q || 'Question',
          answer: q.answer || q.content || q.text || q.a || 'Answer',
        })),
      };

    case 'pricing':
      const plans = baseProps.plans || item.plans || item.pricing || item.packages || item.items || [];
      return {
        title: baseProps.title || item.title || 'Pricing',
        subtitle: baseProps.subtitle || item.subtitle || '',
        layout: baseProps.layout || 'cards',
        plans: plans.map((p: any) => ({
          name: p.name || p.title || 'Plan',
          price: String(p.price || p.amount || '0'),
          currency: p.currency || 'RM',
          period: p.period || p.billing || 'month',
          description: p.description || '',
          features: p.features || p.items || [],
          buttonText: p.buttonText || p.cta || 'Get Started',
          buttonUrl: p.buttonUrl || p.link || '#',
          highlighted: p.highlighted || p.featured || p.popular || false,
        })),
      };

    case 'cta':
      return {
        variant: baseProps.variant || 'centered',
        headline: baseProps.headline || item.headline || item.title || 'Ready to Get Started?',
        description: baseProps.description || item.description || item.text || '',
        buttonText: baseProps.buttonText || item.buttonText || item.ctaText || 'Get Started',
        buttonUrl: baseProps.buttonUrl || item.buttonUrl || item.ctaUrl || '#',
        bgGradient: baseProps.bgGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      };

    case 'lead_form':
      return {
        title: baseProps.title || item.title || 'Get In Touch',
        description: baseProps.description || item.description || '',
        nameLabel: 'Your Name',
        emailLabel: 'Email Address',
        phoneLabel: 'Phone Number (optional)',
        messageLabel: 'Message (optional)',
        submitButtonText: baseProps.submitButtonText || item.buttonText || 'Submit',
        submitButtonColor: baseProps.submitButtonColor || '#2563eb',
        successMessage: baseProps.successMessage || 'Thank you! We\'ll be in touch soon.',
        fields: {
          showPhone: true,
          showMessage: true,
          phoneRequired: false,
          messageRequired: false,
        },
        bgColor: '#ffffff',
      };

    case 'navigation':
      const menuItems = baseProps.menuItems || item.menuItems || item.links || item.items || [];
      return {
        logo: baseProps.logo || item.logo || '',
        logoText: baseProps.logoText || item.logoText || item.brand || 'Your Brand',
        menuItems: menuItems.map((m: any) => ({
          label: m.label || m.text || m.title || 'Link',
          url: m.url || m.href || m.link || '#',
        })),
        bgColor: baseProps.bgColor || '#ffffff',
        textColor: baseProps.textColor || '#111827',
        isSticky: baseProps.isSticky ?? true,
        layout: baseProps.layout || 'split',
      };

    case 'footer':
      const columns = baseProps.columns || item.columns || item.sections || [];
      return {
        logo: baseProps.logo || item.logo || '',
        logoText: baseProps.logoText || item.logoText || 'Your Brand',
        description: baseProps.description || item.description || '',
        bgColor: baseProps.bgColor || '#1f2937',
        textColor: baseProps.textColor || '#ffffff',
        copyright: baseProps.copyright || item.copyright || `© ${new Date().getFullYear()} Your Company. All rights reserved.`,
        columns: columns.map((c: any) => ({
          title: c.title || c.heading || 'Links',
          links: (c.links || c.items || []).map((l: any) => ({
            label: l.label || l.text || 'Link',
            url: l.url || l.href || '#',
          })),
        })),
        socialLinks: baseProps.socialLinks || item.socialLinks || [],
      };

    case 'announcement_bar':
      return {
        message: baseProps.message || item.message || item.text || 'Announcement',
        bgColor: baseProps.bgColor || '#ef4444',
        textColor: baseProps.textColor || '#ffffff',
        showCountdown: baseProps.showCountdown || false,
        isSticky: baseProps.isSticky ?? true,
        showCloseButton: baseProps.showCloseButton ?? true,
      };

    default:
      return baseProps;
  }
}

/**
 * Main conversion function
 */
export function convertTemplate(jsonData: any): ConvertedTemplate {
  const detection = detectSource(jsonData);

  console.log('Template source detected:', detection);

  switch (detection.source) {
    case 'native':
      // Already in our format, just ensure structure
      return {
        version: '1.0',
        exportedAt: jsonData.exportedAt || new Date().toISOString(),
        source: 'native',
        project: jsonData.project,
        elements: jsonData.elements,
      };

    case 'elementor':
      return convertElementor(jsonData);

    case 'webflow':
      return convertWebflow(jsonData);

    case 'product_page':
      return convertProductPage(jsonData);

    case 'generic':
    case 'unknown':
    default:
      return convertGeneric(jsonData);
  }
}

/**
 * Validate converted template
 */
export function validateConvertedTemplate(template: ConvertedTemplate): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!template.version) {
    errors.push('Missing version');
  }

  if (!template.project) {
    errors.push('Missing project data');
  }

  if (!template.elements || !Array.isArray(template.elements)) {
    errors.push('Missing or invalid elements array');
  } else {
    template.elements.forEach((el, index) => {
      if (!el.type) {
        errors.push(`Element ${index}: missing type`);
      }
      if (typeof el.order !== 'number') {
        errors.push(`Element ${index}: missing or invalid order`);
      }
      if (!el.props || typeof el.props !== 'object') {
        errors.push(`Element ${index}: missing or invalid props`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
