import React, { useState, useEffect } from 'react';
import { AnnouncementBarProps } from '@/types';
import { X } from 'lucide-react';

interface AnnouncementBarElementProps {
  props: AnnouncementBarProps;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: () => void;
  onHover?: (hovering: boolean) => void;
}

export const AnnouncementBarElement = React.memo(
  ({ props, isSelected, isHovered, onSelect, onHover }: AnnouncementBarElementProps) => {
    const {
      message,
      bgColor,
      textColor,
      showCountdown,
      countdownLabel,
      countdownEndDate,
      isSticky,
      showCloseButton,
      link,
      linkText,
    } = props;

    const [isClosed, setIsClosed] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
      if (!showCountdown || !countdownEndDate) return;

      const calculateTimeLeft = () => {
        const difference = +new Date(countdownEndDate) - +new Date();

        if (difference > 0) {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
          });
        } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      };

      calculateTimeLeft();
      const timer = setInterval(calculateTimeLeft, 1000);

      return () => clearInterval(timer);
    }, [showCountdown, countdownEndDate]);

    const baseClasses = `relative transition-all ${
      isSelected ? 'ring-4 ring-blue-500' : ''
    } ${isHovered ? 'ring-2 ring-blue-300' : ''}`;

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect?.();
    };

    const handleMouseEnter = () => onHover?.(true);
    const handleMouseLeave = () => onHover?.(false);

    const handleClose = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsClosed(true);
    };

    if (isClosed) return null;

    const isBuilderMode = isSelected !== undefined;
    const zIndexClass = isSticky ? (isBuilderMode ? 'z-10' : 'z-50') : '';

    return (
      <div
        className={`${baseClasses} ${isSticky ? 'sticky top-0' : ''} ${zIndexClass} py-3 px-4 cursor-pointer`}
        style={{ backgroundColor: bgColor, color: textColor }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4 flex-wrap relative">
          {/* Main centered content */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {/* Message */}
            <span className="font-medium text-center">{message}</span>

            {/* Countdown Timer */}
            {showCountdown && countdownEndDate && (
              <div className="flex items-center gap-2">
                {countdownLabel && (
                  <span className="text-sm opacity-90">{countdownLabel}</span>
                )}
                <div className="flex gap-1 font-mono">
                  <div className="bg-black/20 px-2 py-1 rounded text-sm min-w-[2.5rem] text-center">
                    <span className="font-bold">{String(timeLeft.days).padStart(2, '0')}</span>
                    <span className="text-xs opacity-75">d</span>
                  </div>
                  <span className="font-bold">:</span>
                  <div className="bg-black/20 px-2 py-1 rounded text-sm min-w-[2.5rem] text-center">
                    <span className="font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
                    <span className="text-xs opacity-75">h</span>
                  </div>
                  <span className="font-bold">:</span>
                  <div className="bg-black/20 px-2 py-1 rounded text-sm min-w-[2.5rem] text-center">
                    <span className="font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
                    <span className="text-xs opacity-75">m</span>
                  </div>
                  <span className="font-bold">:</span>
                  <div className="bg-black/20 px-2 py-1 rounded text-sm min-w-[2.5rem] text-center">
                    <span className="font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
                    <span className="text-xs opacity-75">s</span>
                  </div>
                </div>
              </div>
            )}

            {/* Link */}
            {link && linkText && (
              <a
                href={link}
                className="underline hover:no-underline font-semibold"
                onClick={(e) => e.stopPropagation()}
              >
                {linkText}
              </a>
            )}
          </div>

          {/* Close Button - Absolute positioned to the right */}
          {showCloseButton && (
            <button
              onClick={handleClose}
              className="absolute right-0 p-1 hover:bg-black/10 rounded transition-colors"
              aria-label="Close announcement"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

AnnouncementBarElement.displayName = 'AnnouncementBarElement';
