"use client";

import { motion } from "framer-motion";
import { AnimationItem } from "@/data/animations";
import { ArrowRight, Sparkles, Code, X, Copy, Check, Settings2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { getCode } from "@/actions/getCode";
import { controls } from "@/data/controls";
import ControlPanel from "./ControlPanel";

// Dynamic imports for demos to avoid loading all at once
const GradientDemo = dynamic(() => import("./demos/GradientDemo"));
const LoadingDemo = dynamic(() => import("./demos/LoadingDemo"));
const TypographyDemo = dynamic(() => import("./demos/TypographyDemo"));
const HoverDemo = dynamic(() => import("./demos/HoverDemo"));
const MicroInteractionDemo = dynamic(() => import("./demos/MicroInteractionDemo"));
const NeumorphicDemo = dynamic(() => import("./demos/NeumorphicDemo"));
const RealTimeRenderingDemo = dynamic(() => import("./demos/RealTimeRenderingDemo"));
const LineAnimationDemo = dynamic(() => import("./demos/LineAnimationDemo"));
const SelfDrawingDemo = dynamic(() => import("./demos/SelfDrawingDemo"));
const MorphingDemo = dynamic(() => import("./demos/MorphingDemo"));
const Faux3DDemo = dynamic(() => import("./demos/Faux3DDemo"));
const ScrollytellingDemo = dynamic(() => import("./demos/ScrollytellingDemo"));
const CollaborativeDemo = dynamic(() => import("./demos/CollaborativeDemo"));
const ScrollingEffectsDemo = dynamic(() => import("./demos/ScrollingEffectsDemo"));
const PageTransitionDemo = dynamic(() => import("./demos/PageTransitionDemo"));
const FlipbookDemo = dynamic(() => import("./demos/FlipbookDemo"));
const AmbientBackgroundDemo = dynamic(() => import("./demos/AmbientBackgroundDemo"));
const MixedMediaDemo = dynamic(() => import("./demos/MixedMediaDemo"));
const LiquidMotionDemo = dynamic(() => import("./demos/LiquidMotionDemo"));
const GlassmorphismDemo = dynamic(() => import("./demos/GlassmorphismDemo"));
const ClaymorphismDemo = dynamic(() => import("./demos/ClaymorphismDemo"));
const AnimatedLogoDemo = dynamic(() => import("./demos/AnimatedLogoDemo"));
const AnimatedIconsDemo = dynamic(() => import("./demos/AnimatedIconsDemo"));
const CharacterDemo = dynamic(() => import("./demos/CharacterDemo"));
const DoodleDemo = dynamic(() => import("./demos/DoodleDemo"));
const StopMotionDemo = dynamic(() => import("./demos/StopMotionDemo"));
const ARVRDemo = dynamic(() => import("./demos/ARVRDemo"));
const IsometricDemo = dynamic(() => import("./demos/IsometricDemo"));
const HeroSectionDemo = dynamic(() => import("./demos/HeroSectionDemo"));
const SkeletonDemo = dynamic(() => import("./demos/SkeletonDemo"));
const InteractiveChartsDemo = dynamic(() => import("./demos/InteractiveChartsDemo"));
const CircularProgressDemo = dynamic(() => import("./demos/CircularProgressDemo"));
const NumberCounterDemo = dynamic(() => import("./demos/NumberCounterDemo"));
const AudioWaveformDemo = dynamic(() => import("./demos/AudioWaveformDemo"));
const PricingTableDemo = dynamic(() => import("./demos/PricingTableDemo"));
const TestimonialCarouselDemo = dynamic(() => import("./demos/TestimonialCarouselDemo"));
const LogoMarqueeDemo = dynamic(() => import("./demos/LogoMarqueeDemo"));
const CountdownTimerDemo = dynamic(() => import("./demos/CountdownTimerDemo"));
const ComparisonSliderDemo = dynamic(() => import("./demos/ComparisonSliderDemo"));
const MegaMenuDemo = dynamic(() => import("./demos/MegaMenuDemo"));
const ScrollProgressDemo = dynamic(() => import("./demos/ScrollProgressDemo"));
const AnimatedTabsDemo = dynamic(() => import("./demos/AnimatedTabsDemo"));
const AccordionDemo = dynamic(() => import("./demos/AccordionDemo"));
const SidebarCollapseDemo = dynamic(() => import("./demos/SidebarCollapseDemo"));
const FloatingLabelDemo = dynamic(() => import("./demos/FloatingLabelDemo"));
const PasswordStrengthDemo = dynamic(() => import("./demos/PasswordStrengthDemo"));
const FileUploadDemo = dynamic(() => import("./demos/FileUploadDemo"));
const MultiStepFormDemo = dynamic(() => import("./demos/MultiStepFormDemo"));
const AnimatedToggleDemo = dynamic(() => import("./demos/AnimatedToggleDemo"));
const MagneticButtonDemo = dynamic(() => import("./demos/MagneticButtonDemo"));
const CursorTrailDemo = dynamic(() => import("./demos/CursorTrailDemo"));
const ParallaxTiltDemo = dynamic(() => import("./demos/ParallaxTiltDemo"));
const SpotlightRevealDemo = dynamic(() => import("./demos/SpotlightRevealDemo"));
const MagnifyingGlassDemo = dynamic(() => import("./demos/MagnifyingGlassDemo"));
const ToastNotificationDemo = dynamic(() => import("./demos/ToastNotificationDemo"));
const SuccessMorphDemo = dynamic(() => import("./demos/SuccessMorphDemo"));
const ConfettiDemo = dynamic(() => import("./demos/ConfettiDemo"));
const AdvancedSkeletonDemo = dynamic(() => import("./demos/AdvancedSkeletonDemo"));
const TextScrambleDemo = dynamic(() => import("./demos/TextScrambleDemo"));
const TypewriterDemo = dynamic(() => import("./demos/TypewriterDemo"));
const VideoMaskDemo = dynamic(() => import("./demos/VideoMaskDemo"));
const InteractiveGlobeDemo = dynamic(() => import("./demos/InteractiveGlobeDemo"));
const AiAssistantDemo = dynamic(() => import("./demos/AiAssistantDemo"));
const CodeTypingDemo = dynamic(() => import("./demos/CodeTypingDemo"));
const DynamicIslandDemo = dynamic(() => import("./demos/DynamicIslandDemo"));
const ParallaxDeviceDemo = dynamic(() => import("./demos/ParallaxDeviceDemo"));
const HolographicCardDemo = dynamic(() => import("./demos/HolographicCardDemo"));
const LiquidTabBarDemo = dynamic(() => import("./demos/LiquidTabBarDemo"));
const ParticleNetworkDemo = dynamic(() => import("./demos/ParticleNetworkDemo"));
const StackedCardCarouselDemo = dynamic(() => import("./demos/StackedCardCarouselDemo"));
const CylinderScrollDemo = dynamic(() => import("./demos/CylinderScrollDemo"));
const GravityPhysicsGridDemo = dynamic(() => import("./demos/GravityPhysicsGridDemo"));
const MorphingSvgLoaderDemo = dynamic(() => import("./demos/MorphingSvgLoaderDemo"));
const AudioVisualizerDemo = dynamic(() => import("./demos/AudioVisualizerDemo"));
const BookFlipDemo = dynamic(() => import("./demos/BookFlipDemo"));
const ElasticDragDemo = dynamic(() => import("./demos/ElasticDragDemo"));
const ColorPaletteGeneratorDemo = dynamic(() => import("./demos/ColorPaletteGeneratorDemo"));
const WaterRippleDemo = dynamic(() => import("./demos/WaterRippleDemo"));
const CubeSpinnerDemo = dynamic(() => import("./demos/CubeSpinnerDemo"));
const MagnifiedDockDemo = dynamic(() => import("./demos/MagnifiedDockDemo"));
const KanbanDragDropDemo = dynamic(() => import("./demos/KanbanDragDropDemo"));
const StarFieldDemo = dynamic(() => import("./demos/StarFieldDemo"));
const StoryViewDemo = dynamic(() => import("./demos/StoryViewDemo"));
const ScratchCardDemo = dynamic(() => import("./demos/ScratchCardDemo"));
const GradientFollowerDemo = dynamic(() => import("./demos/GradientFollowerDemo"));
const KineticTypographyDemo = dynamic(() => import("./demos/KineticTypographyDemo"));
const GridDistortionDemo = dynamic(() => import("./demos/GridDistortionDemo"));
const FocusBlurRevealDemo = dynamic(() => import("./demos/FocusBlurRevealDemo"));
const MagneticGalleryDemo = dynamic(() => import("./demos/MagneticGalleryDemo"));
const InfiniteTunnelDemo = dynamic(() => import("./demos/InfiniteTunnelDemo"));
const GlitchImageDemo = dynamic(() => import("./demos/GlitchImageDemo"));
const ParticleTextDemo = dynamic(() => import("./demos/ParticleTextDemo"));
const LiquidButtonDemo = dynamic(() => import("./demos/LiquidButtonDemo"), { ssr: false });
const VerticalCardStackDemo = dynamic(() => import("./demos/VerticalCardStackDemo"));
const MouseImageTrailDemo = dynamic(() => import("./demos/MouseImageTrailDemo"));
const RetroGridScrollDemo = dynamic(() => import("./demos/RetroGridScrollDemo"));
const DnaHelixDemo = dynamic(() => import("./demos/DnaHelixDemo"));
const MatrixRainDemo = dynamic(() => import("./demos/MatrixRainDemo"));
const FireworksDemo = dynamic(() => import("./demos/FireworksDemo"));

const DEMO_MAP: Record<number, React.ComponentType> = {
  18: GradientDemo,
  25: LoadingDemo,
  4: TypographyDemo,
  26: HoverDemo,
  12: MicroInteractionDemo,
  27: NeumorphicDemo,
  1: RealTimeRenderingDemo,
  7: LineAnimationDemo,
  8: SelfDrawingDemo,
  9: MorphingDemo,
  14: Faux3DDemo,
  2: ScrollytellingDemo,
  5: CollaborativeDemo,
  15: ScrollingEffectsDemo,
  22: PageTransitionDemo,
  30: FlipbookDemo,
  6: AmbientBackgroundDemo,
  20: AmbientBackgroundDemo,
  16: MixedMediaDemo,
  17: LiquidMotionDemo,
  28: GlassmorphismDemo,
  29: ClaymorphismDemo,
  10: AnimatedLogoDemo,
  11: AnimatedIconsDemo,
  13: CharacterDemo,
  21: DoodleDemo,
  31: StopMotionDemo,
  3: ARVRDemo,
  19: IsometricDemo,
  23: HeroSectionDemo,
  24: SkeletonDemo,
  32: InteractiveChartsDemo,
  33: CircularProgressDemo,
  34: NumberCounterDemo,
  35: AudioWaveformDemo,
  36: PricingTableDemo,
  37: TestimonialCarouselDemo,
  38: LogoMarqueeDemo,
  39: CountdownTimerDemo,
  40: ComparisonSliderDemo,
  41: MegaMenuDemo,
  42: ScrollProgressDemo,
  43: AnimatedTabsDemo,
  44: AccordionDemo,
  45: SidebarCollapseDemo,
  46: FloatingLabelDemo,
  47: PasswordStrengthDemo,
  48: FileUploadDemo,
  49: MultiStepFormDemo,
  50: AnimatedToggleDemo,
  51: MagneticButtonDemo,
  52: CursorTrailDemo,
  53: ParallaxTiltDemo,
  54: SpotlightRevealDemo,
  55: MagnifyingGlassDemo,
  56: ToastNotificationDemo,
  57: SuccessMorphDemo,
  58: ConfettiDemo,
  59: AdvancedSkeletonDemo,
  60: TextScrambleDemo,
  61: TypewriterDemo,
  62: VideoMaskDemo,
  63: InteractiveGlobeDemo,
  64: AiAssistantDemo,
  65: CodeTypingDemo,
  66: DynamicIslandDemo,
  67: ParallaxDeviceDemo,
  68: HolographicCardDemo,
  69: LiquidTabBarDemo,
  70: ParticleNetworkDemo,
  71: StackedCardCarouselDemo,
  72: CylinderScrollDemo,
  73: GravityPhysicsGridDemo,
  74: MorphingSvgLoaderDemo,
  75: AudioVisualizerDemo,
  76: BookFlipDemo,
  77: ElasticDragDemo,
  78: ColorPaletteGeneratorDemo,
  79: WaterRippleDemo,
  80: CubeSpinnerDemo,
  81: MagnifiedDockDemo,
  82: KanbanDragDropDemo,
  83: StarFieldDemo,
  84: StoryViewDemo,
  85: ScratchCardDemo,
  86: GradientFollowerDemo,
  87: KineticTypographyDemo,
  88: GridDistortionDemo,
  89: FocusBlurRevealDemo,
  90: MagneticGalleryDemo,
  91: InfiniteTunnelDemo,
  92: GlitchImageDemo,
  93: ParticleTextDemo,
  94: LiquidButtonDemo,
  95: VerticalCardStackDemo,
  96: MouseImageTrailDemo,
  97: RetroGridScrollDemo,
  98: DnaHelixDemo,
  99: MatrixRainDemo,
  100: FireworksDemo,
};

interface AnimationCardProps {
  animation: AnimationItem;
  index: number;
}

export default function AnimationCard({ animation, index }: AnimationCardProps) {
  const DemoComponent = DEMO_MAP[animation.id];
  const [showCode, setShowCode] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const controlSchema = controls[animation.id];
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

  const handleViewCode = async () => {
    if (showCode) {
      setShowCode(false);
      return;
    }
    setShowControls(false);

    if (!code) {
      setLoading(true);
      const content = await getCode(animation.id);
      setCode(content);
      setLoading(false);
    }
    setShowCode(true);
  };

  const handleToggleControls = () => {
    if (showControls) {
      setShowControls(false);
    } else {
      setShowControls(true);
      setShowCode(false);
    }
  };

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative overflow-hidden rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#5FC7CD]/50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
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

      {/* Demo Area */}
      {DemoComponent ? (
        <div className="h-48 w-full border-b border-[#E2E8F0] bg-zinc-950 relative overflow-hidden">
          <DemoComponent {...propValues} />
        </div>
      ) : (
        <div className="h-48 w-full border-b border-[#E2E8F0] bg-zinc-950 flex items-center justify-center text-zinc-500 font-mono text-xs">
          Preview Coming Soon
        </div>
      )}

      <div className="p-6 flex flex-col flex-grow justify-between relative z-10">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-[#969696] uppercase tracking-wider">
              {animation.category}
            </span>
            {DemoComponent && (
              <span className="flex items-center text-xs text-[#5FC7CD] bg-[#5FC7CD]/10 px-2 py-1 rounded-full">
                <Sparkles className="w-3 h-3 mr-1" />
                Live Demo
              </span>
            )}
          </div>
          
          <h3 className="text-xl font-bold text-[#455263] mb-2 group-hover:text-[#5FC7CD] transition-colors">
            {animation.title}
          </h3>
          
          <p className="text-gray-500 text-sm leading-relaxed">
            {animation.description}
          </p>
        </div>

          <div className="mt-6 pt-6 border-t border-[#E2E8F0] flex items-center justify-between">
          <span className="text-[#969696] text-sm font-mono">
            {String(animation.id).padStart(2, '0')}
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

