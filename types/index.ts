// Database types
export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  email: string | null;
  subdomain: string | null; // User's subdomain (e.g., "johndoe" for johndoe.xide.app)
  subscription_plan: 'free' | 'pro'; // Simplified 2-tier model
  subscription_status: 'active' | 'cancelled' | 'expired';
  settings: Record<string, any>;
  // LeanX Payment Integration
  leanx_api_key: string | null;
  leanx_secret_key: string | null;
  leanx_merchant_id: string | null;
  leanx_enabled: boolean;
  leanx_environment: 'test' | 'live';
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  slug: string | null;
  description: string | null;
  status: 'draft' | 'published';
  element_count: number;
  current_version: number;
  published_url: string | null;
  seo_settings: SEOSettings;
  integrations: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Element {
  id: string;
  project_id: string;
  type: ElementType;
  order: number;
  props: Record<string, any>;
  version: number;
  created_at: string;
  updated_at: string;
}

export type ElementType =
  | 'announcement_bar'
  | 'navigation'
  | 'hero'
  | 'features'
  | 'testimonials'
  | 'faq'
  | 'cta'
  | 'payment_button'
  | 'footer'
  | 'pricing'
  | 'lead_form'
  | 'whatsapp_button'
  | 'form_with_payment';

export interface Template {
  id: string;
  name: string;
  slug: string;
  category: string;
  industry: string;
  description: string;
  thumbnail_url: string;
  preview_url: string;
  data: {
    elements: Element[];
    seo_settings: SEOSettings;
    theme: {
      primaryColor: string;
      fontFamily: string;
    };
  };
  is_public: boolean;
  usage_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface SEOSettings {
  title: string;
  description: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType: 'website' | 'article' | 'product';
  twitterCard: 'summary' | 'summary_large_image';
  twitterSite?: string;
  canonicalUrl?: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
  structuredData?: Record<string, any>;
  preloadAssets?: string[];
  language: string;
  hreflang?: Array<{ lang: string; url: string }>;
}

export interface FormSubmission {
  id: string;
  project_id: string;
  form_id: string;
  data: Record<string, any>;
  ip_address: string | null;
  user_agent: string | null;
  submitted_at: string;
}

export interface AnalyticsEvent {
  id: string;
  project_id: string;
  event_type: string;
  session_id: string;
  device_type: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export interface ProjectVersion {
  id: string;
  project_id: string;
  version_number: number;
  snapshot_type: 'full' | 'delta';
  data: Record<string, any>;
  base_version: number | null;
  created_by: string;
  is_auto_save: boolean;
  label: string | null;
  created_at: string;
}

// Component prop types
export interface HeroProps {
  variant: 'image_left' | 'image_bg' | 'centered';
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaUrl: string;
  image?: string;
  bgColor: string;
  // Text styling options
  headlineColor?: string;
  subheadlineColor?: string;
  headlineSize?: string; // e.g., '3xl', '4xl', '5xl', '6xl'
  subheadlineSize?: string; // e.g., 'base', 'lg', 'xl', '2xl'
  // Image background opacity (0-100)
  imageOpacity?: number;
  // Button styling options
  buttonBgColor?: string;
  buttonTextColor?: string;
}

export interface FeaturesProps {
  variant: 'grid' | 'list' | 'alternating';
  title: string;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  // Background image options
  backgroundImage?: string;
  backgroundOpacity?: number; // 0-100
  bgColor?: string;
}

export interface TestimonialsProps {
  variant: 'slider' | 'grid' | 'masonry';
  title: string;
  testimonials: Array<{
    name: string;
    role: string;
    avatar: string;
    quote: string;
    rating: number;
  }>;
  // Background image options
  backgroundImage?: string;
  backgroundOpacity?: number; // 0-100
  bgColor?: string;
}

export interface FAQProps {
  variant: 'single_column' | 'two_column';
  title: string;
  questions: Array<{
    question: string;
    answer: string;
  }>;
  // Background image options
  backgroundImage?: string;
  backgroundOpacity?: number; // 0-100
  bgColor?: string;
}

export interface CTAProps {
  variant: 'centered' | 'split' | 'banner';
  headline: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  bgGradient: string;
  // Background image options
  backgroundImage?: string;
  backgroundOpacity?: number; // 0-100
  // Button customization options
  buttonColor?: string;
  buttonTextColor?: string;
  buttonSize?: 'sm' | 'md' | 'lg';
  buttonFontSize?: string; // e.g., '1rem', '1.125rem', '1.25rem'
}

export interface AnnouncementBarProps {
  message: string;
  bgColor: string;
  textColor: string;
  showCountdown: boolean;
  countdownLabel?: string;
  countdownEndDate?: string;
  isSticky: boolean;
  showCloseButton: boolean;
  link?: string;
  linkText?: string;
}

export interface NavigationProps {
  logo: string;
  logoText: string;
  menuItems: Array<{
    label: string;
    url: string;
  }>;
  ctaButton?: {
    text: string;
    url: string;
  };
  bgColor: string;
  textColor: string;
  isSticky: boolean;
  layout: 'left' | 'center' | 'split';
}

export interface FooterProps {
  logo: string;
  logoText: string;
  description?: string;
  columns: Array<{
    title: string;
    links: Array<{
      label: string;
      url: string;
    }>;
  }>;
  socialLinks?: Array<{
    platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube';
    url: string;
  }>;
  copyright: string;
  bgColor: string;
  textColor: string;
  // Background image options
  backgroundImage?: string;
  backgroundOpacity?: number; // 0-100
}

export interface PricingProps {
  title: string;
  subtitle?: string;
  plans: Array<{
    name: string;
    price: string;
    currency: string;
    period: string;
    description: string;
    features: string[]; // Eligibility/features list
    buttonText: string;
    buttonUrl?: string; // Optional if using payment integration
    highlighted?: boolean;
    // Payment integration fields
    enablePayment?: boolean; // Enable LeanX payment for this plan
    productId?: string; // Internal product ID for payment
    priceNumeric?: number; // Numeric price for payment processing
  }>;
  layout: 'cards' | 'table';
  // Background image options
  backgroundImage?: string;
  backgroundOpacity?: number; // 0-100
  bgColor?: string;
  // Global payment settings
  enablePaymentIntegration?: boolean; // Enable payment for all plans
}

// LeanX Payment Integration Types

export interface Transaction {
  id: string;
  user_id: string;
  project_id: string;
  transaction_id: string; // LeanX transaction ID
  order_id: string; // Internal order ID

