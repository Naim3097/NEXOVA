export interface Animation {
  id: number;
  title: string;
  description: string;
  category: string;
}

export const animations: Animation[] = [
  { id: 1, title: "Real-Time Rendering", description: "Hyper-realistic 3D environments adding depth, detail, and interactivity.", category: "3D & Immersion" },
  { id: 2, title: "Scrollytelling", description: "Using scrolling to guide users through rich, narrative-driven experiences.", category: "Interaction" },
  { id: 3, title: "AR/VR Motion Graphics", description: "Integrating animation into immersive environments for enhanced realism.", category: "3D & Immersion" },
  { id: 4, title: "Expressive Typography Animations", description: "Bold, kinetic type and glitch effects to convey brand personality.", category: "Typography" },
  { id: 5, title: "Real-Time Collaborative Animations", description: "Allowing multiple users to interact with the same animated elements simultaneously.", category: "Interaction" },
  { id: 6, title: "Ambient Background Motion", description: "Subtle gradients, particles, and liquid flows creating depth and atmosphere.", category: "Background" },
  { id: 7, title: "Line Animation Examples", description: "Trendy thin line work aesthetic offering limitless motion design artistry.", category: "Vector" },
  { id: 8, title: "Self-Drawing Animation Effects", description: "Intricate self-drawing and self-erasing effects based on line art.", category: "Vector" },
  { id: 9, title: "Morphing Animation Effects", description: "Smooth transitions between shapes, logos, and characters.", category: "Vector" },
  { id: 10, title: "Animated Logos", description: "Motion graphics featuring logotypes or mascots for branding.", category: "Branding" },
  { id: 11, title: "Animated Icons", description: "Simple yet effective animations triggered by clicks or hover actions.", category: "UI Elements" },
  { id: 12, title: "Microinteractions", description: "Subtle animations enhancing navigation, forms, and buttons.", category: "UI Elements" },
  { id: 13, title: "Character Website Animations", description: "Animated characters mimicking human movements for storytelling.", category: "Character" },
  { id: 14, title: "Faux 3D Animation Effects", description: "Creating the illusion of 3D space in a 2D environment using perspective.", category: "3D & Immersion" },
  { id: 15, title: "Vertical and Horizontal Scrolling Effects", description: "Combining scrolling directions to create anticipation and engagement.", category: "Interaction" },
  { id: 16, title: "Mixed Media Web Animation Examples", description: "Blending photography and vector graphics for a fresh creative layer.", category: "Style" },
  { id: 17, title: "Liquid Motion Effects", description: "Organic animation using smooth, flowing movements.", category: "Style" },
  { id: 18, title: "Animated Gradient Effects", description: "Animated color transitions shaping mood and tone.", category: "Background" },
  { id: 19, title: "Isometric Animation Effects", description: "Using 2D animation to create the illusion of 3D isometric space.", category: "3D & Immersion" },
  { id: 20, title: "Background Website Animations", description: "Atmospheric animations setting the stage for visual interest.", category: "Background" },
  { id: 21, title: "Doodle Web Animations", description: "Playful, hand-drawn sketches brought to life.", category: "Style" },
  { id: 22, title: "Website Page Transition Effects", description: "Smooth progression between content sections like fade-ins and slides.", category: "Interaction" },
  { id: 23, title: "Hero Section Web Animations", description: "Capturing attention quickly in the first screen users see.", category: "Layout" },
  { id: 24, title: "Loading Skeleton Screens", description: "Placeholders improving perceived performance during loading.", category: "Loading" },
  { id: 25, title: "Loading Animations", description: "Visual cues guiding users through wait times.", category: "Loading" },
  { id: 26, title: "Hover Web Animation Effects", description: "Revealing information or enhancing UI on mouse hover.", category: "Interaction" },
  { id: 27, title: "Neumorphic Animation Effect", description: "Soft, tactile, extruded look combining skeuomorphism and flat design.", category: "Style" },
  { id: 28, title: "Glassmorphic Animation Effect", description: "Depth, translucency, and texture with layered, glass-like panels.", category: "Style" },
  { id: 29, title: "Claymorphic Animation Effect", description: "Clay-like aesthetics with rounded corners and soft shadows.", category: "Style" },
  { id: 30, title: "Animated flipbooks", description: "Interactive catalogs with realistic page flip effects.", category: "Interaction" },
  { id: 31, title: "Stop-Motion Animation Effect", description: "Illusion of movement by sequencing individual frames.", category: "Style" },
  { id: 32, title: "Interactive Charts", description: "Animated bar and line graphs that grow into place when scrolled into view.", category: "Data" },
  { id: 33, title: "Circular Progress Stats", description: "Radial SVG gauges for displaying skills, loading, or KPIs.", category: "Data" },
  { id: 34, title: "Animated Number Counters", description: "Numbers that roll up (0 to 100%) with easing effects.", category: "Data" },
  { id: 35, title: "Audio Waveforms", description: "Animated bars simulating voice or music playback.", category: "Data" },
  { id: 36, title: "Pricing Table Toggles", description: "Smooth morphing transition between Monthly and Yearly prices.", category: "Marketing" },
  { id: 37, title: "Testimonial Carousel", description: "Elegant fade or slide transitions for client reviews.", category: "Marketing" },
  { id: 38, title: "Infinite Logo Marquee", description: "A seamless, infinite scrolling loop of client logos.", category: "Marketing" },
  { id: 39, title: "Countdown Timer", description: "Flip-clock or circular countdowns for limited-time offers.", category: "Marketing" },
  { id: 40, title: "Comparison Slider", description: "A draggable Before/After handle to reveal changes.", category: "Marketing" },
  { id: 41, title: "Mega Menu Reveal", description: "Staggered animation for large dropdown menus.", category: "Navigation" },
  { id: 42, title: "Sticky Scroll Progress", description: "A reading indicator bar that fills as the user scrolls down the page.", category: "Navigation" },
  { id: 43, title: "Animated Tabs", description: "A sliding active state background or underline that moves between tabs.", category: "Navigation" },
  { id: 44, title: "Accordion/FAQ", description: "Smooth height expansion/collapse for Q&A sections.", category: "Navigation" },
  { id: 45, title: "Sidebar Collapse", description: "Smooth width transitions for dashboard layouts.", category: "Navigation" },
  { id: 46, title: "Floating Label Inputs", description: "Labels that animate up and shrink when the user clicks the input.", category: "Forms" },
  { id: 47, title: "Password Strength Meter", description: "A dynamic bar that changes color (Red → Green) as you type.", category: "Forms" },
  { id: 48, title: "File Upload Dropzone", description: "Animation that triggers when dragging a file over the area.", category: "Forms" },
  { id: 49, title: "Multi-Step Form Wizard", description: "Slide transitions between different steps of a form.", category: "Forms" },
  { id: 50, title: "Animated Toggles", description: "Satisfying physics-based switches for settings.", category: "Forms" },
  { id: 51, title: "Magnetic Buttons", description: "Buttons that physically stick to and follow the cursor slightly.", category: "Interaction" },
  { id: 52, title: "Cursor Trails", description: "Custom SVG shapes or particles that follow the mouse movement.", category: "Interaction" },
  { id: 53, title: "Parallax Tilt Cards", description: "3D perspective tilt effect on hover.", category: "Interaction" },
  { id: 54, title: "Spotlight Reveal", description: "A flashlight effect revealing content on dark backgrounds.", category: "Interaction" },
  { id: 55, title: "Magnifying Glass", description: "Zoom effect inside a lens when hovering over product images.", category: "Interaction" },
  { id: 56, title: "Toast Notifications", description: "Slide-in alerts with self-destruct progress timers.", category: "Feedback" },
  { id: 57, title: "Success/Error Morphs", description: "Icons that morph from a circle to a Checkmark or X.", category: "Feedback" },
  { id: 58, title: "Confetti Explosion", description: "Particle effects triggered on Success.", category: "Feedback" },
  { id: 59, title: "Advanced Skeleton Loaders", description: "Shimmering placeholders for complex card layouts.", category: "Feedback" },
  { id: 60, title: "Text Scramble Reveal", description: "Hacker style decoding effect (random chars → final text).", category: "Text" },
  { id: 61, title: "Typewriter Effect", description: "Character-by-character typing simulation with a blinking cursor.", category: "Text" },
  { id: 62, title: "Video Text Masking", description: "Text that acts as a window, showing a video playing inside the letters.", category: "Text" },
  { id: 63, title: "Interactive Globe Visualization", description: "A rotating wireframe globe visualizing global data connections.", category: "3D & Immersion" },
  { id: 64, title: "AI Voice Waveform", description: "Organic, fluid waveforms simulating an active AI assistant.", category: "AI & Tech" },
  { id: 65, title: "Code Typing Terminal", description: "Realistic code typing effect with syntax highlighting.", category: "Tech/SaaS" },
  { id: 66, title: "Dynamic Island Notification", description: "Morphing pill interface that expands to show notifications.", category: "UI Elements" },
  { id: 67, title: "Parallax Device Scroll", description: "Layered device mockups moving at different speeds on scroll.", category: "Presentation" },
  { id: 68, title: "Holographic Card", description: "Premium 3D tilt effect with iridescent holographic overlay.", category: "Style" },
  { id: 69, title: "Liquid Tab Bar", description: "Fluid morphing navigation where the active state flows like liquid.", category: "Navigation" },
  { id: 70, title: "Particle Network", description: "Interactive nodes and lines connecting based on proximity.", category: "Background" },
  { id: 71, title: "Stacked Card Carousel", description: "Depth-based card stack with swipe gestures and smooth transitions.", category: "Interaction" },
  { id: 72, title: "3D Cylinder Scroll", description: "Rotating 3D carousel of items on a cylindrical axis.", category: "3D & Immersion" },
  { id: 73, title: "Gravity Physics Grid", description: "Elements that fall, bounce, and stack with realistic 2D physics.", category: "Interaction" },
  { id: 74, title: "Morphing SVG Loader", description: "Complex SVG paths smoothly morphing between different shapes.", category: "Loading" },
  { id: 75, title: "Audio Visualizer", description: "Dynamic frequency bars reacting to simulated audio input.", category: "Media" },
  { id: 76, title: "3D Book Flip", description: "Realistic hardcover book opening animation with page turns.", category: "3D & Immersion" },
  { id: 77, title: "Elastic Drag Elements", description: "UI elements that stretch and deform like rubber when dragged.", category: "Interaction" },
  { id: 78, title: "Color Palette Generator", description: "Smooth color transitions generating harmonious color schemes.", category: "Style" },
  { id: 79, title: "Water Ripple Effect", description: "Realistic water disturbance simulation on mouse interaction.", category: "Background" },
  { id: 80, title: "3D Cube Spinner", description: "Interactive 3D cube that can be rotated to reveal different content faces.", category: "3D & Immersion" },
  { id: 81, title: "Magnified Dock", description: "macOS-style icon magnification effect on hover.", category: "Navigation" },
  { id: 82, title: "Kanban Drag & Drop", description: "Smooth drag and drop reordering between columns.", category: "Interaction" },
  { id: 83, title: "Interactive Star Field", description: "Immersive star field that reacts to mouse movement and speed.", category: "Background" },
  { id: 84, title: "Swipeable Story View", description: "Instagram-style story navigation with progress bars.", category: "Media" },
  { id: 85, title: "Scratch Card Reveal", description: "Interactive scratch-off effect to reveal hidden content.", category: "Interaction" },
  { id: 86, title: "Gradient Follower", description: "Smooth, glowing gradient blob that follows the cursor.", category: "Background" },
  { id: 87, title: "Kinetic Typography", description: "Text that stretches, skews, and reacts to movement.", category: "Typography" },
  { id: 88, title: "Interactive Grid Distortion", description: "A grid of points or lines that warps around the cursor.", category: "Background" },
  { id: 89, title: "Focus Blur Reveal", description: "Content that sharpens into focus as it enters the viewport.", category: "Interaction" },
  { id: 90, title: "Magnetic Image Gallery", description: "Images that magnetically snap to the cursor movement.", category: "Media" },
  { id: 91, title: "Infinite Tunnel", description: "Hypnotic 3D tunnel animation creating a sense of speed.", category: "3D & Immersion" },
  { id: 92, title: "Glitch Image Effect", description: "Cyberpunk-style digital distortion and chromatic aberration.", category: "Style" },
  { id: 93, title: "Particle Text Explosion", description: "Text characters that disperse into particles on interaction.", category: "Text" },
  { id: 94, title: "Liquid Blob Button", description: "Button with organic, gooey liquid fill animation.", category: "UI Elements" },
  { id: 95, title: "Vertical Card Stack", description: "Cards that stack on top of each other with a sticky effect.", category: "Layout" },
  { id: 96, title: "Mouse Image Trail", description: "A trail of images that appears behind the cursor movement.", category: "Interaction" },
  { id: 97, title: "Retro Grid Scroll", description: "Synthwave-style infinite perspective grid animation.", category: "Background" },
  { id: 98, title: "Interactive DNA Helix", description: "Rotating 3D DNA strand visualization.", category: "Science" },
  { id: 99, title: "Matrix Digital Rain", description: "Classic falling green code characters effect.", category: "Style" },
  { id: 100, title: "Fireworks Celebration", description: "Grand finale interactive fireworks display.", category: "Background" },
];

export function getAnimationsByCategory(): Map<string, Animation[]> {
  const map = new Map<string, Animation[]>();
  for (const a of animations) {
    if (!map.has(a.category)) map.set(a.category, []);
    map.get(a.category)!.push(a);
  }
  return map;
}

export function getCategoryCounts(): { label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const a of animations) {
    map.set(a.category, (map.get(a.category) || 0) + 1);
  }
  return Array.from(map.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}
