
export type ControlType = "text" | "number" | "color" | "select" | "boolean";

export interface ControlSchema {
  type: ControlType;
  label: string;
  defaultValue: string | number | boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
}

export const controls: Record<number, Record<string, ControlSchema>> = {
  1: { // RealTimeRendering
    intensity: { type: "number", label: "Intensity", defaultValue: 1, min: 0, max: 5, step: 0.1 },
    color: { type: "color", label: "Light Color", defaultValue: "#ffffff" },
  },
  2: { // Scrollytelling
    cardColor: { type: "color", label: "Card Color", defaultValue: "#1e293b" },
    textColor: { type: "color", label: "Text Color", defaultValue: "#ffffff" },
  },
  3: { // ARVRMotionGraphics
    modelColor: { type: "color", label: "Model Color", defaultValue: "#6366f1" },
    gridColor: { type: "color", label: "Grid Color", defaultValue: "rgba(255,255,255,0.1)" },
  },
  4: { // Typography
    text: { type: "text", label: "Text", defaultValue: "Typography" },
    textColor: { type: "color", label: "Text Color", defaultValue: "#ffffff" },
    hoverColor: { type: "color", label: "Hover Color", defaultValue: "#6366f1" },
  },
  5: { // Collaborative
    cursorColor: { type: "color", label: "Cursor Color", defaultValue: "#ef4444" },
    userCount: { type: "number", label: "User Count", defaultValue: 3, min: 1, max: 10 },
  },
  6: { // AmbientBackground
    color1: { type: "color", label: "Color 1", defaultValue: "#4f46e5" },
    color2: { type: "color", label: "Color 2", defaultValue: "#ec4899" },
    color3: { type: "color", label: "Color 3", defaultValue: "#8b5cf6" },
  },
  7: { // LineAnimation
    lineColor: { type: "color", label: "Line Color", defaultValue: "#6366f1" },
    duration: { type: "number", label: "Duration", defaultValue: 2, min: 0.5, max: 10 },
  },
  8: { // SelfDrawing
    color1: { type: "color", label: "Color 1", defaultValue: "#6366f1" },
    color2: { type: "color", label: "Color 2", defaultValue: "#ec4899" },
    color3: { type: "color", label: "Color 3", defaultValue: "#10b981" },
  },
  9: { // Morphing
    color1: { type: "color", label: "Color 1", defaultValue: "#3b82f6" },
    color2: { type: "color", label: "Color 2", defaultValue: "#ef4444" },
    duration: { type: "number", label: "Duration", defaultValue: 3, min: 1, max: 10 },
  },
  10: { // AnimatedLogo
    primaryColor: { type: "color", label: "Primary Color", defaultValue: "#4f46e5" },
    secondaryColor: { type: "color", label: "Secondary Color", defaultValue: "#ec4899" },
    size: { type: "number", label: "Size", defaultValue: 120, min: 50, max: 300 },
  },
  11: { // AnimatedIcons
    iconColor: { type: "color", label: "Icon Color", defaultValue: "#64748b" },
    hoverColor: { type: "color", label: "Hover Color", defaultValue: "#3b82f6" },
    size: { type: "number", label: "Size", defaultValue: 48, min: 24, max: 96 },
  },
  12: { // Microinteractions
    activeColor: { type: "color", label: "Active Color", defaultValue: "#ef4444" },
    inactiveColor: { type: "color", label: "Inactive Color", defaultValue: "#94a3b8" },
    size: { type: "number", label: "Size", defaultValue: 24, min: 16, max: 48 },
  },
  13: { // Character
    skinColor: { type: "color", label: "Skin Color", defaultValue: "#fca5a5" },
    shirtColor: { type: "color", label: "Shirt Color", defaultValue: "#3b82f6" },
    pantsColor: { type: "color", label: "Pants Color", defaultValue: "#1e293b" },
  },
  14: { // Faux3D
    depth: { type: "number", label: "Depth", defaultValue: 20, min: 5, max: 50 },
    color: { type: "color", label: "Color", defaultValue: "#6366f1" },
  },
  15: { // ScrollingEffects
    scrollSpeed: { type: "number", label: "Scroll Speed", defaultValue: 1, min: 0.1, max: 5 },
  },
  16: { // MixedMedia
    overlayColor: { type: "color", label: "Overlay Color", defaultValue: "rgba(0,0,0,0.5)" },
    opacity: { type: "number", label: "Opacity", defaultValue: 0.5, min: 0, max: 1, step: 0.1 },
  },
  17: { // LiquidMotion
    blobColor: { type: "color", label: "Blob Color", defaultValue: "#3b82f6" },
    speed: { type: "number", label: "Speed", defaultValue: 5, min: 1, max: 20 },
  },
  18: { // Gradient
    color1: { type: "color", label: "Color 1", defaultValue: "#ff0080" },
    color2: { type: "color", label: "Color 2", defaultValue: "#7928ca" },
    angle: { type: "number", label: "Angle", defaultValue: 45, min: 0, max: 360 },
  },
  19: { // Isometric
    blockColor: { type: "color", label: "Block Color", defaultValue: "#6366f1" },
    shadowColor: { type: "color", label: "Shadow Color", defaultValue: "rgba(0,0,0,0.2)" },
    size: { type: "number", label: "Size", defaultValue: 50, min: 20, max: 100 },
  },
  20: { // BackgroundAnimation
    color1: { type: "color", label: "Color 1", defaultValue: "#4f46e5" },
    color2: { type: "color", label: "Color 2", defaultValue: "#ec4899" },
    color3: { type: "color", label: "Color 3", defaultValue: "#8b5cf6" },
    speed: { type: "number", label: "Speed", defaultValue: 10, min: 1, max: 50 },
  },
  21: { // Doodle
    strokeColor: { type: "color", label: "Stroke Color", defaultValue: "#000000" },
    strokeWidth: { type: "number", label: "Stroke Width", defaultValue: 2, min: 1, max: 10 },
  },
  22: { // PageTransition
    transitionColor: { type: "color", label: "Transition Color", defaultValue: "#000000" },
    duration: { type: "number", label: "Duration", defaultValue: 0.5, min: 0.1, max: 2 },
  },
  23: { // HeroSection
    title: { type: "text", label: "Title", defaultValue: "Hero Section" },
    subtitle: { type: "text", label: "Subtitle", defaultValue: "Welcome to our website" },
    buttonText: { type: "text", label: "Button Text", defaultValue: "Get Started" },
  },
  24: { // Skeleton
    baseColor: { type: "color", label: "Base Color", defaultValue: "#e2e8f0" },
    shimmerColor: { type: "color", label: "Shimmer Color", defaultValue: "#f8fafc" },
  },
  25: { // Loading
    color: { type: "color", label: "Color", defaultValue: "#3b82f6" },
    size: { type: "number", label: "Size", defaultValue: 40, min: 20, max: 100 },
  },
  26: { // Hover
    hoverColor: { type: "color", label: "Hover Color", defaultValue: "#3b82f6" },
    scale: { type: "number", label: "Scale", defaultValue: 1.05, min: 1, max: 1.5, step: 0.01 },
  },
  27: { // Neumorphic
    color: { type: "color", label: "Color", defaultValue: "#e0e5ec" },
    radius: { type: "number", label: "Radius", defaultValue: 20, min: 0, max: 50 },
    distance: { type: "number", label: "Distance", defaultValue: 10, min: 1, max: 30 },
  },
  28: { // Glassmorphic
    blur: { type: "number", label: "Blur", defaultValue: 10, min: 0, max: 50 },
    opacity: { type: "number", label: "Opacity", defaultValue: 0.5, min: 0, max: 1, step: 0.1 },
    color: { type: "color", label: "Color", defaultValue: "rgba(255, 255, 255, 0.2)" },
  },
  29: { // Claymorphic
    baseColor: { type: "color", label: "Base Color", defaultValue: "#f87171" },
    shadowColor: { type: "color", label: "Shadow Color", defaultValue: "rgba(0,0,0,0.2)" },
    depth: { type: "number", label: "Depth", defaultValue: 10, min: 1, max: 30 },
  },
  30: { // Flipbook
    coverColor: { type: "color", label: "Cover Color", defaultValue: "#3b82f6" },
    pageColor: { type: "color", label: "Page Color", defaultValue: "#ffffff" },
    duration: { type: "number", label: "Duration", defaultValue: 1, min: 0.5, max: 3 },
  },
  31: { // StopMotion
    frameColor: { type: "color", label: "Frame Color", defaultValue: "#ffffff" },
    textColor: { type: "color", label: "Text Color", defaultValue: "#000000" },
    speed: { type: "number", label: "Speed", defaultValue: 0.2, min: 0.05, max: 1, step: 0.05 },
  },
  32: { // InteractiveCharts
    barColor: { type: "color", label: "Bar Color", defaultValue: "#3b82f6" },
    lineColor: { type: "color", label: "Line Color", defaultValue: "#10b981" },
    textColor: { type: "color", label: "Text Color", defaultValue: "#64748b" },
  },
  33: { // CircularProgress
    progressColor: { type: "color", label: "Progress Color", defaultValue: "#3b82f6" },
    trackColor: { type: "color", label: "Track Color", defaultValue: "#e2e8f0" },
    size: { type: "number", label: "Size", defaultValue: 120, min: 50, max: 300 },
  },
  34: { // NumberCounter
    targetNumber: { type: "number", label: "Target Number", defaultValue: 1000, min: 0, max: 1000000 },
    duration: { type: "number", label: "Duration", defaultValue: 2, min: 0.5, max: 10 },
    color: { type: "color", label: "Color", defaultValue: "#000000" },
  },
  35: { // AudioWaveform
    barColor: { type: "color", label: "Bar Color", defaultValue: "#3b82f6" },
    activeColor: { type: "color", label: "Active Color", defaultValue: "#60a5fa" },
    height: { type: "number", label: "Height", defaultValue: 40, min: 10, max: 100 },
  },
  36: { // PricingTable
    primaryColor: { type: "color", label: "Primary Color", defaultValue: "#3b82f6" },
    secondaryColor: { type: "color", label: "Secondary Color", defaultValue: "#1e293b" },
    price: { type: "number", label: "Price", defaultValue: 29, min: 0, max: 1000 },
  },
  37: { // TestimonialCarousel
    cardColor: { type: "color", label: "Card Color", defaultValue: "#ffffff" },
    textColor: { type: "color", label: "Text Color", defaultValue: "#1e293b" },
    accentColor: { type: "color", label: "Accent Color", defaultValue: "#3b82f6" },
  },
  38: { // LogoMarquee
    speed: { type: "number", label: "Speed", defaultValue: 20, min: 5, max: 100 },
    gap: { type: "number", label: "Gap", defaultValue: 32, min: 0, max: 100 },
    direction: { type: "select", label: "Direction", defaultValue: "left", options: ["left", "right"] },
  },
  39: { // CountdownTimer
    targetDate: { type: "text", label: "Target Date", defaultValue: "2024-12-31" },
    color: { type: "color", label: "Color", defaultValue: "#000000" },
    labelColor: { type: "color", label: "Label Color", defaultValue: "#64748b" },
  },
  40: { // ComparisonSlider
    dividerColor: { type: "color", label: "Divider Color", defaultValue: "#ffffff" },
    handleColor: { type: "color", label: "Handle Color", defaultValue: "#ffffff" },
  },
  41: { // MegaMenu
    menuColor: { type: "color", label: "Menu Color", defaultValue: "#ffffff" },
    textColor: { type: "color", label: "Text Color", defaultValue: "#1e293b" },
  },
  42: { // ScrollProgress
    barColor: { type: "color", label: "Bar Color", defaultValue: "#3b82f6" },
    height: { type: "number", label: "Height", defaultValue: 4, min: 1, max: 20 },
  },
  43: { // AnimatedTabs
    activeColor: { type: "color", label: "Active Color", defaultValue: "#3b82f6" },
    inactiveColor: { type: "color", label: "Inactive Color", defaultValue: "#64748b" },
    indicatorColor: { type: "color", label: "Indicator Color", defaultValue: "#3b82f6" },
  },
  44: { // Accordion
    headerColor: { type: "color", label: "Header Color", defaultValue: "#f1f5f9" },
    contentColor: { type: "color", label: "Content Color", defaultValue: "#ffffff" },
    textColor: { type: "color", label: "Text Color", defaultValue: "#1e293b" },
  },
  45: { // SidebarCollapse
    expandedWidth: { type: "number", label: "Expanded Width", defaultValue: 240, min: 150, max: 400 },
    collapsedWidth: { type: "number", label: "Collapsed Width", defaultValue: 64, min: 40, max: 100 },
    backgroundColor: { type: "color", label: "Background Color", defaultValue: "#1e293b" },
  },
  46: { // FloatingLabel
    activeColor: { type: "color", label: "Active Color", defaultValue: "#3b82f6" },
    inactiveColor: { type: "color", label: "Inactive Color", defaultValue: "#94a3b8" },
    textColor: { type: "color", label: "Text Color", defaultValue: "#1e293b" },
  },
  47: { // PasswordStrength
    weakColor: { type: "color", label: "Weak Color", defaultValue: "#ef4444" },
    mediumColor: { type: "color", label: "Medium Color", defaultValue: "#eab308" },
    strongColor: { type: "color", label: "Strong Color", defaultValue: "#22c55e" },
  },
  48: { // FileUpload
    borderColor: { type: "color", label: "Border Color", defaultValue: "#e2e8f0" },
    hoverColor: { type: "color", label: "Hover Color", defaultValue: "#f8fafc" },
    iconColor: { type: "color", label: "Icon Color", defaultValue: "#94a3b8" },
  },
  49: { // MultiStepForm
    activeStepColor: { type: "color", label: "Active Step Color", defaultValue: "#3b82f6" },
    inactiveStepColor: { type: "color", label: "Inactive Step Color", defaultValue: "#e2e8f0" },
    buttonColor: { type: "color", label: "Button Color", defaultValue: "#3b82f6" },
  },
  50: { // AnimatedToggle
    activeColor: { type: "color", label: "Active Color", defaultValue: "#22c55e" },
    inactiveColor: { type: "color", label: "Inactive Color", defaultValue: "#e2e8f0" },
    knobColor: { type: "color", label: "Knob Color", defaultValue: "#ffffff" },
  },
  51: { // MagneticButton
    backgroundColor: { type: "color", label: "Background Color", defaultValue: "#3b82f6" },
    textColor: { type: "color", label: "Text Color", defaultValue: "#ffffff" },
    strength: { type: "number", label: "Strength", defaultValue: 0.5, min: 0.1, max: 2, step: 0.1 },
  },
  52: { // CursorTrail
    trailColor: { type: "color", label: "Trail Color", defaultValue: "#3b82f6" },
    trailLength: { type: "number", label: "Trail Length", defaultValue: 20, min: 5, max: 100 },
    trailSize: { type: "number", label: "Trail Size", defaultValue: 10, min: 2, max: 50 },
  },
  53: { // ParallaxTilt
    maxTilt: { type: "number", label: "Max Tilt", defaultValue: 15, min: 5, max: 45 },
    scale: { type: "number", label: "Scale", defaultValue: 1.05, min: 1, max: 1.5, step: 0.01 },
    glare: { type: "boolean", label: "Glare", defaultValue: true },
  },
  54: { // SpotlightReveal
    spotlightColor: { type: "color", label: "Spotlight Color", defaultValue: "rgba(255, 255, 255, 0.2)" },
    spotlightSize: { type: "number", label: "Spotlight Size", defaultValue: 300, min: 100, max: 800 },
  },
  55: { // MagnifyingGlass
    magnification: { type: "number", label: "Magnification", defaultValue: 2, min: 1.5, max: 5, step: 0.1 },
    glassSize: { type: "number", label: "Glass Size", defaultValue: 150, min: 50, max: 300 },
    borderColor: { type: "color", label: "Border Color", defaultValue: "#ffffff" },
  },
  56: { // ToastNotification
    successColor: { type: "color", label: "Success Color", defaultValue: "#22c55e" },
    errorColor: { type: "color", label: "Error Color", defaultValue: "#ef4444" },
    duration: { type: "number", label: "Duration", defaultValue: 3000, min: 1000, max: 10000 },
  },
  57: { // SuccessMorph
    successColor: { type: "color", label: "Success Color", defaultValue: "#22c55e" },
    errorColor: { type: "color", label: "Error Color", defaultValue: "#ef4444" },
    idleColor: { type: "color", label: "Idle Color", defaultValue: "#94a3b8" },
  },
  58: { // Confetti
    particleCount: { type: "number", label: "Particle Count", defaultValue: 100, min: 20, max: 500 },
    buttonText: { type: "text", label: "Button Text", defaultValue: "Celebrate!" },
  },
  59: { // AdvancedSkeleton
    baseColor: { type: "color", label: "Base Color", defaultValue: "#e2e8f0" },
    highlightColor: { type: "color", label: "Highlight Color", defaultValue: "#f8fafc" },
    speed: { type: "number", label: "Speed", defaultValue: 1.5, min: 0.5, max: 5, step: 0.1 },
  },
  60: { // TextScramble
    text: { type: "text", label: "Text", defaultValue: "VIBE DESIGN" },
    speed: { type: "number", label: "Speed", defaultValue: 0.5, min: 0.1, max: 2, step: 0.1 },
    color: { type: "color", label: "Color", defaultValue: "#000000" },
  },
  61: { // Typewriter
    text: { type: "text", label: "Text", defaultValue: "Hello World" },
    speed: { type: "number", label: "Speed", defaultValue: 100, min: 10, max: 500 },
    cursorColor: { type: "color", label: "Cursor Color", defaultValue: "#000000" },
  },
  62: { // VideoMask
    text: { type: "text", label: "Text", defaultValue: "OCEAN" },
    fontSize: { type: "number", label: "Font Size", defaultValue: 120, min: 40, max: 300 },
    opacity: { type: "number", label: "Opacity", defaultValue: 1, min: 0, max: 1, step: 0.1 },
  },
  63: { // InteractiveGlobe
    globeColor: { type: "color", label: "Globe Color", defaultValue: "#3b82f6" },
    backgroundColor: { type: "color", label: "Background Color", defaultValue: "#000000" },
    rotationSpeed: { type: "number", label: "Rotation Speed", defaultValue: 10000, min: 1000, max: 50000 },
  },
  64: { // AiAssistant
    primaryColor: { type: "color", label: "Primary Color", defaultValue: "#3b82f6" },
    secondaryColor: { type: "color", label: "Secondary Color", defaultValue: "#a855f7" },
    waveSpeed: { type: "number", label: "Wave Speed", defaultValue: 1, min: 0.1, max: 5, step: 0.1 },
  },
  65: { // CodeTyping
    backgroundColor: { type: "color", label: "Background Color", defaultValue: "#1e1e1e" },
    textColor: { type: "color", label: "Text Color", defaultValue: "#d4d4d4" },
    typingSpeed: { type: "number", label: "Typing Speed", defaultValue: 50, min: 10, max: 200 },
  },
  66: { // DynamicIsland
    backgroundColor: { type: "color", label: "Background Color", defaultValue: "#000000" },
    textColor: { type: "color", label: "Text Color", defaultValue: "#ffffff" },
    width: { type: "number", label: "Width", defaultValue: 200, min: 100, max: 400 },
  },
  67: { // ParallaxDevice
    scrollSpeed: { type: "number", label: "Scroll Speed", defaultValue: 0.5, min: 0.1, max: 2, step: 0.1 },
    deviceColor: { type: "color", label: "Device Color", defaultValue: "#1e293b" },
  },
  68: { // HolographicCard
    width: { type: "number", label: "Width", defaultValue: 300, min: 100, max: 500 },
    height: { type: "number", label: "Height", defaultValue: 450, min: 100, max: 600 },
  },
  69: { // LiquidTabBar
    activeColor: { type: "color", label: "Active Color", defaultValue: "#3b82f6" },
    inactiveColor: { type: "color", label: "Inactive Color", defaultValue: "#94a3b8" },
    backgroundColor: { type: "color", label: "Background Color", defaultValue: "#ffffff" },
  },
  70: { // ParticleNetwork
    particleColor: { type: "color", label: "Particle Color", defaultValue: "#94a3b8" },
    lineColor: { type: "color", label: "Line Color", defaultValue: "#cbd5e1" },
    particleCount: { type: "number", label: "Particle Count", defaultValue: 100, min: 20, max: 300 },
  },
  71: { // StackedCardCarousel
    textColor: { type: "color", label: "Text Color", defaultValue: "#ffffff" },
  },
  72: { // CylinderScroll
    itemWidth: { type: "number", label: "Item Width", defaultValue: 200, min: 100, max: 400 },
    itemHeight: { type: "number", label: "Item Height", defaultValue: 100, min: 50, max: 200 },
    radius: { type: "number", label: "Radius", defaultValue: 300, min: 100, max: 600 },
  },
  73: { // GravityPhysicsGrid
    blockSize: { type: "number", label: "Block Size", defaultValue: 50, min: 20, max: 100 },
  },
  74: { // MorphingSvgLoader
    color1: { type: "color", label: "Color 1", defaultValue: "#3b82f6" },
    color2: { type: "color", label: "Color 2", defaultValue: "#ec4899" },
    duration: { type: "number", label: "Duration", defaultValue: 2, min: 0.5, max: 5 },
  },
  75: { // AudioVisualizer
    barColor: { type: "color", label: "Bar Color", defaultValue: "#3b82f6" },
    barCount: { type: "number", label: "Bar Count", defaultValue: 32, min: 8, max: 128 },
    sensitivity: { type: "number", label: "Sensitivity", defaultValue: 1, min: 0.1, max: 5, step: 0.1 },
  },
  76: { // BookFlip
    coverColor: { type: "color", label: "Cover Color", defaultValue: "#1e293b" },
    pageColor: { type: "color", label: "Page Color", defaultValue: "#f1f5f9" },
    duration: { type: "number", label: "Duration", defaultValue: 1.5, min: 0.5, max: 5 },
  },
  77: { // ElasticDrag
    dragColor: { type: "color", label: "Drag Color", defaultValue: "#3b82f6" },
    restColor: { type: "color", label: "Rest Color", defaultValue: "#94a3b8" },
    elasticity: { type: "number", label: "Elasticity", defaultValue: 0.2, min: 0.05, max: 0.5, step: 0.01 },
  },
  78: { // ColorPaletteGenerator
    baseColor: { type: "color", label: "Base Color", defaultValue: "#3b82f6" },
    count: { type: "number", label: "Count", defaultValue: 5, min: 3, max: 10 },
  },
  79: { // WaterRipple
    rippleColor: { type: "color", label: "Ripple Color", defaultValue: "rgba(255, 255, 255, 0.5)" },
    backgroundColor: { type: "color", label: "Background Color", defaultValue: "#0ea5e9" },
  },
  80: { // CubeSpinner
    size: { type: "number", label: "Size", defaultValue: 200, min: 100, max: 400 },
    color: { type: "color", label: "Color", defaultValue: "#3b82f6" },
    speed: { type: "number", label: "Speed", defaultValue: 10, min: 1, max: 50 },
  },
  81: { // MagnifiedDock
    baseSize: { type: "number", label: "Base Size", defaultValue: 48, min: 24, max: 96 },
    magnification: { type: "number", label: "Magnification", defaultValue: 1.5, min: 1.1, max: 3, step: 0.1 },
    distance: { type: "number", label: "Distance", defaultValue: 100, min: 50, max: 300 },
  },
  82: { // KanbanDragDrop
    columnColor: { type: "color", label: "Column Color", defaultValue: "#f1f5f9" },
    cardColor: { type: "color", label: "Card Color", defaultValue: "#ffffff" },
    textColor: { type: "color", label: "Text Color", defaultValue: "#1e293b" },
  },
  83: { // StarField
    starCount: { type: "number", label: "Star Count", defaultValue: 200, min: 50, max: 1000 },
    baseSpeed: { type: "number", label: "Base Speed", defaultValue: 0.1, min: 0.01, max: 1, step: 0.01 },
    starColor: { type: "color", label: "Star Color", defaultValue: "#ffffff" },
  },
  84: { // StoryView
    progressBarColor: { type: "color", label: "Progress Bar Color", defaultValue: "#ffffff" },
    progressBgColor: { type: "color", label: "Progress Bg Color", defaultValue: "rgba(255,255,255,0.3)" },
  },
  85: { // ScratchCard
    scratchColor: { type: "color", label: "Scratch Color", defaultValue: "#cbd5e1" },
    brushSize: { type: "number", label: "Brush Size", defaultValue: 20, min: 5, max: 50 },
    revealThreshold: { type: "number", label: "Reveal Threshold", defaultValue: 50, min: 10, max: 90 },
  },
  86: { // GradientFollower
    color1: { type: "color", label: "Color 1", defaultValue: "#3b82f6" },
    color2: { type: "color", label: "Color 2", defaultValue: "#ec4899" },
    size: { type: "number", label: "Size", defaultValue: 300, min: 100, max: 600 },
  },
  87: { // KineticTypography
    baseColor: { type: "color", label: "Base Color", defaultValue: "#ffffff" },
    strokeColor: { type: "color", label: "Stroke Color", defaultValue: "#000000" },
  },
  88: { // GridDistortion
    gridSize: { type: "number", label: "Grid Size", defaultValue: 30, min: 10, max: 100 },
    mouseRange: { type: "number", label: "Mouse Range", defaultValue: 150, min: 50, max: 300 },
    distortStrength: { type: "number", label: "Distort Strength", defaultValue: 40, min: 10, max: 100 },
    cursorColor: { type: "color", label: "Cursor Color", defaultValue: "rgba(255, 255, 255, 0.5)" },
    gridColor: { type: "color", label: "Grid Color", defaultValue: "rgba(255, 255, 255, 0.2)" },
  },
  89: { // FocusBlurReveal
    blurAmount: { type: "number", label: "Blur Amount", defaultValue: 10, min: 0, max: 30 },
    transitionDuration: { type: "number", label: "Duration", defaultValue: 0.5, min: 0.1, max: 2 },
  },
  90: { // MagneticGallery
    gap: { type: "number", label: "Gap", defaultValue: 16, min: 0, max: 64 },
    imageSize: { type: "number", label: "Image Size", defaultValue: 200, min: 100, max: 400 },
  },
  91: { // InfiniteTunnel
    color: { type: "color", label: "Color", defaultValue: "#06b6d4" },
    speed: { type: "number", label: "Speed", defaultValue: 5, min: 1, max: 20 },
    size: { type: "number", label: "Size", defaultValue: 200, min: 50, max: 400 },
  },
  92: { // GlitchImage
    text: { type: "text", label: "Text", defaultValue: "GLITCH" },
    backgroundColor: { type: "color", label: "Background Color", defaultValue: "#27272a" },
    textColor: { type: "color", label: "Text Color", defaultValue: "#ffffff" },
    glitchColor1: { type: "color", label: "Glitch Color 1", defaultValue: "rgba(239, 68, 68, 0.5)" },
    glitchColor2: { type: "color", label: "Glitch Color 2", defaultValue: "rgba(59, 130, 246, 0.5)" },
  },
  93: { // ParticleText
    text: { type: "text", label: "Text", defaultValue: "VIBE" },
    particleColor: { type: "color", label: "Particle Color", defaultValue: "#ffffff" },
    mouseInteractionRadius: { type: "number", label: "Interaction Radius", defaultValue: 100, min: 0, max: 300 },
    particleSize: { type: "number", label: "Particle Size", defaultValue: 2, min: 1, max: 10 },
    fontSize: { type: "number", label: "Font Size", defaultValue: 80, min: 20, max: 200 },
  },
  94: { // LiquidButton
    text: { type: "text", label: "Text", defaultValue: "Hover Me" },
    backgroundColor: { type: "color", label: "Background Color", defaultValue: "#6366f1" },
    textColor: { type: "color", label: "Text Color", defaultValue: "#ffffff" },
  },
  95: { // VerticalCardStack
    offset: { type: "number", label: "Offset", defaultValue: 100, min: 20, max: 200 },
    scaleFactor: { type: "number", label: "Scale Factor", defaultValue: 0.05, min: 0.01, max: 0.2, step: 0.01 },
  },
  96: { // MouseImageTrail
    maxImages: { type: "number", label: "Max Images", defaultValue: 5, min: 1, max: 20 },
    distanceThreshold: { type: "number", label: "Distance Threshold", defaultValue: 50, min: 10, max: 200 },
  },
  97: { // RetroGridScroll
    gridColor: { type: "color", label: "Grid Color", defaultValue: "rgba(255,0,255,0.3)" },
    sunStartColor: { type: "color", label: "Sun Start Color", defaultValue: "#FACC15" },
    sunEndColor: { type: "color", label: "Sun End Color", defaultValue: "#DB2777" },
    speed: { type: "number", label: "Speed", defaultValue: 1, min: 0.1, max: 5, step: 0.1 },
    gridSize: { type: "number", label: "Grid Size", defaultValue: 40, min: 10, max: 100 },
  },
  98: { // DnaHelix
    color1: { type: "color", label: "Color 1", defaultValue: "#3b82f6" },
    color2: { type: "color", label: "Color 2", defaultValue: "#a855f7" },
    speed: { type: "number", label: "Speed", defaultValue: 4, min: 1, max: 10 },
  },
  99: { // MatrixRain
    color: { type: "color", label: "Color", defaultValue: "#00FF00" },
    fontSize: { type: "number", label: "Font Size", defaultValue: 14, min: 8, max: 48 },
    speed: { type: "number", label: "Speed", defaultValue: 33, min: 10, max: 200 },
  },
  100: { // Fireworks
    density: { type: "number", label: "Density", defaultValue: 50, min: 10, max: 200 },
    speed: { type: "number", label: "Speed", defaultValue: 1, min: 0.1, max: 5, step: 0.1 },
  },
};
