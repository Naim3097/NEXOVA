import React, { useState } from 'react';
import { NavigationProps } from '@/types';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationElementProps {
  props: NavigationProps;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: () => void;
  onHover?: (hovering: boolean) => void;
}

export const NavigationElement = React.memo(
  ({ props, isSelected, isHovered, onSelect, onHover }: NavigationElementProps) => {
    const {
      logo,
      logoText,
      menuItems,
      ctaButton,
      bgColor,
      textColor,
      isSticky,
      layout,
    } = props;

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const baseClasses = `relative transition-all ${
      isSelected ? 'ring-4 ring-blue-500' : ''
    } ${isHovered ? 'ring-2 ring-blue-300' : ''}`;

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect?.();
    };

    const handleMouseEnter = () => onHover?.(true);
    const handleMouseLeave = () => onHover?.(false);

    return (
      <nav
        className={`${baseClasses} ${isSticky ? 'sticky top-0 z-40' : ''} w-full cursor-pointer`}
        style={{ backgroundColor: bgColor, color: textColor }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {logo && (
                <img
                  src={logo}
                  alt={logoText}
                  className="h-8 w-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
              <span className="text-xl font-bold">{logoText}</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {layout === 'center' && <div className="flex-1" />}

              {menuItems.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  className="hover:opacity-80 transition-opacity font-medium"
                  onClick={(e) => e.stopPropagation()}
                  style={{ color: textColor }}
                >
                  {item.label}
                </a>
              ))}

              {ctaButton && (
                <Button
                  size="sm"
                  className="ml-4"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    backgroundColor: textColor,
                    color: bgColor,
                  }}
                >
                  {ctaButton.text}
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-black/10 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden pb-4 border-t" style={{ borderColor: `${textColor}20` }}>
              <div className="flex flex-col gap-3 pt-4">
                {menuItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    className="px-3 py-2 rounded-lg hover:bg-black/10 transition-colors font-medium"
                    onClick={(e) => e.stopPropagation()}
                    style={{ color: textColor }}
                  >
                    {item.label}
                  </a>
                ))}
                {ctaButton && (
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      backgroundColor: textColor,
                      color: bgColor,
                    }}
                  >
                    {ctaButton.text}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    );
  }
);

NavigationElement.displayName = 'NavigationElement';
