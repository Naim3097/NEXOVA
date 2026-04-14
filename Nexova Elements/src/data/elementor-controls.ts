import { ControlSchema } from "./controls";

export const elementorControls: Record<string, Record<string, ControlSchema>> = {
  "basic-heading": {
    text: { type: "text", label: "Text", defaultValue: "This is a Heading" },
    tag: { type: "select", label: "HTML Tag", defaultValue: "h2", options: ["h1", "h2", "h3", "h4", "h5", "h6", "div", "span", "p"] },
    align: { type: "select", label: "Alignment", defaultValue: "left", options: ["left", "center", "right", "justify"] },
    color: { type: "color", label: "Text Color", defaultValue: "#ffffff" },
  },
  "basic-image": {
    src: { type: "text", label: "Image URL", defaultValue: "https://picsum.photos/seed/elementor/800/600" },
    width: { type: "select", label: "Image Size", defaultValue: "large", options: ["thumbnail", "medium", "large", "full"] },
    align: { type: "select", label: "Alignment", defaultValue: "center", options: ["left", "center", "right"] },
    caption: { type: "text", label: "Caption", defaultValue: "" },
    link: { type: "text", label: "Link", defaultValue: "" },
  },
  "basic-text-editor": {
    content: { type: "text", label: "Content", defaultValue: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo." },
    align: { type: "select", label: "Alignment", defaultValue: "left", options: ["left", "center", "right", "justify"] },
    color: { type: "color", label: "Text Color", defaultValue: "#a1a1aa" },
    dropCap: { type: "boolean", label: "Drop Cap", defaultValue: false },
  },
  "basic-video": {
    src: { type: "text", label: "Video URL", defaultValue: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    autoplay: { type: "boolean", label: "Autoplay", defaultValue: false },
    mute: { type: "boolean", label: "Mute", defaultValue: false },
    loop: { type: "boolean", label: "Loop", defaultValue: false },
    controls: { type: "boolean", label: "Player Controls", defaultValue: true },
  },
  "basic-button": {
    text: { type: "text", label: "Text", defaultValue: "Click Here" },
    link: { type: "text", label: "Link", defaultValue: "#" },
    align: { type: "select", label: "Alignment", defaultValue: "left", options: ["left", "center", "right", "justify"] },
    size: { type: "select", label: "Size", defaultValue: "sm", options: ["xs", "sm", "md", "lg", "xl"] },
    variant: { type: "select", label: "Variant", defaultValue: "primary", options: ["primary", "secondary", "danger", "info", "success", "warning"] },
  },
  "basic-divider": {
    style: { type: "select", label: "Style", defaultValue: "solid", options: ["solid", "double", "dotted", "dashed"] },
    width: { type: "number", label: "Width (%)", defaultValue: 100, min: 1, max: 100 },
    align: { type: "select", label: "Alignment", defaultValue: "center", options: ["left", "center", "right"] },
    color: { type: "color", label: "Color", defaultValue: "#ffffff" },
    weight: { type: "number", label: "Weight", defaultValue: 1, min: 1, max: 10 },
    gap: { type: "number", label: "Gap", defaultValue: 15, min: 0, max: 50 },
  },
  "basic-spacer": {
    space: { type: "number", label: "Space (px)", defaultValue: 50, min: 10, max: 600 },
  },
  "basic-google-maps": {
    address: { type: "text", label: "Address", defaultValue: "London Eye, London, United Kingdom" },
    zoom: { type: "number", label: "Zoom", defaultValue: 10, min: 1, max: 20 },
    height: { type: "number", label: "Height (px)", defaultValue: 300, min: 50, max: 1000 },
  },
  "basic-icon": {
    icon: { type: "select", label: "Icon", defaultValue: "star", options: ["star", "heart", "user", "check", "bell", "search", "home", "settings"] },
    view: { type: "select", label: "View", defaultValue: "default", options: ["default", "stacked", "framed"] },
    shape: { type: "select", label: "Shape", defaultValue: "circle", options: ["circle", "square"] },
    align: { type: "select", label: "Alignment", defaultValue: "center", options: ["left", "center", "right"] },
    color: { type: "color", label: "Primary Color", defaultValue: "#10b981" },
    secondaryColor: { type: "color", label: "Secondary Color", defaultValue: "#ffffff" },
    size: { type: "number", label: "Size", defaultValue: 50, min: 10, max: 200 },
    rotate: { type: "number", label: "Rotate", defaultValue: 0, min: 0, max: 360 },
  },
  // Pro Widgets
  "pro-posts": {
    count: { type: "number", label: "Post Count", defaultValue: 3, min: 1, max: 12 },
    columns: { type: "select", label: "Columns", defaultValue: "3", options: ["1", "2", "3", "4"] },
    showImage: { type: "boolean", label: "Show Image", defaultValue: true },
    showTitle: { type: "boolean", label: "Show Title", defaultValue: true },
    showExcerpt: { type: "boolean", label: "Show Excerpt", defaultValue: true },
    showMeta: { type: "boolean", label: "Show Meta", defaultValue: true },
  },
  "pro-portfolio": {
    columns: { type: "select", label: "Columns", defaultValue: "3", options: ["2", "3", "4", "5"] },
    count: { type: "number", label: "Item Count", defaultValue: 6, min: 1, max: 20 },
    masonry: { type: "boolean", label: "Masonry Layout", defaultValue: false },
    gap: { type: "number", label: "Item Gap", defaultValue: 15, min: 0, max: 50 },
  },
  "pro-slides": {
    height: { type: "number", label: "Height (px)", defaultValue: 400, min: 200, max: 800 },
    autoplay: { type: "boolean", label: "Autoplay", defaultValue: true },
    speed: { type: "number", label: "Speed (ms)", defaultValue: 5000, min: 1000, max: 10000 },
    arrows: { type: "boolean", label: "Show Arrows", defaultValue: true },
    dots: { type: "boolean", label: "Show Dots", defaultValue: true },
  },
  "pro-form": {
    name: { type: "text", label: "Form Name", defaultValue: "New Form" },
    showLabels: { type: "boolean", label: "Show Labels", defaultValue: true },
    buttonText: { type: "text", label: "Button Text", defaultValue: "Send" },
    buttonSize: { type: "select", label: "Button Size", defaultValue: "sm", options: ["xs", "sm", "md", "lg"] },
  },
  "pro-login": {
    showLabel: { type: "boolean", label: "Show Label", defaultValue: true },
    buttonText: { type: "text", label: "Button Text", defaultValue: "Log In" },
    showRegister: { type: "boolean", label: "Show Register", defaultValue: true },
    showLostPassword: { type: "boolean", label: "Show Lost Password", defaultValue: true },
  },
  "pro-nav-menu": {
    layout: { type: "select", label: "Layout", defaultValue: "horizontal", options: ["horizontal", "vertical", "dropdown"] },
    align: { type: "select", label: "Alignment", defaultValue: "center", options: ["left", "center", "right", "justify"] },
    pointer: { type: "select", label: "Pointer", defaultValue: "underline", options: ["none", "underline", "overline", "double-line", "framed", "background", "text"] },
    animation: { type: "select", label: "Animation", defaultValue: "fade", options: ["fade", "slide", "grow", "drop-in", "drop-out", "none"] },
  },
  "pro-animated-headline": {
    style: { type: "select", label: "Style", defaultValue: "highlight", options: ["highlight", "rotating"] },
    animation: { type: "select", label: "Animation", defaultValue: "circle", options: ["circle", "curly", "underline", "double", "double-underline", "underline-zigzag", "diagonal", "strikethrough", "cross"] },
    beforeText: { type: "text", label: "Before Text", defaultValue: "This is" },
    highlightedText: { type: "text", label: "Highlighted Text", defaultValue: "Amazing" },
    afterText: { type: "text", label: "After Text", defaultValue: "" },
    color: { type: "color", label: "Highlight Color", defaultValue: "#3b82f6" },
  },
  "pro-price-list": {
    title: { type: "text", label: "Title", defaultValue: "Product Name" },
    price: { type: "text", label: "Price", defaultValue: "$20" },
    description: { type: "text", label: "Description", defaultValue: "Product description goes here" },
    showImage: { type: "boolean", label: "Show Image", defaultValue: true },
    separator: { type: "select", label: "Separator", defaultValue: "dotted", options: ["solid", "dotted", "dashed", "double", "none"] },
  },
  "pro-price-table": {
    header: { type: "text", label: "Header", defaultValue: "Basic" },
    price: { type: "text", label: "Price", defaultValue: "29.99" },
    currency: { type: "text", label: "Currency", defaultValue: "$" },
    period: { type: "text", label: "Period", defaultValue: "Monthly" },
    buttonText: { type: "text", label: "Button Text", defaultValue: "Click Here" },
    ribbon: { type: "boolean", label: "Show Ribbon", defaultValue: false },
    ribbonText: { type: "text", label: "Ribbon Text", defaultValue: "Popular" },
  },
  "pro-flip-box": {
    frontTitle: { type: "text", label: "Front Title", defaultValue: "This is the heading" },
    frontDesc: { type: "text", label: "Front Description", defaultValue: "Lorem ipsum dolor sit amet consectetur." },
    backTitle: { type: "text", label: "Back Title", defaultValue: "This is the heading" },
    backDesc: { type: "text", label: "Back Description", defaultValue: "Lorem ipsum dolor sit amet consectetur." },
    effect: { type: "select", label: "Effect", defaultValue: "flip", options: ["flip", "slide", "push", "zoom-in", "zoom-out", "fade"] },
    height: { type: "number", label: "Height (px)", defaultValue: 200, min: 100, max: 600 },
  },
  "pro-call-to-action": {
    skin: { type: "select", label: "Skin", defaultValue: "classic", options: ["classic", "cover"] },
    title: { type: "text", label: "Title", defaultValue: "This is the heading" },
    description: { type: "text", label: "Description", defaultValue: "Lorem ipsum dolor sit amet consectetur." },
    buttonText: { type: "text", label: "Button Text", defaultValue: "Click Here" },
    position: { type: "select", label: "Position", defaultValue: "center", options: ["left", "center", "right"] },
  },
  "pro-media-carousel": {
    skin: { type: "select", label: "Skin", defaultValue: "carousel", options: ["carousel", "slideshow", "coverflow"] },
    slidesToShow: { type: "number", label: "Slides to Show", defaultValue: 3, min: 1, max: 10 },
    height: { type: "number", label: "Height (px)", defaultValue: 300, min: 100, max: 600 },
    autoplay: { type: "boolean", label: "Autoplay", defaultValue: true },
  },
  "pro-testimonial-carousel": {
    slidesToShow: { type: "number", label: "Slides to Show", defaultValue: 1, min: 1, max: 3 },
    skin: { type: "select", label: "Skin", defaultValue: "default", options: ["default", "bubble"] },
    align: { type: "select", label: "Alignment", defaultValue: "center", options: ["left", "center", "right"] },
  },
  "pro-reviews": {
    slidesToShow: { type: "number", label: "Slides to Show", defaultValue: 3, min: 1, max: 4 },
    showImage: { type: "boolean", label: "Show Image", defaultValue: true },
    showRating: { type: "boolean", label: "Show Rating", defaultValue: true },
  },
  "pro-table-of-contents": {
    title: { type: "text", label: "Title", defaultValue: "Table of Contents" },
    listStyle: { type: "select", label: "List Style", defaultValue: "disc", options: ["disc", "decimal", "none"] },
    minimize: { type: "boolean", label: "Allow Minimize", defaultValue: true },
  },
  "pro-countdown": {
    dueDate: { type: "text", label: "Due Date", defaultValue: "2025-12-31" },
    view: { type: "select", label: "View", defaultValue: "block", options: ["block", "inline"] },
    showDays: { type: "boolean", label: "Show Days", defaultValue: true },
    showHours: { type: "boolean", label: "Show Hours", defaultValue: true },
    showMinutes: { type: "boolean", label: "Show Minutes", defaultValue: true },
    showSeconds: { type: "boolean", label: "Show Seconds", defaultValue: true },
  },
  "pro-share-buttons": {
    view: { type: "select", label: "View", defaultValue: "icon-text", options: ["icon-text", "icon", "text"] },
    skin: { type: "select", label: "Skin", defaultValue: "gradient", options: ["gradient", "minimal", "framed", "boxed", "flat"] },
    shape: { type: "select", label: "Shape", defaultValue: "square", options: ["square", "rounded", "circle"] },
  },
  "pro-blockquote": {
    skin: { type: "select", label: "Skin", defaultValue: "border", options: ["border", "quotation", "boxed", "clean"] },
    align: { type: "select", label: "Alignment", defaultValue: "left", options: ["left", "center", "right"] },
    color: { type: "color", label: "Color", defaultValue: "#3b82f6" },
  },
  "pro-facebook-embed": {
    type: { type: "select", label: "Type", defaultValue: "post", options: ["post", "video", "comment", "page"] },
    url: { type: "text", label: "URL", defaultValue: "https://www.facebook.com/facebook/posts/10153231379946729" },
  },
  "pro-template": {
    templateId: { type: "text", label: "Template ID", defaultValue: "12345" },
  },
  "pro-lottie": {
    source: { type: "text", label: "Source URL", defaultValue: "https://assets9.lottiefiles.com/packages/lf20_b88nh30c.json" },
    loop: { type: "boolean", label: "Loop", defaultValue: true },
    speed: { type: "number", label: "Speed", defaultValue: 1, min: 0.1, max: 5 },
  },
  "pro-code-highlight": {
    language: { type: "select", label: "Language", defaultValue: "javascript", options: ["javascript", "html", "css", "python", "php"] },
    theme: { type: "select", label: "Theme", defaultValue: "dark", options: ["dark", "light"] },
    copyButton: { type: "boolean", label: "Copy Button", defaultValue: true },
  },
  "pro-video-playlist": {
    skin: { type: "select", label: "Skin", defaultValue: "dark", options: ["dark", "light"] },
    layout: { type: "select", label: "Layout", defaultValue: "vertical", options: ["vertical", "horizontal"] },
  },
  "pro-hotspot": {
    image: { type: "text", label: "Image URL", defaultValue: "https://picsum.photos/seed/hotspot/800/600" },
    animation: { type: "select", label: "Animation", defaultValue: "expand", options: ["expand", "soft-beat", "overlay"] },
  },
  "pro-stripe-button": {
    productName: { type: "text", label: "Product Name", defaultValue: "Premium Plan" },
    price: { type: "text", label: "Price", defaultValue: "$99.00" },
    buttonText: { type: "text", label: "Button Text", defaultValue: "Pay Now" },
  },
  "pro-paypal-button": {
    type: { type: "select", label: "Type", defaultValue: "checkout", options: ["checkout", "donation", "subscription"] },
    amount: { type: "text", label: "Amount", defaultValue: "10.00" },
  },
  "pro-progress-tracker": {
    direction: { type: "select", label: "Direction", defaultValue: "horizontal", options: ["horizontal", "vertical"] },
    progress: { type: "number", label: "Progress (%)", defaultValue: 50, min: 0, max: 100 },
  },
  // General Widgets
  "general-image-box": {
    image: { type: "text", label: "Image URL", defaultValue: "https://picsum.photos/seed/imgbox/800/600" },
    title: { type: "text", label: "Title", defaultValue: "This is the heading" },
    description: { type: "text", label: "Description", defaultValue: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    position: { type: "select", label: "Image Position", defaultValue: "top", options: ["top", "left", "right"] },
    align: { type: "select", label: "Alignment", defaultValue: "center", options: ["left", "center", "right", "justify"] },
  },
  "general-icon-box": {
    title: { type: "text", label: "Title", defaultValue: "This is the heading" },
    description: { type: "text", label: "Description", defaultValue: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    view: { type: "select", label: "View", defaultValue: "default", options: ["default", "stacked", "framed"] },
    position: { type: "select", label: "Icon Position", defaultValue: "top", options: ["top", "left", "right"] },
    align: { type: "select", label: "Alignment", defaultValue: "center", options: ["left", "center", "right", "justify"] },
  },
  "general-star-rating": {
    rating: { type: "number", label: "Rating Scale", defaultValue: 5, min: 0, max: 10 },
    style: { type: "select", label: "Icon Style", defaultValue: "star", options: ["star", "outline"] },
    align: { type: "select", label: "Alignment", defaultValue: "center", options: ["left", "center", "right"] },
    title: { type: "text", label: "Title", defaultValue: "" },
  },
  "general-image-carousel": {
    slidesToShow: { type: "number", label: "Slides to Show", defaultValue: 3, min: 1, max: 10 },
    slidesToScroll: { type: "number", label: "Slides to Scroll", defaultValue: 1, min: 1, max: 10 },
    autoplay: { type: "boolean", label: "Autoplay", defaultValue: true },
    arrows: { type: "boolean", label: "Arrows", defaultValue: true },
    dots: { type: "boolean", label: "Dots", defaultValue: true },
  },
  "general-basic-gallery": {
    columns: { type: "select", label: "Columns", defaultValue: "4", options: ["1", "2", "3", "4", "5", "6"] },
    gap: { type: "number", label: "Gap", defaultValue: 10, min: 0, max: 50 },
    lightbox: { type: "boolean", label: "Lightbox", defaultValue: true },
  },
  "general-icon-list": {
    layout: { type: "select", label: "Layout", defaultValue: "vertical", options: ["vertical", "horizontal"] },
    align: { type: "select", label: "Alignment", defaultValue: "left", options: ["left", "center", "right"] },
    iconColor: { type: "color", label: "Icon Color", defaultValue: "#3b82f6" },
  },
  "general-counter": {
    start: { type: "number", label: "Starting Number", defaultValue: 0 },
    end: { type: "number", label: "Ending Number", defaultValue: 100 },
    prefix: { type: "text", label: "Number Prefix", defaultValue: "" },
    suffix: { type: "text", label: "Number Suffix", defaultValue: "%" },
    title: { type: "text", label: "Title", defaultValue: "Cool Number" },
    duration: { type: "number", label: "Animation Duration (ms)", defaultValue: 2000, min: 500, max: 5000 },
  },
  "general-progress-bar": {
    percentage: { type: "number", label: "Percentage", defaultValue: 50, min: 0, max: 100 },
    title: { type: "text", label: "Title", defaultValue: "My Skill" },
    innerInfo: { type: "boolean", label: "Show Percentage Inside", defaultValue: false },
    color: { type: "color", label: "Color", defaultValue: "#3b82f6" },
  },
  "general-testimonial": {
    content: { type: "text", label: "Content", defaultValue: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    name: { type: "text", label: "Name", defaultValue: "John Doe" },
    job: { type: "text", label: "Job Title", defaultValue: "Designer" },
    imagePosition: { type: "select", label: "Image Position", defaultValue: "aside", options: ["aside", "top"] },
    align: { type: "select", label: "Alignment", defaultValue: "left", options: ["left", "center", "right"] },
  },
  "general-tabs": {
    position: { type: "select", label: "Position", defaultValue: "horizontal", options: ["horizontal", "vertical"] },
    align: { type: "select", label: "Alignment", defaultValue: "left", options: ["left", "center", "right", "justify"] },
    style: { type: "select", label: "Style", defaultValue: "default", options: ["default", "pills", "underline"] },
  },
  "general-accordion": {
    icon: { type: "select", label: "Icon", defaultValue: "plus", options: ["plus", "arrow", "chevron"] },
    activeIcon: { type: "select", label: "Active Icon", defaultValue: "minus", options: ["minus", "arrow-up", "chevron-up"] },
    titleHtmlTag: { type: "select", label: "Title HTML Tag", defaultValue: "div", options: ["h1", "h2", "h3", "h4", "h5", "h6", "div"] },
  },
  "general-toggle": {
    icon: { type: "select", label: "Icon", defaultValue: "arrow", options: ["plus", "arrow", "chevron"] },
    activeIcon: { type: "select", label: "Active Icon", defaultValue: "arrow-up", options: ["minus", "arrow-up", "chevron-up"] },
    titleHtmlTag: { type: "select", label: "Title HTML Tag", defaultValue: "div", options: ["h1", "h2", "h3", "h4", "h5", "h6", "div"] },
  },
  "general-social-icons": {
    shape: { type: "select", label: "Shape", defaultValue: "rounded", options: ["rounded", "square", "circle"] },
    align: { type: "select", label: "Alignment", defaultValue: "center", options: ["left", "center", "right"] },
    color: { type: "select", label: "Color", defaultValue: "official", options: ["official", "custom"] },
  },
  "general-alert": {
    type: { type: "select", label: "Type", defaultValue: "info", options: ["info", "success", "warning", "danger"] },
    title: { type: "text", label: "Title", defaultValue: "This is an Alert" },
    description: { type: "text", label: "Description", defaultValue: "I am a description. Click the edit button to change this text." },
    showDismiss: { type: "boolean", label: "Show Dismiss Button", defaultValue: true },
  },
  "general-soundcloud": {
    url: { type: "text", label: "Link", defaultValue: "https://soundcloud.com/octobersveryown/drake-gods-plan" },
    visual: { type: "boolean", label: "Visual Player", defaultValue: true },
    autoplay: { type: "boolean", label: "Autoplay", defaultValue: false },
  },
  "general-shortcode": {
    shortcode: { type: "text", label: "Shortcode", defaultValue: "[my-shortcode]" },
  },
  "general-html": {
    html: { type: "text", label: "HTML Code", defaultValue: "<div><p>Enter your HTML code here</p></div>" },
  },
  "general-menu-anchor": {
    anchor: { type: "text", label: "The ID of Menu Anchor", defaultValue: "my-anchor" },
  },
  "general-sidebar": {
    sidebar: { type: "text", label: "Choose Sidebar", defaultValue: "default-sidebar" },
  },
  "general-read-more": {
    text: { type: "text", label: "Read More Text", defaultValue: "Read More" },
    link: { type: "text", label: "Link", defaultValue: "#" },
  },
  // Theme Widgets
  "theme-site-logo": {
    align: { type: "select", label: "Alignment", defaultValue: "left", options: ["left", "center", "right"] },
    width: { type: "number", label: "Width (px)", defaultValue: 150, min: 50, max: 500 },
  },
  "theme-site-title": {
    tag: { type: "select", label: "HTML Tag", defaultValue: "h2", options: ["h1", "h2", "h3", "h4", "h5", "h6", "div", "span", "p"] },
    align: { type: "select", label: "Alignment", defaultValue: "left", options: ["left", "center", "right"] },
    color: { type: "color", label: "Color", defaultValue: "#000000" },
  },
  "theme-page-title": {
    tag: { type: "select", label: "HTML Tag", defaultValue: "h1", options: ["h1", "h2", "h3", "h4", "h5", "h6", "div"] },
    align: { type: "select", label: "Alignment", defaultValue: "left", options: ["left", "center", "right"] },
    color: { type: "color", label: "Color", defaultValue: "#111827" },
  },
  "theme-post-title": {
    tag: { type: "select", label: "HTML Tag", defaultValue: "h1", options: ["h1", "h2", "h3", "h4", "h5", "h6", "div"] },
    align: { type: "select", label: "Alignment", defaultValue: "left", options: ["left", "center", "right"] },
    color: { type: "color", label: "Color", defaultValue: "#111827" },
  },
  "theme-post-excerpt": {
    length: { type: "number", label: "Excerpt Length", defaultValue: 50, min: 10, max: 200 },
    align: { type: "select", label: "Alignment", defaultValue: "left", options: ["left", "center", "right", "justify"] },
  },
  "theme-post-content": {
    align: { type: "select", label: "Alignment", defaultValue: "left", options: ["left", "center", "right", "justify"] },
  },
  "theme-featured-image": {
    size: { type: "select", label: "Image Size", defaultValue: "full", options: ["thumbnail", "medium", "large", "full"] },
    align: { type: "select", label: "Alignment", defaultValue: "center", options: ["left", "center", "right"] },
    caption: { type: "boolean", label: "Show Caption", defaultValue: false },
  },
  "theme-author-box": {
    showImage: { type: "boolean", label: "Show Image", defaultValue: true },
    showName: { type: "boolean", label: "Show Name", defaultValue: true },
    showBio: { type: "boolean", label: "Show Bio", defaultValue: true },
    align: { type: "select", label: "Alignment", defaultValue: "left", options: ["left", "center", "right"] },
  },
  "theme-post-comments": {
    skin: { type: "select", label: "Skin", defaultValue: "theme", options: ["theme", "minimal"] },
  },
  "theme-post-navigation": {
    showLabel: { type: "boolean", label: "Show Label", defaultValue: true },
    showArrow: { type: "boolean", label: "Show Arrow", defaultValue: true },
    showTitle: { type: "boolean", label: "Show Title", defaultValue: true },
  },
  "theme-post-info": {
    layout: { type: "select", label: "Layout", defaultValue: "inline", options: ["inline", "list"] },
    align: { type: "select", label: "Alignment", defaultValue: "left", options: ["left", "center", "right"] },
    showAuthor: { type: "boolean", label: "Show Author", defaultValue: true },
    showDate: { type: "boolean", label: "Show Date", defaultValue: true },
    showTime: { type: "boolean", label: "Show Time", defaultValue: true },
    showComments: { type: "boolean", label: "Show Comments", defaultValue: true },
  },
  // WooCommerce Widgets
  "woocommerce-products": {
    columns: { type: "number", label: "Columns", defaultValue: 4, min: 1, max: 6 },
    rows: { type: "number", label: "Rows", defaultValue: 1, min: 1, max: 10 },
    showTitle: { type: "boolean", label: "Show Title", defaultValue: true },
    showPrice: { type: "boolean", label: "Show Price", defaultValue: true },
    showRating: { type: "boolean", label: "Show Rating", defaultValue: true },
    showCart: { type: "boolean", label: "Show Add to Cart", defaultValue: true },
  },
  "woocommerce-product-title": {
    tag: { type: "select", label: "HTML Tag", defaultValue: "h1", options: ["h1", "h2", "h3", "h4", "h5", "h6", "div"] },
    align: { type: "select", label: "Alignment", defaultValue: "left", options: ["left", "center", "right"] },
    color: { type: "color", label: "Color", defaultValue: "#111827" },
  },
  "woocommerce-product-images": {
    showSaleFlash: { type: "boolean", label: "Show Sale Flash", defaultValue: true },
    saleFlashText: { type: "text", label: "Sale Flash Text", defaultValue: "Sale!" },
  },
  "woocommerce-product-price": {
    align: { type: "select", label: "Alignment", defaultValue: "left", options: ["left", "center", "right"] },
    color: { type: "color", label: "Color", defaultValue: "#111827" },
  },
  "woocommerce-add-to-cart": {
    showQuantity: { type: "boolean", label: "Show Quantity", defaultValue: true },
    buttonText: { type: "text", label: "Button Text", defaultValue: "Add to cart" },
    align: { type: "select", label: "Alignment", defaultValue: "left", options: ["left", "center", "right"] },
  },
  "woocommerce-product-rating": {
    align: { type: "select", label: "Alignment", defaultValue: "left", options: ["left", "center", "right"] },
    color: { type: "color", label: "Star Color", defaultValue: "#EAB308" },
  },
  "woocommerce-product-stock": {
    align: { type: "select", label: "Alignment", defaultValue: "left", options: ["left", "center", "right"] },
    text: { type: "text", label: "Stock Text", defaultValue: "In Stock" },
  },
  "woocommerce-product-meta": {
    align: { type: "select", label: "Alignment", defaultValue: "left", options: ["left", "center", "right"] },
    layout: { type: "select", label: "Layout", defaultValue: "inline", options: ["inline", "table", "stacked"] },
  },
  "woocommerce-product-content": {
    align: { type: "select", label: "Alignment", defaultValue: "left", options: ["left", "center", "right", "justify"] },
  },
  "woocommerce-product-data-tabs": {
    layout: { type: "select", label: "Layout", defaultValue: "tabs", options: ["tabs", "accordion"] },
  },
  "woocommerce-product-related": {
    columns: { type: "number", label: "Columns", defaultValue: 4, min: 1, max: 6 },
    limit: { type: "number", label: "Products Limit", defaultValue: 4, min: 1, max: 12 },
  },
  "woocommerce-product-upsells": {
    columns: { type: "number", label: "Columns", defaultValue: 4, min: 1, max: 6 },
    limit: { type: "number", label: "Products Limit", defaultValue: 4, min: 1, max: 12 },
  },
};
