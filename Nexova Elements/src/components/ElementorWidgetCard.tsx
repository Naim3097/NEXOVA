"use client";

import { motion } from "framer-motion";
import { ElementorWidget } from "@/data/elementor-widgets";
import { ArrowRight, Box, Layers, Layout, ShoppingCart, Star, Code, X, Copy, Check, Settings2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { getElementorCode } from "@/actions/getElementorCode";

// Basic Widgets
const HeadingWidget = dynamic(() => import("./elementor/basic/HeadingWidget"));
const ImageWidget = dynamic(() => import("./elementor/basic/ImageWidget"));
const TextEditorWidget = dynamic(() => import("./elementor/basic/TextEditorWidget"));
const VideoWidget = dynamic(() => import("./elementor/basic/VideoWidget"));
const ButtonWidget = dynamic(() => import("./elementor/basic/ButtonWidget"));
const DividerWidget = dynamic(() => import("./elementor/basic/DividerWidget"));
const SpacerWidget = dynamic(() => import("./elementor/basic/SpacerWidget"));
const GoogleMapsWidget = dynamic(() => import("./elementor/basic/GoogleMapsWidget"));
const IconWidget = dynamic(() => import("./elementor/basic/IconWidget"));

// Pro Widgets
const PostsWidget = dynamic(() => import("./elementor/pro/PostsWidget"));
const PortfolioWidget = dynamic(() => import("./elementor/pro/PortfolioWidget"));
const SlidesWidget = dynamic(() => import("./elementor/pro/SlidesWidget"));
const FormWidget = dynamic(() => import("./elementor/pro/FormWidget"));
const LoginWidget = dynamic(() => import("./elementor/pro/LoginWidget"));
const NavMenuWidget = dynamic(() => import("./elementor/pro/NavMenuWidget"));
const AnimatedHeadlineWidget = dynamic(() => import("./elementor/pro/AnimatedHeadlineWidget"));
const PriceListWidget = dynamic(() => import("./elementor/pro/PriceListWidget"));
const PriceTableWidget = dynamic(() => import("./elementor/pro/PriceTableWidget"));
const FlipBoxWidget = dynamic(() => import("./elementor/pro/FlipBoxWidget"));
const CallToActionWidget = dynamic(() => import("./elementor/pro/CallToActionWidget"));
const MediaCarouselWidget = dynamic(() => import("./elementor/pro/MediaCarouselWidget"));
const TestimonialCarouselWidget = dynamic(() => import("./elementor/pro/TestimonialCarouselWidget"));
const ReviewsWidget = dynamic(() => import("./elementor/pro/ReviewsWidget"));
const TableOfContentsWidget = dynamic(() => import("./elementor/pro/TableOfContentsWidget"));
const CountdownWidget = dynamic(() => import("./elementor/pro/CountdownWidget"));
const ShareButtonsWidget = dynamic(() => import("./elementor/pro/ShareButtonsWidget"));
const BlockquoteWidget = dynamic(() => import("./elementor/pro/BlockquoteWidget"));
const FacebookEmbedWidget = dynamic(() => import("./elementor/pro/FacebookEmbedWidget"));
const TemplateWidget = dynamic(() => import("./elementor/pro/TemplateWidget"));
const LottieWidget = dynamic(() => import("./elementor/pro/LottieWidget"));
const CodeHighlightWidget = dynamic(() => import("./elementor/pro/CodeHighlightWidget"));
const VideoPlaylistWidget = dynamic(() => import("./elementor/pro/VideoPlaylistWidget"));
const HotspotWidget = dynamic(() => import("./elementor/pro/HotspotWidget"));
const StripeButtonWidget = dynamic(() => import("./elementor/pro/StripeButtonWidget"));
const PayPalButtonWidget = dynamic(() => import("./elementor/pro/PayPalButtonWidget"));
const ProgressTrackerWidget = dynamic(() => import("./elementor/pro/ProgressTrackerWidget"));

// General Widgets
const ImageBoxWidget = dynamic(() => import("./elementor/general/ImageBoxWidget"));
const IconBoxWidget = dynamic(() => import("./elementor/general/IconBoxWidget"));
const StarRatingWidget = dynamic(() => import("./elementor/general/StarRatingWidget"));
const ImageCarouselWidget = dynamic(() => import("./elementor/general/ImageCarouselWidget"));
const BasicGalleryWidget = dynamic(() => import("./elementor/general/BasicGalleryWidget"));
const IconListWidget = dynamic(() => import("./elementor/general/IconListWidget"));
const CounterWidget = dynamic(() => import("./elementor/general/CounterWidget"));
const ProgressBarWidget = dynamic(() => import("./elementor/general/ProgressBarWidget"));
const TestimonialWidget = dynamic(() => import("./elementor/general/TestimonialWidget"));
const TabsWidget = dynamic(() => import("./elementor/general/TabsWidget"));
const AccordionWidget = dynamic(() => import("./elementor/general/AccordionWidget"));
const ToggleWidget = dynamic(() => import("./elementor/general/ToggleWidget"));
const SocialIconsWidget = dynamic(() => import("./elementor/general/SocialIconsWidget"));
const AlertWidget = dynamic(() => import("./elementor/general/AlertWidget"));
const SoundCloudWidget = dynamic(() => import("./elementor/general/SoundCloudWidget"));
const ShortcodeWidget = dynamic(() => import("./elementor/general/ShortcodeWidget"));
const HTMLWidget = dynamic(() => import("./elementor/general/HTMLWidget"));
const MenuAnchorWidget = dynamic(() => import("./elementor/general/MenuAnchorWidget"));
const SidebarWidget = dynamic(() => import("./elementor/general/SidebarWidget"));
const ReadMoreWidget = dynamic(() => import("./elementor/general/ReadMoreWidget"));

// Theme Widgets
const SiteLogoWidget = dynamic(() => import("./elementor/theme/SiteLogoWidget"));
const SiteTitleWidget = dynamic(() => import("./elementor/theme/SiteTitleWidget"));
const PageTitleWidget = dynamic(() => import("./elementor/theme/PageTitleWidget"));
const PostTitleWidget = dynamic(() => import("./elementor/theme/PostTitleWidget"));
const PostExcerptWidget = dynamic(() => import("./elementor/theme/PostExcerptWidget"));
const PostContentWidget = dynamic(() => import("./elementor/theme/PostContentWidget"));
const FeaturedImageWidget = dynamic(() => import("./elementor/theme/FeaturedImageWidget"));
const AuthorBoxWidget = dynamic(() => import("./elementor/theme/AuthorBoxWidget"));
const PostCommentsWidget = dynamic(() => import("./elementor/theme/PostCommentsWidget"));
const PostNavigationWidget = dynamic(() => import("./elementor/theme/PostNavigationWidget"));
const PostInfoWidget = dynamic(() => import("./elementor/theme/PostInfoWidget"));

// WooCommerce Widgets
const ProductTitleWidget = dynamic(() => import("./elementor/woocommerce/ProductTitleWidget"));
const ProductImagesWidget = dynamic(() => import("./elementor/woocommerce/ProductImagesWidget"));
const ProductPriceWidget = dynamic(() => import("./elementor/woocommerce/ProductPriceWidget"));
const AddToCartWidget = dynamic(() => import("./elementor/woocommerce/AddToCartWidget"));
const ProductRatingWidget = dynamic(() => import("./elementor/woocommerce/ProductRatingWidget"));
const ProductStockWidget = dynamic(() => import("./elementor/woocommerce/ProductStockWidget"));
const ProductMetaWidget = dynamic(() => import("./elementor/woocommerce/ProductMetaWidget"));
const ProductDescriptionWidget = dynamic(() => import("./elementor/woocommerce/ProductDescriptionWidget"));
const ProductDataTabsWidget = dynamic(() => import("./elementor/woocommerce/ProductDataTabsWidget"));
const UpsellsWidget = dynamic(() => import("./elementor/woocommerce/UpsellsWidget"));
const RelatedProductsWidget = dynamic(() => import("./elementor/woocommerce/RelatedProductsWidget"));
const MenuCartWidget = dynamic(() => import("./elementor/woocommerce/MenuCartWidget"));

const WIDGET_MAP: Record<string, React.ComponentType<any>> = {
  "basic-heading": HeadingWidget,
  "basic-image": ImageWidget,
  "basic-text-editor": TextEditorWidget,
  "basic-video": VideoWidget,
  "basic-button": ButtonWidget,
  "basic-divider": DividerWidget,
  "basic-spacer": SpacerWidget,
  "basic-google-maps": GoogleMapsWidget,
  "basic-icon": IconWidget,

  // Pro
  "pro-posts": PostsWidget,
  "pro-portfolio": PortfolioWidget,
  "pro-slides": SlidesWidget,
  "pro-form": FormWidget,
  "pro-login": LoginWidget,
  "pro-nav-menu": NavMenuWidget,
  "pro-animated-headline": AnimatedHeadlineWidget,
  "pro-price-list": PriceListWidget,
  "pro-price-table": PriceTableWidget,
  "pro-flip-box": FlipBoxWidget,
  "pro-call-to-action": CallToActionWidget,
  "pro-media-carousel": MediaCarouselWidget,
  "pro-testimonial-carousel": TestimonialCarouselWidget,
  "pro-reviews": ReviewsWidget,
  "pro-table-of-contents": TableOfContentsWidget,
  "pro-countdown": CountdownWidget,
  "pro-share-buttons": ShareButtonsWidget,
  "pro-blockquote": BlockquoteWidget,
  "pro-facebook-embed": FacebookEmbedWidget,
  "pro-template": TemplateWidget,
  "pro-lottie": LottieWidget,
  "pro-code-highlight": CodeHighlightWidget,
  "pro-video-playlist": VideoPlaylistWidget,
  "pro-hotspot": HotspotWidget,
  "pro-stripe-button": StripeButtonWidget,
  "pro-paypal-button": PayPalButtonWidget,
  "pro-progress-tracker": ProgressTrackerWidget,

  // General
  "general-image-box": ImageBoxWidget,
  "general-icon-box": IconBoxWidget,
  "general-star-rating": StarRatingWidget,
  "general-image-carousel": ImageCarouselWidget,
  "general-basic-gallery": BasicGalleryWidget,
  "general-icon-list": IconListWidget,
  "general-counter": CounterWidget,
  "general-progress-bar": ProgressBarWidget,
  "general-testimonial": TestimonialWidget,
  "general-tabs": TabsWidget,
  "general-accordion": AccordionWidget,
  "general-toggle": ToggleWidget,
  "general-social-icons": SocialIconsWidget,
  "general-alert": AlertWidget,
  "general-soundcloud": SoundCloudWidget,
  "general-shortcode": ShortcodeWidget,
  "general-html": HTMLWidget,
  "general-menu-anchor": MenuAnchorWidget,
  "general-sidebar": SidebarWidget,
  "general-read-more": ReadMoreWidget,

  // Theme
  "theme-site-logo": SiteLogoWidget,
  "theme-site-title": SiteTitleWidget,
  "theme-page-title": PageTitleWidget,
  "theme-post-title": PostTitleWidget,
  "theme-post-excerpt": PostExcerptWidget,
  "theme-post-content": PostContentWidget,
  "theme-featured-image": FeaturedImageWidget,
  "theme-author-box": AuthorBoxWidget,
  "theme-post-comments": PostCommentsWidget,
  "theme-post-navigation": PostNavigationWidget,
  "theme-post-info": PostInfoWidget,

  // WooCommerce
  "woo-product-title": ProductTitleWidget,
  "woo-product-images": ProductImagesWidget,
  "woo-product-price": ProductPriceWidget,
  "woo-add-to-cart": AddToCartWidget,
  "woo-product-rating": ProductRatingWidget,
  "woo-product-stock": ProductStockWidget,
  "woo-product-meta": ProductMetaWidget,
  "woo-product-description": ProductDescriptionWidget,
  "woo-product-data-tabs": ProductDataTabsWidget,
  "woo-upsells": UpsellsWidget,
  "woo-related-products": RelatedProductsWidget,
  "woo-menu-cart": MenuCartWidget,
};

import { elementorControls } from "@/data/elementor-controls";
import ControlPanel from "./ControlPanel";

// ... (imports remain the same)

interface ElementorWidgetCardProps {
  widget: ElementorWidget;
  index: number;
}

export default function ElementorWidgetCard({ widget, index }: ElementorWidgetCardProps) {
  const WidgetComponent = WIDGET_MAP[widget.id];
  const [showControls, setShowControls] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const controlSchema = elementorControls[widget.id];
  const [propValues, setPropValues] = useState(() => {
    if (!controlSchema) return {};
    const defaults: Record<string, string | number | boolean> = {};
    Object.entries(controlSchema).forEach(([key, schema]) => {
      defaults[key] = schema.defaultValue;
    });
    return defaults;
  });

  const handlePropChange = (key: string, value: string | number | boolean) => {
    setPropValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleControls = () => {
    if (showControls) {
      setShowControls(false);
    } else {
      setShowControls(true);
      setShowCode(false);
    }
  };

  const handleViewCode = async () => {
    if (showCode) {
      setShowCode(false);
      return;
    }
    setShowControls(false);

    if (!code) {
      setLoading(true);
      const content = await getElementorCode(widget.id);
      setCode(content);
      setLoading(false);
    }
    setShowCode(true);
  };

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getIcon = () => {
    switch (widget.category) {
      case "Basic":
        return <Box className="w-6 h-6 text-blue-400" />;
      case "Pro":
        return <Star className="w-6 h-6 text-purple-400" />;
      case "General":
        return <Layers className="w-6 h-6 text-emerald-400" />;
      case "Theme":
        return <Layout className="w-6 h-6 text-orange-400" />;
      case "WooCommerce":
        return <ShoppingCart className="w-6 h-6 text-pink-400" />;
      default:
        return <Box className="w-6 h-6 text-zinc-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#5FC7CD]/50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#5BC0BE]/5 to-[#7C74EA]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Controls Overlay */}
      {showControls && controlSchema && (
        <ControlPanel 
          schema={controlSchema} 
          values={propValues} 
          onChange={handlePropChange} 
        />
      )}

      {/* Code Overlay */}
      {showCode && (
        <div className="absolute inset-0 z-50 bg-zinc-900/95 backdrop-blur-sm p-4 flex flex-col animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-mono text-zinc-400">source.tsx</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleCopy}
                className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => setShowCode(false)}
                className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex-grow overflow-auto custom-scrollbar rounded-lg bg-black/50 p-4 border border-zinc-800">
            {loading ? (
              <div className="flex items-center justify-center h-full text-zinc-500 text-sm font-mono">
                Loading source...
              </div>
            ) : (
              <pre className="text-xs font-mono text-zinc-300 whitespace-pre-wrap">
                {code || "// Source not available"}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* Preview Area */}
      <div className="h-48 w-full border-b border-[#E2E8F0] bg-zinc-950 relative overflow-hidden flex items-center justify-center p-4">
        {WidgetComponent ? (
          <div className="w-full max-h-full overflow-hidden flex items-center justify-center">
            <WidgetComponent {...propValues} />
          </div>
        ) : (
          <div className="text-zinc-700 font-mono text-xs">
            Preview Coming Soon
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className={`text-xs font-medium uppercase tracking-wider px-2 py-1 rounded-full ${
            widget.category === "Pro" ? "bg-[#7C74EA]/10 text-[#7C74EA]" :
            widget.category === "Basic" ? "bg-[#5BC0BE]/10 text-[#5BC0BE]" :
            "bg-[#F8FAFC] text-[#969696] border border-[#E2E8F0]"
          }`}>
            {widget.category}
          </span>
          {getIcon()}
        </div>
        
        <h3 className="text-xl font-bold text-[#455263] mb-2 group-hover:text-[#5FC7CD] transition-colors">
          {widget.title}
        </h3>
        
        <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-grow">
          {widget.description}
        </p>

        <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between mt-auto">
            <span className="text-[#969696] text-xs font-mono">
            {widget.id}
          </span>
          
          <div className="flex items-center gap-2">
            {controlSchema && (
              <button
                onClick={handleToggleControls}
                className={`p-2 rounded-full transition-all duration-300 border ${
                  showControls 
                    ? "bg-[#5FC7CD] text-white border-[#5FC7CD]" 
                    : "bg-[#F8FAFC] text-[#455263] border-[#E2E8F0] hover:border-[#5FC7CD] hover:text-[#5FC7CD]"
                }`}
                title="Customize"
              >
                <Settings2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleViewCode}
              className="p-2 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#455263] hover:border-[#5FC7CD] hover:text-[#5FC7CD] transition-all duration-300"
              title="View Code"
            >
              <Code className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-[#455263] group-hover:bg-[#5FC7CD] group-hover:text-white group-hover:border-[#5FC7CD] transition-all duration-300 transform group-hover:rotate-[-45deg]">
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
