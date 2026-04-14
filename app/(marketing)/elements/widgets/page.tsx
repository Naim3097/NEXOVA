import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { RevealOnScroll } from '@/components/ui/RevealOnScroll';

// Re-generate at most once per day on Vercel (ISR)
export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'UI Widgets Reference — Nexova Elements',
  description:
    '30+ Elementor and Elementor Pro widget references — Basic, Pro, General, Theme, and WooCommerce. Browse descriptions and use in your X.IDE projects.',
  alternates: { canonical: 'https://nexova.co/elements/widgets' },
  openGraph: {
    title: 'UI Widgets Reference — Nexova Elements',
    description:
      '30+ Elementor widget references for every page component you need.',
    url: 'https://nexova.co/elements/widgets',
    type: 'website',
  },
};

/* ─────────────────────────────────────────────────────── */
/*  Widget data (ported from Nexova Elements source)       */
/* ─────────────────────────────────────────────────────── */

type WidgetCategory = 'Basic' | 'Pro' | 'General' | 'Theme' | 'WooCommerce';

type Widget = {
  id: string;
  title: string;
  description: string;
  category: WidgetCategory;
};

const WIDGETS: Widget[] = [
  // Basic
  {
    id: 'basic-heading',
    title: 'Heading',
    description: 'Add headings to your page to structure content.',
    category: 'Basic',
  },
  {
    id: 'basic-image',
    title: 'Image',
    description: 'Insert images into your page with various styling options.',
    category: 'Basic',
  },
  {
    id: 'basic-text-editor',
    title: 'Text Editor',
    description: 'A WYSIWYG text editor for adding paragraphs and rich text.',
    category: 'Basic',
  },
  {
    id: 'basic-video',
    title: 'Video',
    description: 'Embed videos from YouTube, Vimeo, or self-hosted sources.',
    category: 'Basic',
  },
  {
    id: 'basic-button',
    title: 'Button',
    description: 'Add clickable buttons with custom styles and links.',
    category: 'Basic',
  },
  {
    id: 'basic-divider',
    title: 'Divider',
    description: 'A simple line to separate content sections.',
    category: 'Basic',
  },
  {
    id: 'basic-spacer',
    title: 'Spacer',
    description: 'Add vertical space between elements.',
    category: 'Basic',
  },
  {
    id: 'basic-google-maps',
    title: 'Google Maps',
    description: 'Embed a Google Map with a specific location.',
    category: 'Basic',
  },
  {
    id: 'basic-icon',
    title: 'Icon',
    description: 'Display an icon from the FontAwesome library or SVG.',
    category: 'Basic',
  },
  // Pro
  {
    id: 'pro-posts',
    title: 'Posts',
    description: 'Display a list of blog posts with various layout options.',
    category: 'Pro',
  },
  {
    id: 'pro-portfolio',
    title: 'Portfolio',
    description: 'Showcase your work in a filterable grid layout.',
    category: 'Pro',
  },
  {
    id: 'pro-slides',
    title: 'Slides',
    description: 'Create a slider with background images, text, and buttons.',
    category: 'Pro',
  },
  {
    id: 'pro-form',
    title: 'Form',
    description: 'Build contact forms, subscription forms, and more.',
    category: 'Pro',
  },
  {
    id: 'pro-login',
    title: 'Login',
    description: 'Add a login form to your page.',
    category: 'Pro',
  },
  {
    id: 'pro-nav-menu',
    title: 'Nav Menu',
    description: 'Add a navigation menu to any part of your page.',
    category: 'Pro',
  },
  {
    id: 'pro-animated-headline',
    title: 'Animated Headline',
    description: 'Create attention-grabbing headlines with animations.',
    category: 'Pro',
  },
  {
    id: 'pro-price-list',
    title: 'Price List',
    description: 'Display a list of items with prices (e.g., menus, catalogs).',
    category: 'Pro',
  },
  {
    id: 'pro-price-table',
    title: 'Price Table',
    description: 'Showcase pricing plans in a comparison table.',
    category: 'Pro',
  },
  {
    id: 'pro-flip-box',
    title: 'Flip Box',
    description: 'A box that flips on hover to reveal content on the back.',
    category: 'Pro',
  },
  {
    id: 'pro-call-to-action',
    title: 'Call to Action',
    description: 'A box combining an image, text, and button to drive action.',
    category: 'Pro',
  },
  {
    id: 'pro-media-carousel',
    title: 'Media Carousel',
    description: 'A carousel for images or videos with advanced styling.',
    category: 'Pro',
  },
  {
    id: 'pro-testimonial-carousel',
    title: 'Testimonial Carousel',
    description: 'Display client testimonials in a slider.',
    category: 'Pro',
  },
  {
    id: 'pro-reviews',
    title: 'Reviews',
    description: 'Show social proof with a carousel of reviews.',
    category: 'Pro',
  },
  {
    id: 'pro-table-of-contents',
    title: 'Table of Contents',
    description: 'Automatically generate a TOC based on page headings.',
    category: 'Pro',
  },
  {
    id: 'pro-countdown',
    title: 'Countdown',
    description: 'Add a countdown timer for events or offers.',
    category: 'Pro',
  },
  {
    id: 'pro-share-buttons',
    title: 'Share Buttons',
    description: 'Allow users to share your content on social media.',
    category: 'Pro',
  },
  {
    id: 'pro-blockquote',
    title: 'Blockquote',
    description: 'Display a quote with a tweet button.',
    category: 'Pro',
  },
  {
    id: 'pro-facebook-embed',
    title: 'Facebook Embed',
    description: 'Embed Facebook posts, comments, or pages.',
    category: 'Pro',
  },
  {
    id: 'pro-template',
    title: 'Template',
    description: 'Insert a saved Elementor template into the page.',
    category: 'Pro',
  },
  {
    id: 'pro-lottie',
    title: 'Lottie',
    description: 'Add lightweight, scalable Lottie animations.',
    category: 'Pro',
  },
  {
    id: 'pro-code-highlight',
    title: 'Code Highlight',
    description: 'Display code snippets with syntax highlighting.',
    category: 'Pro',
  },
  {
    id: 'pro-video-playlist',
    title: 'Video Playlist',
    description: 'Create a playlist of videos.',
    category: 'Pro',
  },
  {
    id: 'pro-hotspot',
    title: 'Hotspot',
    description: 'Add interactive hotspots to an image.',
    category: 'Pro',
  },
  {
    id: 'pro-stripe-button',
    title: 'Stripe Button',
    description: 'Accept payments via Stripe.',
    category: 'Pro',
  },
  {
    id: 'pro-paypal-button',
    title: 'PayPal Button',
    description: 'Accept payments via PayPal.',
    category: 'Pro',
  },
  {
    id: 'pro-progress-tracker',
    title: 'Progress Tracker',
    description: 'Display a horizontal or vertical progress tracker.',
    category: 'Pro',
  },
  // General
  {
    id: 'general-image-box',
    title: 'Image Box',
    description: 'A box containing an image, headline, and text.',
    category: 'General',
  },
  {
    id: 'general-icon-box',
    title: 'Icon Box',
    description: 'A box containing an icon, headline, and text.',
    category: 'General',
  },
  {
    id: 'general-star-rating',
    title: 'Star Rating',
    description: 'Display a star rating.',
    category: 'General',
  },
  {
    id: 'general-image-carousel',
    title: 'Image Carousel',
    description: 'A simple carousel for images.',
    category: 'General',
  },
  {
    id: 'general-basic-gallery',
    title: 'Basic Gallery',
    description: 'Display a grid of images.',
    category: 'General',
  },
  {
    id: 'general-icon-list',
    title: 'Icon List',
    description: 'A list of items with icons.',
    category: 'General',
  },
  {
    id: 'general-counter',
    title: 'Counter',
    description: 'Animated number counter.',
    category: 'General',
  },
  {
    id: 'general-progress-bar',
    title: 'Progress Bar',
    description: 'Animated progress bar.',
    category: 'General',
  },
  {
    id: 'general-testimonial',
    title: 'Testimonial',
    description: 'A single testimonial box.',
    category: 'General',
  },
  {
    id: 'general-tabs',
    title: 'Tabs',
    description: 'Vertical or horizontal tabs to organize content.',
    category: 'General',
  },
  {
    id: 'general-accordion',
    title: 'Accordion',
    description: 'Collapsible content sections.',
    category: 'General',
  },
  {
    id: 'general-toggle',
    title: 'Toggle',
    description: 'Similar to Accordion but allows multiple sections open.',
    category: 'General',
  },
  {
    id: 'general-social-icons',
    title: 'Social Icons',
    description: 'Links to social media profiles with icons.',
    category: 'General',
  },
  {
    id: 'general-alert',
    title: 'Alert',
    description: 'A colored alert box to display messages.',
    category: 'General',
  },
  {
    id: 'general-soundcloud',
    title: 'SoundCloud',
    description: 'Embed audio from SoundCloud.',
    category: 'General',
  },
  {
    id: 'general-shortcode',
    title: 'Shortcode',
    description: 'Insert a WordPress shortcode.',
    category: 'General',
  },
  {
    id: 'general-html',
    title: 'HTML',
    description: 'Insert custom HTML code.',
    category: 'General',
  },
  {
    id: 'general-menu-anchor',
    title: 'Menu Anchor',
    description: 'Link to a specific section on the page.',
    category: 'General',
  },
  {
    id: 'general-sidebar',
    title: 'Sidebar',
    description: 'Display a WordPress sidebar.',
    category: 'General',
  },
  {
    id: 'general-read-more',
    title: 'Read More',
    description: "Set the 'Read More' cut-off for archive pages.",
    category: 'General',
  },
  // Theme
  {
    id: 'theme-site-logo',
    title: 'Site Logo',
    description: 'Display the site logo.',
    category: 'Theme',
  },
  {
    id: 'theme-site-title',
    title: 'Site Title',
    description: 'Display the site title.',
    category: 'Theme',
  },
  {
    id: 'theme-page-title',
    title: 'Page Title',
    description: 'Display the current page title.',
    category: 'Theme',
  },
  {
    id: 'theme-post-title',
    title: 'Post Title',
    description: 'Display the current post title.',
    category: 'Theme',
  },
  {
    id: 'theme-post-excerpt',
    title: 'Post Excerpt',
    description: 'Display the current post excerpt.',
    category: 'Theme',
  },
  {
    id: 'theme-post-content',
    title: 'Post Content',
    description: 'Display the content of the current post.',
    category: 'Theme',
  },
  {
    id: 'theme-featured-image',
    title: 'Featured Image',
    description: 'Display the featured image of the current post.',
    category: 'Theme',
  },
  {
    id: 'theme-author-box',
    title: 'Author Box',
    description: 'Display the author of the current post.',
    category: 'Theme',
  },
  {
    id: 'theme-post-comments',
    title: 'Post Comments',
    description: 'Display the comments for the current post.',
    category: 'Theme',
  },
  {
    id: 'theme-post-navigation',
    title: 'Post Navigation',
    description: 'Display links to the next and previous posts.',
    category: 'Theme',
  },
  {
    id: 'theme-post-info',
    title: 'Post Info',
    description: 'Display meta info like date, time, and comments count.',
    category: 'Theme',
  },
  // WooCommerce
  {
    id: 'woo-product-title',
    title: 'Product Title',
    description: 'Display the product title.',
    category: 'WooCommerce',
  },
  {
    id: 'woo-product-images',
    title: 'Product Images',
    description: 'Display the product gallery images.',
    category: 'WooCommerce',
  },
  {
    id: 'woo-product-price',
    title: 'Product Price',
    description: 'Display the product price.',
    category: 'WooCommerce',
  },
  {
    id: 'woo-add-to-cart',
    title: 'Add to Cart',
    description: 'Display the add to cart button.',
    category: 'WooCommerce',
  },
  {
    id: 'woo-product-rating',
    title: 'Product Rating',
    description: 'Display the product star rating.',
    category: 'WooCommerce',
  },
  {
    id: 'woo-product-stock',
    title: 'Product Stock',
    description: 'Display the product stock status.',
    category: 'WooCommerce',
  },
  {
    id: 'woo-product-meta',
    title: 'Product Meta',
    description: 'Display product SKU, categories, and tags.',
    category: 'WooCommerce',
  },
  {
    id: 'woo-product-description',
    title: 'Product Description',
    description: 'Display the product short description.',
    category: 'WooCommerce',
  },
  {
    id: 'woo-product-data-tabs',
    title: 'Product Data Tabs',
    description:
      'Display product tabs (Description, Additional Info, Reviews).',
    category: 'WooCommerce',
  },
  {
    id: 'woo-upsells',
    title: 'Upsells',
    description: 'Display upsell products.',
    category: 'WooCommerce',
  },
  {
    id: 'woo-related-products',
    title: 'Related Products',
    description: 'Display related products.',
    category: 'WooCommerce',
  },
  {
    id: 'woo-menu-cart',
    title: 'Menu Cart',
    description: 'Display a cart icon with item count.',
    category: 'WooCommerce',
  },
];

