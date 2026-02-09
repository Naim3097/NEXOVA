import React from 'react';
import { FooterProps } from '@/types';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Music2,
  Globe,
} from 'lucide-react';

interface FooterElementProps {
  props: FooterProps;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: () => void;
  onHover?: (hovering: boolean) => void;
}

const socialIcons: Record<string, React.ComponentType<any>> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
  tiktok: Music2, // TikTok icon (using Music2 as closest match)
};

export const FooterElement = React.memo(
  ({ props, isSelected, isHovered, onSelect, onHover }: FooterElementProps) => {
    const {
      logo,
      logoText,
      description,
      columns,
      socialLinks,
      copyright,
      bgColor,
      textColor,
      backgroundImage,
      backgroundOpacity = 70,
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

    return (
      <footer
        className={`${baseClasses} py-12 px-4 cursor-pointer overflow-hidden`}
        style={{
          backgroundColor: backgroundImage ? 'transparent' : bgColor,
          color: textColor,
        }}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {/* Logo and Description */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
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
              {description && (
                <p className="text-sm opacity-80 mb-4">{description}</p>
              )}
              {/* Social Links */}
              {socialLinks && socialLinks.length > 0 && (
                <div className="flex gap-3">
                  {socialLinks.map((social, index) => {
                    const Icon = socialIcons[social.platform] || Globe; // Fallback to Globe icon
                    return (
                      <a
                        key={index}
                        href={social.url}
                        className="p-2 rounded-full hover:bg-black/10 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={social.platform}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Link Columns */}
            {columns.map((column, colIndex) => (
              <div key={colIndex}>
                <h3 className="font-semibold text-lg mb-4">{column.title}</h3>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.url}
                        className="text-sm opacity-80 hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Copyright */}
          <div
            className="pt-8 border-t"
            style={{ borderColor: `${textColor}20` }}
          >
            <p className="text-sm text-center opacity-70">{copyright}</p>
          </div>
        </div>
      </footer>
    );
  }
);

FooterElement.displayName = 'FooterElement';
