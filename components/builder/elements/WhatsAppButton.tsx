import React from 'react';
import { MessageCircle } from 'lucide-react';

export interface WhatsAppButtonProps {
  phoneNumber: string; // Format: country code + number (e.g., "60123456789" for Malaysia)
  message?: string; // Pre-filled message
  buttonText: string;
  buttonColor: string;
  buttonSize: 'sm' | 'md' | 'lg';
  position: 'fixed' | 'inline'; // Fixed (floating) or inline in page
  fixedPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  showIcon: boolean;
  customIcon?: string; // URL to custom icon
  tooltipText?: string;
  showHeadline?: boolean; // Show headline above button
  headlineText?: string; // Headline text
  headlineColor?: string; // Headline text color
}

interface WhatsAppButtonElementProps {
  props: WhatsAppButtonProps;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: () => void;
  onHover?: (hovering: boolean) => void;
}

export const WhatsAppButtonElement: React.FC<WhatsAppButtonElementProps> = ({
  props,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}) => {
  const {
    phoneNumber,
    message = '',
    buttonText,
    buttonColor,
    buttonSize,
    position,
    fixedPosition = 'bottom-right',
    showIcon,
    customIcon,
    tooltipText,
    showHeadline = false,
    headlineText = 'Want to know more about this product?',
    headlineColor = '#1f2937',
  } = props;

  // Generate WhatsApp link
  const generateWhatsAppLink = () => {
    // Remove all non-digit characters from phone number
    const cleanPhone = phoneNumber.replace(/\D/g, '');

    // Encode the message
    const encodedMessage = message ? encodeURIComponent(message) : '';

    // Construct WhatsApp URL
    return `https://wa.me/${cleanPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  // Fixed position classes
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  // Icon size based on button size
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const buttonClasses = `
    inline-flex items-center justify-center gap-2
    ${sizeClasses[buttonSize]}
    font-semibold rounded-full
    transition-all duration-300
    hover:scale-105 hover:shadow-lg
    focus:outline-none focus:ring-4 focus:ring-offset-2
    ${position === 'fixed' ? 'shadow-2xl z-50' : ''}
  `;

  // In builder mode, use absolute positioning instead of fixed
  // to keep the button inside the canvas
  const isBuilderMode = isSelected !== undefined;

  const containerClasses = position === 'fixed'
    ? `${isBuilderMode ? 'absolute' : 'fixed'} ${positionClasses[fixedPosition]} z-50`
    : 'py-20 px-4 text-center';

  return (
    <div
      className={containerClasses}
      onClick={onSelect}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      {/* Headline (only for inline position) */}
      {position === 'inline' && showHeadline && (
        <div className="max-w-2xl mx-auto mb-8">
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: headlineColor }}
          >
            {headlineText}
          </h2>
        </div>
      )}

      {/* Tooltip (only for fixed position) */}
      {position === 'fixed' && tooltipText && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {tooltipText}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}

      <a
        href={generateWhatsAppLink()}
        target="_blank"
        rel="noopener noreferrer"
        className={`group ${buttonClasses}`}
        style={{
          backgroundColor: buttonColor,
          color: '#ffffff',
        }}
        onClick={(e) => {
          // In builder mode, prevent opening WhatsApp
          if (isSelected !== undefined) {
            e.preventDefault();
          }
        }}
      >
        {/* Icon */}
        {showIcon && (
          customIcon ? (
            <img
              src={customIcon}
              alt="WhatsApp"
              className={iconSizeClasses[buttonSize]}
            />
          ) : (
            <MessageCircle className={iconSizeClasses[buttonSize]} />
          )
        )}

        {/* Button Text */}
        <span>{buttonText}</span>

        {/* Pulse animation for fixed position */}
        {position === 'fixed' && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: buttonColor }}></span>
        )}
      </a>

      {/* Builder mode indicator */}
      {isSelected !== undefined && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {position === 'fixed' ? 'Fixed Position Button' : 'Inline Button'}
        </div>
      )}
    </div>
  );
};

// Preview component for element library
export const WhatsAppButtonPreview: React.FC<{ props: WhatsAppButtonProps }> = ({ props }) => {
  return (
    <div className="flex items-center justify-center p-4 bg-gray-50 rounded">
      <WhatsAppButtonElement props={props} />
    </div>
  );
};
