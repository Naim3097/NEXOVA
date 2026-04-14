export interface ElementorWidget {
  id: string;
  title: string;
  description: string;
  category: "Basic" | "Pro" | "General" | "Theme" | "WooCommerce";
  icon?: string; // We can add icon names later if needed
}

export const elementorWidgets: ElementorWidget[] = [
  // Basic
  {
    id: "basic-heading",
    title: "Heading",
    description: "Add headings to your page to structure content.",
    category: "Basic",
  },
  {
    id: "basic-image",
    title: "Image",
    description: "Insert images into your page with various styling options.",
    category: "Basic",
  },
  {
    id: "basic-text-editor",
    title: "Text Editor",
    description: "A WYSIWYG text editor for adding paragraphs and rich text.",
    category: "Basic",
  },
  {
    id: "basic-video",
    title: "Video",
    description: "Embed videos from YouTube, Vimeo, or self-hosted sources.",
    category: "Basic",
  },
  {
    id: "basic-button",
    title: "Button",
    description: "Add clickable buttons with custom styles and links.",
    category: "Basic",
  },
  {
    id: "basic-divider",
    title: "Divider",
    description: "A simple line to separate content sections.",
    category: "Basic",
  },
  {
    id: "basic-spacer",
    title: "Spacer",
    description: "Add vertical space between elements.",
    category: "Basic",
  },
  {
    id: "basic-google-maps",
    title: "Google Maps",
    description: "Embed a Google Map with a specific location.",
    category: "Basic",
  },
  {
    id: "basic-icon",
    title: "Icon",
    description: "Display an icon from the FontAwesome library or SVG.",
    category: "Basic",
  },

  // Pro
  {
    id: "pro-posts",
    title: "Posts",
    description: "Display a list of blog posts with various layout options.",
    category: "Pro",
  },
  {
    id: "pro-portfolio",
    title: "Portfolio",
    description: "Showcase your work in a filterable grid layout.",
    category: "Pro",
  },
  {
    id: "pro-slides",
    title: "Slides",
    description: "Create a slider with background images, text, and buttons.",
    category: "Pro",
  },
  {
    id: "pro-form",
    title: "Form",
    description: "Build contact forms, subscription forms, and more.",
    category: "Pro",
  },
  {
    id: "pro-login",
    title: "Login",
    description: "Add a login form to your page.",
    category: "Pro",
  },
  {
    id: "pro-nav-menu",
    title: "Nav Menu",
    description: "Add a navigation menu to any part of your page.",
    category: "Pro",
  },
  {
    id: "pro-animated-headline",
    title: "Animated Headline",
    description: "Create attention-grabbing headlines with animations.",
    category: "Pro",
  },
  {
    id: "pro-price-list",
    title: "Price List",
    description: "Display a list of items with prices (e.g., menus, catalogs).",
    category: "Pro",
  },
  {
    id: "pro-price-table",
    title: "Price Table",
    description: "Showcase pricing plans in a comparison table.",
    category: "Pro",
  },
  {
    id: "pro-flip-box",
    title: "Flip Box",
    description: "A box that flips on hover to reveal content on the back.",
    category: "Pro",
  },
  {
    id: "pro-call-to-action",
    title: "Call to Action",
    description: "A box combining an image, text, and button to drive action.",
    category: "Pro",
  },
  {
    id: "pro-media-carousel",
    title: "Media Carousel",
    description: "A carousel for images or videos with advanced styling.",
    category: "Pro",
  },
  {
    id: "pro-testimonial-carousel",
    title: "Testimonial Carousel",
    description: "Display client testimonials in a slider.",
    category: "Pro",
  },
  {
    id: "pro-reviews",
    title: "Reviews",
    description: "Show social proof with a carousel of reviews.",
    category: "Pro",
  },
  {
    id: "pro-table-of-contents",
    title: "Table of Contents",
    description: "Automatically generate a TOC based on page headings.",
    category: "Pro",
  },
  {
    id: "pro-countdown",
    title: "Countdown",
    description: "Add a countdown timer for events or offers.",
    category: "Pro",
  },
  {
    id: "pro-share-buttons",
    title: "Share Buttons",
    description: "Allow users to share your content on social media.",
    category: "Pro",
  },
  {
    id: "pro-blockquote",
    title: "Blockquote",
    description: "Display a quote with a tweet button.",
    category: "Pro",
  },
  {
    id: "pro-facebook-embed",
    title: "Facebook Embed",
    description: "Embed Facebook posts, comments, or pages.",
    category: "Pro",
  },
  {
    id: "pro-template",
    title: "Template",
    description: "Insert a saved Elementor template into the page.",
    category: "Pro",
  },
  {
    id: "pro-lottie",
    title: "Lottie",
    description: "Add lightweight, scalable Lottie animations.",
    category: "Pro",
  },
  {
    id: "pro-code-highlight",
    title: "Code Highlight",
    description: "Display code snippets with syntax highlighting.",
    category: "Pro",
  },
  {
    id: "pro-video-playlist",
    title: "Video Playlist",
    description: "Create a playlist of videos.",
    category: "Pro",
  },
  {
    id: "pro-hotspot",
    title: "Hotspot",
    description: "Add interactive hotspots to an image.",
    category: "Pro",
  },
  {
    id: "pro-stripe-button",
    title: "Stripe Button",
    description: "Accept payments via Stripe.",
    category: "Pro",
  },
  {
    id: "pro-paypal-button",
    title: "PayPal Button",
    description: "Accept payments via PayPal.",
    category: "Pro",
  },
  {
    id: "pro-progress-tracker",
    title: "Progress Tracker",
    description: "Display a horizontal or vertical progress tracker.",
    category: "Pro",
  },

  // General
  {
    id: "general-image-box",
    title: "Image Box",
    description: "A box containing an image, headline, and text.",
    category: "General",
  },
  {
    id: "general-icon-box",
    title: "Icon Box",
    description: "A box containing an icon, headline, and text.",
    category: "General",
  },
  {
    id: "general-star-rating",
    title: "Star Rating",
    description: "Display a star rating.",
    category: "General",
  },
  {
    id: "general-image-carousel",
    title: "Image Carousel",
    description: "A simple carousel for images.",
    category: "General",
  },
  {
    id: "general-basic-gallery",
    title: "Basic Gallery",
    description: "Display a grid of images.",
    category: "General",
  },
  {
    id: "general-icon-list",
    title: "Icon List",
    description: "A list of items with icons.",
    category: "General",
  },
  {
    id: "general-counter",
    title: "Counter",
    description: "Animated number counter.",
    category: "General",
  },
  {
    id: "general-progress-bar",
    title: "Progress Bar",
    description: "Animated progress bar.",
    category: "General",
  },
  {
    id: "general-testimonial",
    title: "Testimonial",
    description: "A single testimonial box.",
    category: "General",
  },
  {
    id: "general-tabs",
    title: "Tabs",
    description: "Vertical or horizontal tabs to organize content.",
    category: "General",
  },
  {
    id: "general-accordion",
    title: "Accordion",
    description: "Collapsible content sections.",
    category: "General",
  },
  {
    id: "general-toggle",
    title: "Toggle",
    description: "Similar to Accordion but allows multiple sections open.",
    category: "General",
  },
  {
    id: "general-social-icons",
    title: "Social Icons",
    description: "Links to social media profiles with icons.",
    category: "General",
  },
  {
    id: "general-alert",
    title: "Alert",
    description: "A colored alert box to display messages.",
    category: "General",
  },
  {
    id: "general-soundcloud",
    title: "SoundCloud",
    description: "Embed audio from SoundCloud.",
    category: "General",
  },
  {
    id: "general-shortcode",
    title: "Shortcode",
    description: "Insert a WordPress shortcode.",
    category: "General",
  },
  {
    id: "general-html",
    title: "HTML",
    description: "Insert custom HTML code.",
    category: "General",
  },
  {
    id: "general-menu-anchor",
    title: "Menu Anchor",
    description: "Link to a specific section on the page.",
    category: "General",
  },
  {
    id: "general-sidebar",
    title: "Sidebar",
    description: "Display a WordPress sidebar.",
    category: "General",
  },
  {
    id: "general-read-more",
    title: "Read More",
    description: "Set the 'Read More' cut-off for archive pages.",
    category: "General",
  },

  // Theme
  {
    id: "theme-site-logo",
    title: "Site Logo",
    description: "Display the site logo.",
    category: "Theme",
  },
  {
    id: "theme-site-title",
    title: "Site Title",
    description: "Display the site title.",
    category: "Theme",
  },
  {
    id: "theme-page-title",
    title: "Page Title",
    description: "Display the current page title.",
    category: "Theme",
  },
  {
    id: "theme-post-title",
    title: "Post Title",
    description: "Display the current post title.",
    category: "Theme",
  },
  {
    id: "theme-post-excerpt",
    title: "Post Excerpt",
    description: "Display the current post excerpt.",
    category: "Theme",
  },
  {
    id: "theme-post-content",
    title: "Post Content",
    description: "Display the content of the current post.",
    category: "Theme",
  },
  {
    id: "theme-featured-image",
    title: "Featured Image",
    description: "Display the featured image of the current post.",
    category: "Theme",
  },
  {
    id: "theme-author-box",
    title: "Author Box",
    description: "Display the author of the current post.",
    category: "Theme",
  },
  {
    id: "theme-post-comments",
    title: "Post Comments",
    description: "Display the comments for the current post.",
    category: "Theme",
  },
  {
    id: "theme-post-navigation",
    title: "Post Navigation",
    description: "Display links to the next and previous posts.",
    category: "Theme",
  },
  {
    id: "theme-post-info",
    title: "Post Info",
    description: "Display meta info like date, time, and comments count.",
    category: "Theme",
  },

  // WooCommerce
  {
    id: "woo-product-title",
    title: "Product Title",
    description: "Display the product title.",
    category: "WooCommerce",
  },
  {
    id: "woo-product-images",
    title: "Product Images",
    description: "Display the product gallery images.",
    category: "WooCommerce",
  },
  {
    id: "woo-product-price",
    title: "Product Price",
    description: "Display the product price.",
    category: "WooCommerce",
  },
  {
    id: "woo-add-to-cart",
    title: "Add to Cart",
    description: "Display the add to cart button.",
    category: "WooCommerce",
  },
  {
    id: "woo-product-rating",
    title: "Product Rating",
    description: "Display the product star rating.",
    category: "WooCommerce",
  },
  {
    id: "woo-product-stock",
    title: "Product Stock",
    description: "Display the product stock status.",
    category: "WooCommerce",
  },
  {
    id: "woo-product-meta",
    title: "Product Meta",
    description: "Display product SKU, categories, and tags.",
    category: "WooCommerce",
  },
  {
    id: "woo-product-description",
    title: "Product Description",
    description: "Display the product short description.",
    category: "WooCommerce",
  },
  {
    id: "woo-product-data-tabs",
    title: "Product Data Tabs",
    description: "Display product tabs (Description, Additional Info, Reviews).",
    category: "WooCommerce",
  },
  {
    id: "woo-upsells",
    title: "Upsells",
    description: "Display upsell products.",
    category: "WooCommerce",
  },
  {
    id: "woo-related-products",
    title: "Related Products",
    description: "Display related products.",
    category: "WooCommerce",
  },
  {
    id: "woo-menu-cart",
    title: "Menu Cart",
    description: "Display a cart icon with item count.",
    category: "WooCommerce",
  },
];