  // Product information
  product_name: string;
  product_description: string | null;
  amount: number;
  currency: string;

  // Bump offer (upsell)
  has_bump_offer: boolean;
  bump_offer_name: string | null;
  bump_offer_amount: number | null;
  bump_offer_accepted: boolean;

  // Total amount
  total_amount: number;

  // Customer information
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;

  // Payment status
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  payment_method: string | null;

  // LeanX specific
  leanx_payment_url: string | null;
  leanx_response: Record<string, any> | null;

  // Metadata
  ip_address: string | null;
  user_agent: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface TransactionStats {
  total_transactions: number;
  successful_transactions: number;
  failed_transactions: number;
  cancelled_transactions: number;
  total_revenue: number;
  today_revenue: number;
  today_transactions: number;
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  image?: string; // Product image URL
  featured?: boolean; // Highlight as featured/popular
}

export interface PaymentButtonProps {
  // Multiple products support
  products: Product[];
  currency: string;

  // Legacy single product fields (for backwards compatibility)
  productName?: string;
  productDescription?: string;
  amount?: number;
  productImage?: string;

  // Button styling
  buttonText: string;
  buttonColor: string;
  buttonSize: 'sm' | 'md' | 'lg';

  // Bump offer (upsell)
  enableBumpOffer: boolean;
  bumpOfferName?: string;
  bumpOfferDescription?: string;
  bumpOfferAmount?: number;
  bumpOfferDiscount?: number; // Percentage discount
  bumpOfferImage?: string; // Bump offer image

  // Success/failure handling
  successUrl?: string;
  successMessage: string;
  failureMessage: string;

  // Styling
  bgColor: string;
}

export interface CheckoutFormData {
  // Silent Bill method - bank selection instead of card details
  bankId: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface BumpOfferData {
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number; // Percentage
}

// Form with Payment Element Types
// Uses the same Product type as PaymentButton for consistency
