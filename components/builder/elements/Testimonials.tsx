import React from 'react';
import { TestimonialsProps } from '@/types';
import { Star } from 'lucide-react';

interface TestimonialsElementProps {
  props: TestimonialsProps;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: () => void;
  onHover?: (hovering: boolean) => void;
  viewportMode?: 'desktop' | 'tablet' | 'mobile';
}

export const TestimonialsElement = React.memo(
  ({
    props,
    isSelected,
    isHovered,
    onSelect,
    onHover,
    viewportMode = 'desktop',
  }: TestimonialsElementProps) => {
    const {
      variant,
      title,
      testimonials,
      backgroundImage,
      backgroundOpacity = 70,
      bgColor = '#000000'
    } = props;

    // Determine grid columns based on viewport mode
    const getGridCols = () => {
      if (viewportMode === 'mobile') return 'grid-cols-1';
      if (viewportMode === 'tablet') return 'grid-cols-1 md:grid-cols-2';
      return 'grid-cols-1 md:grid-cols-3';
    };

    const getMasonryCols = () => {
      if (viewportMode === 'mobile') return 'columns-1';
      if (viewportMode === 'tablet') return 'columns-1 md:columns-2';
      return 'columns-1 md:columns-3';
    };

    const baseClasses = `relative transition-all ${
      isSelected ? 'ring-4 ring-blue-500' : ''
    } ${isHovered ? 'ring-2 ring-blue-300' : ''}`;

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect?.();
    };

    const handleMouseEnter = () => onHover?.(true);
    const handleMouseLeave = () => onHover?.(false);

    const renderStars = (rating: number) => {
      return (
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      );
    };

    // Grid variant
    if (variant === 'grid') {
      return (
        <section
          className={`${baseClasses} py-20 px-4 bg-gray-50 cursor-pointer overflow-hidden`}
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
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              {title}
            </h2>
            <div className={`grid ${getGridCols()} gap-8`}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  {renderStars(testimonial.rating)}
                  <p className="text-gray-700 my-4 italic">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div className="mt-4">
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    // Slider variant (simplified as static for now)
    if (variant === 'slider') {
      return (
        <section
          className={`${baseClasses} py-20 px-4 bg-blue-600 cursor-pointer overflow-hidden`}
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

          <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-12">{title}</h2>
            {testimonials.length > 0 && (
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg">
                {renderStars(testimonials[0].rating)}
                <p className="text-2xl my-6 italic">
                  &quot;{testimonials[0].quote}&quot;
                </p>
                <div className="mt-6">
                  <p className="font-semibold text-lg">
                    {testimonials[0].name}
                  </p>
                  <p className="text-blue-100">{testimonials[0].role}</p>
                </div>
                {/* Slider dots */}
                <div className="flex gap-2 justify-center mt-8">
                  {testimonials.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === 0 ? 'bg-white' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      );
    }

    // Masonry variant
    if (variant === 'masonry') {
      return (
        <section
          className={`${baseClasses} py-20 px-4 bg-white cursor-pointer overflow-hidden`}
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
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
              {title}
            </h2>
            <div className={`${getMasonryCols()} gap-8 space-y-8`}>
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="break-inside-avoid bg-gray-50 p-6 rounded-lg border border-gray-200"
                >
                  {renderStars(testimonial.rating)}
                  <p className="text-gray-700 my-4">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div className="mt-4">
                    <p className="font-semibold text-sm text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    return null;
  }
);

TestimonialsElement.displayName = 'TestimonialsElement';
