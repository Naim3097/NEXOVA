import React from 'react';
import { CTAProps } from '@/types';
import { ArrowRight } from 'lucide-react';

interface CTAElementProps {
  props: CTAProps;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: () => void;
  onHover?: (hovering: boolean) => void;
}

export const CTAElement = React.memo(
  ({ props, isSelected, isHovered, onSelect, onHover }: CTAElementProps) => {
    const {
      variant,
      headline,
      description,
      buttonText,
      buttonUrl,
      bgGradient,
      backgroundImage,
      backgroundOpacity = 70,
      buttonColor = '#ffffff',
      buttonTextColor = '#111827',
      buttonSize = 'lg',
      buttonFontSize = '1.125rem',
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

    // Custom button styles
    const getButtonPadding = () => {
      switch (buttonSize) {
        case 'sm':
          return 'px-4 py-2';
        case 'md':
          return 'px-6 py-3';
        case 'lg':
          return 'px-8 py-4';
        default:
          return 'px-8 py-4';
      }
    };

    const buttonStyles = {
      backgroundColor: buttonColor,
      color: buttonTextColor,
      fontSize: buttonFontSize,
      border: `2px solid ${buttonTextColor}`,
      borderRadius: '0.5rem',
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      cursor: 'pointer',
      transition: 'opacity 0.2s',
    };

    const buttonHoverStyles = {
      ...buttonStyles,
      opacity: 0.9,
    };

    // Centered variant
    if (variant === 'centered') {
      return (
        <section
          className={`${baseClasses} py-20 px-4 cursor-pointer overflow-hidden`}
          style={{ background: backgroundImage ? 'transparent' : bgGradient }}
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
                  backgroundColor: '#000000',
                  opacity: backgroundOpacity / 100,
                }}
              />
            </>
          )}

          <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{headline}</h2>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              {description}
            </p>
            <a
              href={buttonUrl || '#'}
              className={getButtonPadding()}
              style={buttonStyles}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, buttonHoverStyles);
              }}
              onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, buttonStyles);
              }}
            >
              {buttonText}
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>
      );
    }

    // Split variant
    if (variant === 'split') {
      return (
        <section
          className={`${baseClasses} py-20 px-4 cursor-pointer overflow-hidden`}
          style={{ background: backgroundImage ? 'transparent' : bgGradient }}
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
                  backgroundColor: '#000000',
                  opacity: backgroundOpacity / 100,
                }}
              />
            </>
          )}

          <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">{headline}</h2>
              <p className="text-xl text-white/90">{description}</p>
            </div>
            <div className="flex justify-center md:justify-end">
              <a
                href={buttonUrl || '#'}
                className={getButtonPadding()}
                style={buttonStyles}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, buttonHoverStyles);
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, buttonStyles);
                }}
              >
                {buttonText}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </section>
      );
    }

    // Banner variant (compact)
    if (variant === 'banner') {
      return (
        <section
          className={`${baseClasses} py-12 px-4 cursor-pointer overflow-hidden`}
          style={{ background: backgroundImage ? 'transparent' : bgGradient }}
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
                  backgroundColor: '#000000',
                  opacity: backgroundOpacity / 100,
                }}
              />
            </>
          )}

          <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">{headline}</h3>
              <p className="text-lg text-white/90">{description}</p>
            </div>
            <a
              href={buttonUrl || '#'}
              className={`flex-shrink-0 whitespace-nowrap ${getButtonPadding()}`}
              style={buttonStyles}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, buttonHoverStyles);
              }}
              onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, buttonStyles);
              }}
            >
              {buttonText}
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>
      );
    }

    return null;
  }
);

CTAElement.displayName = 'CTAElement';
