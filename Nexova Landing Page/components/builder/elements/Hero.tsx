import React from 'react';
import { HeroProps } from '@/types';
import { Button } from '@/components/ui/button';
import { getFontFamilyCSS } from '@/lib/fonts';

interface HeroElementProps {
  props: HeroProps;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: () => void;
  onHover?: (hovering: boolean) => void;
}

export const HeroElement = ({
  props,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}: HeroElementProps) => {
  const {
    variant,
    headline,
    subheadline,
    ctaText,
    ctaUrl,
    image,
    bgColor,
    headlineColor = '#111827',
    subheadlineColor = '#4b5563',
    headlineSize = '5xl',
    subheadlineSize = 'xl',
    imageOpacity = 70,
    buttonBgColor = '#2563eb',
    buttonTextColor = '#ffffff',
    showCtaButton = true,
    imageScale = 100,
    imagePositionX = 50,
    imagePositionY = 50,
    bgImage,
    bgImageOpacity = 30,
    bgGradient = false,
    bgGradientFrom = '#000000',
    bgGradientTo = '#333333',
    bgGradientDirection = 'to right',
    headlineFont,
    subheadlineFont,
  } = props;

  const headlineFontFamily = getFontFamilyCSS(headlineFont);
  const subheadlineFontFamily = getFontFamilyCSS(subheadlineFont);

  // Compute background style
  const bgStyle: React.CSSProperties = bgGradient
    ? {
        background: `linear-gradient(${bgGradientDirection}, ${bgGradientFrom}, ${bgGradientTo})`,
      }
    : { backgroundColor: bgColor };

  // Debug: Log when image prop changes
  React.useEffect(() => {
    if (image) {
      console.log('[HeroElement] Image updated:', image);
    }
  }, [image]);

  const baseClasses = `relative transition-all ${
    isSelected ? 'ring-4 ring-blue-500' : ''
  } ${isHovered ? 'ring-2 ring-blue-300' : ''}`;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.();
  };

  const handleMouseEnter = () => onHover?.(true);
  const handleMouseLeave = () => onHover?.(false);

  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('[HeroElement] Failed to load image:', image);
    console.error('[HeroElement] Error:', e);
  };

  // Centered variant
  if (variant === 'centered') {
    return (
      <section
        className={`${baseClasses} py-20 px-4 cursor-pointer`}
        style={bgStyle}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-4xl mx-auto text-center">
          {image && (
            <div className="w-32 h-32 mx-auto mb-8 rounded-lg overflow-hidden">
              <img
                src={image}
                alt="Hero"
                className="w-full h-full object-cover"
                style={{
                  transform: `scale(${imageScale / 100}) translate(${50 - imagePositionX}%, ${50 - imagePositionY}%)`,
                }}
                onError={handleImageError}
              />
            </div>
          )}
          <h1
            className={`text-${headlineSize} font-bold mb-6`}
            style={{ color: headlineColor, fontFamily: headlineFontFamily }}
          >
            {headline}
          </h1>
          <p
            className={`text-${subheadlineSize} mb-8`}
            style={{
              color: subheadlineColor,
              fontFamily: subheadlineFontFamily,
            }}
          >
            {subheadline}
          </p>
          {showCtaButton && (
            <Button
              size="lg"
              className="text-lg px-8"
              style={{
                backgroundColor: buttonBgColor,
                color: buttonTextColor,
                border: 'none',
              }}
            >
              {ctaText}
            </Button>
          )}
        </div>
      </section>
    );
  }

  // Image Left variant
  if (variant === 'image_left') {
    return (
      <section
        className={`${baseClasses} relative py-20 px-4 cursor-pointer overflow-hidden`}
        style={bgStyle}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {bgImage && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url("${bgImage}")` }}
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: bgColor,
                opacity: bgImageOpacity / 100,
              }}
            />
          </>
        )}
        <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h1
              className={`text-${headlineSize} font-bold mb-6`}
              style={{ color: headlineColor, fontFamily: headlineFontFamily }}
            >
              {headline}
            </h1>
            <p
              className={`text-${subheadlineSize} mb-8`}
              style={{
                color: subheadlineColor,
                fontFamily: subheadlineFontFamily,
              }}
            >
              {subheadline}
            </p>
            {showCtaButton && (
              <Button
                size="lg"
                className="text-lg px-8"
                style={{
                  backgroundColor: buttonBgColor,
                  color: buttonTextColor,
                  border: 'none',
                }}
              >
                {ctaText}
              </Button>
            )}
          </div>
          <div className="order-1 md:order-2">
            {image ? (
              <div className="w-full h-96 rounded-lg overflow-hidden shadow-xl">
                <img
                  src={image}
                  alt="Hero"
                  className="w-full h-full object-cover"
                  style={{
                    transform: `scale(${imageScale / 100}) translate(${50 - imagePositionX}%, ${50 - imagePositionY}%)`,
                  }}
                  onError={handleImageError}
                />
              </div>
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Image placeholder</span>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Image Background variant
  if (variant === 'image_bg') {
    return (
      <section
        className={`${baseClasses} relative py-32 px-4 cursor-pointer overflow-hidden`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background Image */}
        {image ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url("${image}")`,
              }}
            />
            {/* Overlay */}
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: bgColor,
                opacity: imageOpacity / 100,
              }}
            />
          </>
        ) : (
          <div className="absolute inset-0 bg-gray-900">
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Upload background image
            </div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1
            className={`text-${headlineSize} font-bold mb-6`}
            style={{ color: headlineColor, fontFamily: headlineFontFamily }}
          >
            {headline}
          </h1>
          <p
            className={`text-${subheadlineSize} mb-8`}
            style={{
              color: subheadlineColor,
              fontFamily: subheadlineFontFamily,
            }}
          >
            {subheadline}
          </p>
          {showCtaButton && (
            <Button
              size="lg"
              className="text-lg px-8"
              style={{
                backgroundColor: buttonBgColor,
                color: buttonTextColor,
                border: `2px solid ${buttonTextColor}`,
              }}
            >
              {ctaText}
            </Button>
          )}
        </div>
      </section>
    );
  }

  return null;
};