const CATEGORY_META: Record<
  WidgetCategory,
  { label: string; color: string; bg: string; description: string }
> = {
  Basic: {
    label: 'Basic',
    color: 'text-teal-700',
    bg: 'bg-teal-50',
    description: 'Core building blocks — text, images, video, buttons.',
  },
  Pro: {
    label: 'Pro',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    description: 'Advanced interactive widgets for richer experiences.',
  },
  General: {
    label: 'General',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    description: 'Versatile utility widgets covering common page patterns.',
  },
  Theme: {
    label: 'Theme',
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    description: 'Dynamic widgets that pull in theme and post data.',
  },
  WooCommerce: {
    label: 'WooCommerce',
    color: 'text-rose-700',
    bg: 'bg-rose-50',
    description: 'E-commerce widgets for product pages and shops.',
  },
};

const CATEGORIES: WidgetCategory[] = [
  'Basic',
  'Pro',
  'General',
  'Theme',
  'WooCommerce',
];

export default function WidgetsPage() {
  const grouped = CATEGORIES.map((cat) => ({
    category: cat,
    meta: CATEGORY_META[cat],
    widgets: WIDGETS.filter((w) => w.category === cat),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://nexova.co',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Elements',
                item: 'https://nexova.co/elements',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: 'Widgets',
                item: 'https://nexova.co/elements/widgets',
              },
            ],
          }),
        }}
      />

      {/* Hero */}
      <section className="bg-white pt-20 pb-10 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <RevealOnScroll>
            <nav
              aria-label="Breadcrumb"
              className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-6"
            >
              <Link
                href="/elements"
                className="hover:text-[#5BC0BE] transition-colors"
              >
                Elements
              </Link>
              <span>/</span>
              <span className="text-gray-600">Widgets</span>
            </nav>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#5FC7CD] mb-4">
              UI Widgets Reference
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#455263] mb-5 leading-tight">
              {WIDGETS.length}+ widgets,{' '}
              <span className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] bg-clip-text text-transparent">
                every component covered
              </span>
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
              A full reference of Elementor Basic, Pro, General, Theme, and
              WooCommerce widgets — with descriptions to guide your build.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/elements">
                <Button className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] hover:opacity-90 text-white rounded-full px-8 py-3 shadow-md border-0">
                  Animation Gallery
                </Button>
              </Link>
              <Link href="/elements/layouts">
                <Button variant="outline" className="rounded-full px-8 py-3">
                  Layout Sections
                </Button>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Category jump bar */}
      <div className="bg-white border-b border-gray-100 sticky top-20 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {CATEGORIES.map((cat) => (
              <a
                key={cat}
                href={`#${cat.toLowerCase()}`}
                className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border border-gray-200 text-gray-600 hover:border-[#5BC0BE] hover:text-[#5BC0BE] transition-colors"
              >
                {cat}
                <span className="ml-1.5 text-xs text-gray-400">
                  {WIDGETS.filter((w) => w.category === cat).length}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Widget groups */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl space-y-16">
          {grouped.map(({ category, meta, widgets }) => (
            <section key={category} id={category.toLowerCase()}>
              <RevealOnScroll>
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${meta.bg} ${meta.color}`}
                    >
                      {meta.label}
                    </span>
                    <span className="text-xs text-gray-400">
                      {widgets.length} widgets
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#455263]">
                    {category} Widgets
                  </h2>
                  <p className="text-gray-500 mt-1">{meta.description}</p>
                </div>
              </RevealOnScroll>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {widgets.map((widget, i) => (
                  <RevealOnScroll key={widget.id} delay={Math.min(i * 40, 200)}>
                    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-[#455263] text-sm leading-snug">
                          {widget.title}
                        </h3>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ml-2 flex-shrink-0 ${meta.bg} ${meta.color}`}
                        >
                          {category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed flex-1">
                        {widget.description}
                      </p>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* Sub-nav: explore more elements */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
          <RevealOnScroll>
            <h2 className="text-3xl font-bold text-[#455263] mb-4">
              Explore the full Elements library
            </h2>
            <p className="text-gray-500 mb-10 max-w-xl mx-auto">
              100+ animations, 29 layout sections, and the widget reference —
              all in one place.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Link href="/elements">
                <div className="group bg-gray-50 border border-gray-100 rounded-2xl p-8 hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-left">
                  <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#5FC7CD] mb-3">
                    Animations
                  </span>
                  <h3 className="text-lg font-bold text-[#455263] mb-2 group-hover:text-[#5BC0BE] transition-colors">
                    100+ UI Animations
                  </h3>
                  <p className="text-sm text-gray-500">
                    Live previews, copy-ready code, real-time customisation.
                  </p>
                </div>
              </Link>
              <Link href="/elements/layouts">
                <div className="group bg-gray-50 border border-gray-100 rounded-2xl p-8 hover:shadow-md hover:-translate-y-1 transition-all duration-300 text-left">
                  <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#7C74EA] mb-3">
                    Layouts
                  </span>
                  <h3 className="text-lg font-bold text-[#455263] mb-2 group-hover:text-[#5BC0BE] transition-colors">
                    29 Layout Sections
                  </h3>
                  <p className="text-sm text-gray-500">
                    Hero, features, pricing, testimonials, CTAs — pre-built and
                    ready.
                  </p>
                </div>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#5BC0BE] to-[#7C74EA] py-20 text-white text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <RevealOnScroll>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Build your page with X.IDE
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Drag, drop, and publish — all elements are available directly
              inside the builder.
            </p>
            <Link href="/signup">
              <Button className="bg-white text-[#5BC0BE] hover:bg-gray-50 font-semibold rounded-full px-10 py-3 shadow-md border-0">
                Launch X.IDE Builder →
              </Button>
            </Link>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}
