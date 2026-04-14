import React, { useState } from 'react';
import { FAQProps } from '@/types';
import { getFontFamilyCSS } from '@/lib/fonts';
import { ChevronDown } from 'lucide-react';

interface FAQElementProps {
  props: FAQProps;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: () => void;
  onHover?: (hovering: boolean) => void;
}

export const FAQElement = React.memo(
  ({ props, isSelected, isHovered, onSelect, onHover }: FAQElementProps) => {
    const {
      variant,
      title,
      questions,
      backgroundImage,
      backgroundOpacity = 70,
      bgColor = '#000000',
      fontFamily,
    } = props;

    const titleFontFamily = getFontFamilyCSS(fontFamily);
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const baseClasses = `relative transition-all ${
      isSelected ? 'ring-4 ring-blue-500' : ''
    } ${isHovered ? 'ring-2 ring-blue-300' : ''}`;

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect?.();
    };

    const handleMouseEnter = () => onHover?.(true);
    const handleMouseLeave = () => onHover?.(false);

    const toggleQuestion = (index: number, e: React.MouseEvent) => {
      e.stopPropagation();
      setOpenIndex(openIndex === index ? null : index);
    };

    // Single column variant
    if (variant === 'single_column') {
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

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2
              className="text-4xl font-bold text-center mb-12 text-gray-900"
              style={
                titleFontFamily ? { fontFamily: titleFontFamily } : undefined
              }
            >
              {title}
            </h2>
            <div className="space-y-4">
              {questions.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-left"
                    onClick={(e) => toggleQuestion(index, e)}
                  >
                    <span className="font-semibold text-lg text-gray-900">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openIndex === index && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                      <p className="text-gray-700">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    // Two column variant
    if (variant === 'two_column') {
      const midpoint = Math.ceil(questions.length / 2);
      const leftColumn = questions.slice(0, midpoint);
      const rightColumn = questions.slice(midpoint);

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
            <h2
              className="text-4xl font-bold text-center mb-12 text-gray-900"
              style={
                titleFontFamily ? { fontFamily: titleFontFamily } : undefined
              }
            >
              {title}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left column */}
              <div className="space-y-4">
                {leftColumn.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg overflow-hidden bg-white"
                  >
                    <button
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                      onClick={(e) => toggleQuestion(index, e)}
                    >
                      <span className="font-semibold text-lg text-gray-900">
                        {item.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ml-2 ${
                          openIndex === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openIndex === index && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700">{item.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Right column */}
              <div className="space-y-4">
                {rightColumn.map((item, index) => {
                  const actualIndex = midpoint + index;
                  return (
                    <div
                      key={actualIndex}
                      className="border border-gray-200 rounded-lg overflow-hidden bg-white"
                    >
                      <button
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                        onClick={(e) => toggleQuestion(actualIndex, e)}
                      >
                        <span className="font-semibold text-lg text-gray-900">
                          {item.question}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ml-2 ${
                            openIndex === actualIndex ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {openIndex === actualIndex && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                          <p className="text-gray-700">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      );
    }

    return null;
  }
);

FAQElement.displayName = 'FAQElement';
