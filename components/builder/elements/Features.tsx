import React from 'react';
import { FeaturesProps } from '@/types';
import {
  CheckCircle,
  Star,
  Zap,
  Shield,
  Heart,
  Award,
  Sparkles,
  Rocket,
  Target,
  TrendingUp,
  Clock,
  Users,
  Globe,
  Lock,
  Settings,
  DollarSign,
  Gift,
  ThumbsUp,
  Lightbulb,
  Smartphone,
  LucideIcon
} from 'lucide-react';

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  'check-circle': CheckCircle,
  'star': Star,
  'zap': Zap,
  'shield': Shield,
  'heart': Heart,
  'award': Award,
  'sparkles': Sparkles,
  'rocket': Rocket,
  'target': Target,
  'trending-up': TrendingUp,
  'clock': Clock,
  'users': Users,
  'globe': Globe,
  'lock': Lock,
  'settings': Settings,
  'dollar-sign': DollarSign,
  'gift': Gift,
  'thumbs-up': ThumbsUp,
  'lightbulb': Lightbulb,
  'smartphone': Smartphone,
};

// Helper function to get icon component
const getIconComponent = (iconName: string): LucideIcon => {
  return iconMap[iconName] || CheckCircle;
};

interface FeaturesElementProps {
  props: FeaturesProps;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: () => void;
  onHover?: (hovering: boolean) => void;
}

export const FeaturesElement = React.memo(
  ({ props, isSelected, isHovered, onSelect, onHover }: FeaturesElementProps) => {
    const {
      variant,
      title,
      features,
      backgroundImage,
      backgroundOpacity = 70,
      bgColor = '#000000'
    } = props;

    const baseClasses = `relative transition-all ${
      isSelected ? 'ring-4 ring-blue-500' : ''
    } ${isHovered ? 'ring-2 ring-blue-300' : ''}`;

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect?.();
    };

    const handleMouseEnter = () => onHover?.(true);
    const handleMouseLeave = () => onHover?.(false);

    // Grid variant
    if (variant === 'grid') {
      return (
        <section
          className={`${baseClasses} py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white cursor-pointer overflow-hidden`}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Background Image */}
          {backgroundImage && (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url("${backgroundImage}")` }}
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: bgColor,
                  opacity: backgroundOpacity / 100,
                }}
              />
            </>
          )}

          <div className="relative z-10 max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-10 lg:mb-12 text-gray-900 px-2">
              {title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {features.map((feature, index) => {
                const IconComponent = getIconComponent(feature.icon || 'check-circle');
                return (
                  <div
                    key={index}
                    className="p-4 sm:p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow bg-white"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    // List variant
    if (variant === 'list') {
      return (
        <section
          className={`${baseClasses} py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 cursor-pointer overflow-hidden`}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Background Image */}
          {backgroundImage && (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url("${backgroundImage}")` }}
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: bgColor,
                  opacity: backgroundOpacity / 100,
                }}
              />
            </>
          )}

          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-10 lg:mb-12 text-gray-900 px-2">
              {title}
            </h2>
            <div className="space-y-4 sm:space-y-6">
              {features.map((feature, index) => {
                const IconComponent = getIconComponent(feature.icon || 'check-circle');
                return (
                  <div
                    key={index}
                    className="flex items-start gap-3 sm:gap-4 p-4 sm:p-6 bg-white rounded-lg shadow-sm"
                  >
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2 text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    // Alternating variant
    if (variant === 'alternating') {
      return (
        <section
          className={`${baseClasses} py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white cursor-pointer overflow-hidden`}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Background Image */}
          {backgroundImage && (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url("${backgroundImage}")` }}
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: bgColor,
                  opacity: backgroundOpacity / 100,
                }}
              />
            </>
          )}

          <div className="relative z-10 max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-10 sm:mb-12 lg:mb-16 text-gray-900 px-2">
              {title}
            </h2>
            <div className="space-y-12 sm:space-y-16 lg:space-y-20">
              {features.map((feature, index) => {
                const IconComponent = getIconComponent(feature.icon || 'check-circle');
                return (
                  <div
                    key={index}
                    className={`grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center ${
                      index % 2 === 1 ? 'md:grid-flow-dense' : ''
                    }`}
                  >
                    <div className={index % 2 === 1 ? 'md:col-start-2' : ''}>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                        <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-4 text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-base sm:text-lg text-gray-600">{feature.description}</p>
                    </div>
                    <div
                      className={`h-48 sm:h-56 lg:h-64 bg-gray-200 rounded-lg flex items-center justify-center ${
                        index % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''
                      }`}
                    >
                      <span className="text-gray-400 text-sm sm:text-base">Feature illustration</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    return null;
  }
);

FeaturesElement.displayName = 'FeaturesElement';
