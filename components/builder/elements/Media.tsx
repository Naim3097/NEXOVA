import React, { useState, useEffect, useCallback } from 'react';
import { MediaProps, MediaItem } from '@/types';
import { ImageIcon, Video, ChevronLeft, ChevronRight } from 'lucide-react';

interface MediaElementProps {
  props: MediaProps;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: () => void;
  onHover?: (hovering: boolean) => void;
}

export const MediaElement = React.memo(
  ({ props, isSelected, isHovered, onSelect, onHover }: MediaElementProps) => {
    const {
      variant = 'single',
      mediaType = 'image',
      sourceType = 'url',
      mediaUrl,
      mediaItems = [],
      altText = 'Media content',
      autoplay = false,
      loop = true,
      muted = true,
      controls = true,
      layout = 'contained',
      maxWidth = '100%',
      aspectRatio = 'auto',
      borderRadius = '8px',
      showCaption = false,
      caption = '',
      captionPosition = 'below',
      bgColor = '#ffffff',
      paddingY = '2rem',
      shadow = 'none',
      // Carousel specific
      autoSlide = false,
      slideInterval = 5,
      showDots = true,
      showArrows = true,
      // Gallery specific
      columns = 3,
      gap = 'md',
    } = props;

    const [currentSlide, setCurrentSlide] = useState(0);

    const baseClasses = `relative transition-all ${
      isSelected ? 'ring-4 ring-blue-500' : ''
    } ${isHovered ? 'ring-2 ring-blue-300' : ''}`;

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect?.();
    };

    const handleMouseEnter = () => onHover?.(true);
    const handleMouseLeave = () => onHover?.(false);

    // Auto-slide for carousel
    useEffect(() => {
      if (variant !== 'carousel' || !autoSlide || mediaItems.length <= 1)
        return;

      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % mediaItems.length);
      }, slideInterval * 1000);

      return () => clearInterval(timer);
    }, [variant, autoSlide, slideInterval, mediaItems.length]);

    // Navigation handlers for carousel
    const goToSlide = useCallback((index: number) => {
      setCurrentSlide(index);
    }, []);

    const nextSlide = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentSlide((prev) => (prev + 1) % mediaItems.length);
      },
      [mediaItems.length]
    );

    const prevSlide = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentSlide(
          (prev) => (prev - 1 + mediaItems.length) % mediaItems.length
        );
      },
      [mediaItems.length]
    );

    // Get alignment classes based on layout
    const getAlignmentClasses = () => {
      switch (layout) {
        case 'left':
          return 'flex justify-start';
        case 'right':
          return 'flex justify-end';
        case 'center':
          return 'flex justify-center';
        case 'full_width':
          return '';
        default:
          return 'flex justify-center';
      }
    };

    // Get aspect ratio classes
    const getAspectRatioStyle = (): React.CSSProperties => {
      switch (aspectRatio) {
        case '16:9':
          return { aspectRatio: '16/9' };
        case '4:3':
          return { aspectRatio: '4/3' };
        case '1:1':
          return { aspectRatio: '1/1' };
        case '9:16':
          return { aspectRatio: '9/16' };
        default:
          return {};
      }
    };

    // Get shadow classes
    const getShadowClass = () => {
      switch (shadow) {
        case 'sm':
          return 'shadow-sm';
        case 'md':
          return 'shadow-md';
        case 'lg':
          return 'shadow-lg';
        case 'xl':
          return 'shadow-xl';
        default:
          return '';
      }
    };

    // Get border radius style
    const getBorderRadiusStyle = (): React.CSSProperties => {
      if (borderRadius === 'full') {
        return { borderRadius: '9999px' };
      }
      return { borderRadius };
    };

    // Get gap classes
    const getGapClass = () => {
      switch (gap) {
        case 'sm':
          return 'gap-2';
        case 'md':
          return 'gap-4';
        case 'lg':
          return 'gap-6';
        default:
          return 'gap-4';
      }
    };

    // Get columns class
    const getColumnsClass = () => {
      switch (columns) {
        case 2:
          return 'grid-cols-2';
        case 3:
          return 'grid-cols-2 md:grid-cols-3';
        case 4:
          return 'grid-cols-2 md:grid-cols-4';
        default:
          return 'grid-cols-2 md:grid-cols-3';
      }
    };

    // Render empty state placeholder
    const renderPlaceholder = (message?: string) => (
      <div
        className={`flex flex-col items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 ${getShadowClass()}`}
        style={{
          ...getAspectRatioStyle(),
          ...getBorderRadiusStyle(),
          minHeight: aspectRatio === 'auto' ? '200px' : undefined,
          width: '100%',
          maxWidth: '100%',
        }}
      >
        {mediaType === 'image' ? (
          <>
            <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-500 font-medium">
              {message || 'Add an Image'}
            </p>
            <p className="text-gray-400 text-sm mt-1">Upload or paste URL</p>
          </>
        ) : (
          <>
            <Video className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-500 font-medium">
              {message || 'Add a Video'}
            </p>
            <p className="text-gray-400 text-sm mt-1">Upload or paste URL</p>
          </>
        )}
      </div>
    );

    // Render single image
    const renderImage = (url: string, alt: string = altText) => (
      <img
        src={url}
        alt={alt}
        className={`object-cover ${getShadowClass()} w-full`}
        style={{
          ...getAspectRatioStyle(),
          ...getBorderRadiusStyle(),
          maxWidth: '100%',
          height: 'auto',
        }}
        onError={(e) => {
          console.error('[MediaElement] Failed to load image:', url);
        }}
      />
    );

    // Render video
    const renderVideo = () => {
      // Check if it's a YouTube URL
      const isYouTube =
        mediaUrl?.includes('youtube.com') || mediaUrl?.includes('youtu.be');
      const isVimeo = mediaUrl?.includes('vimeo.com');

      if (isYouTube) {
        let videoId = '';
        if (mediaUrl?.includes('youtu.be/')) {
          videoId = mediaUrl.split('youtu.be/')[1]?.split('?')[0] || '';
        } else if (mediaUrl?.includes('youtube.com/watch')) {
          const urlParams = new URLSearchParams(mediaUrl.split('?')[1]);
          videoId = urlParams.get('v') || '';
        } else if (mediaUrl?.includes('youtube.com/embed/')) {
          videoId = mediaUrl.split('embed/')[1]?.split('?')[0] || '';
        }

        return (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&loop=${loop ? 1 : 0}&mute=${muted ? 1 : 0}&controls=${controls ? 1 : 0}`}
            className={`${getShadowClass()}`}
            style={{
              ...getAspectRatioStyle(),
              ...getBorderRadiusStyle(),
              width: '100%',
              maxWidth: '100%',
              aspectRatio: aspectRatio === 'auto' ? '16/9' : undefined,
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      }

      if (isVimeo) {
        const videoId = mediaUrl?.split('vimeo.com/')[1]?.split('?')[0] || '';
        return (
          <iframe
            src={`https://player.vimeo.com/video/${videoId}?autoplay=${autoplay ? 1 : 0}&loop=${loop ? 1 : 0}&muted=${muted ? 1 : 0}`}
            className={`${getShadowClass()}`}
            style={{
              ...getAspectRatioStyle(),
              ...getBorderRadiusStyle(),
              width: '100%',
              maxWidth: '100%',
              aspectRatio: aspectRatio === 'auto' ? '16/9' : undefined,
            }}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        );
      }

      return (
        <video
          src={mediaUrl}
          className={`object-cover ${getShadowClass()}`}
          style={{
            ...getAspectRatioStyle(),
            ...getBorderRadiusStyle(),
            width: '100%',
            maxWidth: '100%',
            height: 'auto',
          }}
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
          controls={controls}
          playsInline
        />
      );
    };

    // Render caption
    const renderCaption = (captionText?: string) => {
      const text = captionText || caption;
      if (!showCaption || !text) return null;

      return (
        <p
          className="text-gray-600 text-sm text-center mt-3"
          style={{
            maxWidth: '100%',
          }}
        >
          {text}
        </p>
      );
    };

    // SINGLE VARIANT (default)
    const renderSingle = () => (
      <div className={`max-w-7xl mx-auto ${getAlignmentClasses()}`}>
        <div
          className={`${layout !== 'full_width' ? '' : 'w-full'}`}
          style={{
            width: layout === 'full_width' ? '100%' : maxWidth,
            maxWidth: '100%',
          }}
        >
          {captionPosition === 'above' && renderCaption()}
          {!mediaUrl
            ? renderPlaceholder()
            : mediaType === 'image'
              ? renderImage(mediaUrl)
              : renderVideo()}
          {captionPosition === 'below' && renderCaption()}
        </div>
      </div>
    );

    // CAROUSEL VARIANT
    const renderCarousel = () => {
      const items =
        mediaItems.length > 0
          ? mediaItems
          : mediaUrl
            ? [{ id: '1', url: mediaUrl, altText, caption }]
            : [];

      if (items.length === 0) {
        return (
          <div className="max-w-7xl mx-auto">
            {renderPlaceholder('Add images for carousel')}
            <p className="text-gray-400 text-xs text-center mt-2">
              Add multiple images in the properties panel
            </p>
          </div>
        );
      }

      return (
        <div className="max-w-7xl mx-auto relative">
          {/* Main Carousel */}
          <div
            className="relative overflow-hidden"
            style={{ ...getBorderRadiusStyle() }}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {items.map((item, index) => (
                <div key={item.id} className="w-full flex-shrink-0">
                  <img
                    src={item.url}
                    alt={item.altText || `Slide ${index + 1}`}
                    className={`w-full object-cover ${getShadowClass()}`}
                    style={{
                      ...getAspectRatioStyle(),
                      aspectRatio: aspectRatio === 'auto' ? '16/9' : undefined,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {showArrows && items.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Dots Navigation */}
          {showDots && items.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToSlide(index);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === currentSlide
                      ? 'bg-gray-800 w-6'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Caption for current slide */}
          {showCaption && items[currentSlide]?.caption && (
            <p className="text-gray-600 text-sm text-center mt-3">
              {items[currentSlide].caption}
            </p>
          )}
        </div>
      );
    };

    // GALLERY VARIANT
    const renderGallery = () => {
      const items =
        mediaItems.length > 0
          ? mediaItems
          : mediaUrl
            ? [{ id: '1', url: mediaUrl, altText }]
            : [];

      if (items.length === 0) {
        return (
          <div className="max-w-7xl mx-auto">
            {renderPlaceholder('Add images for gallery')}
            <p className="text-gray-400 text-xs text-center mt-2">
              Add multiple images in the properties panel
            </p>
          </div>
        );
      }

      return (
        <div className="max-w-7xl mx-auto">
          <div className={`grid ${getColumnsClass()} ${getGapClass()}`}>
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`overflow-hidden ${getShadowClass()}`}
                style={{ ...getBorderRadiusStyle() }}
              >
                <img
                  src={item.url}
                  alt={item.altText || `Gallery image ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  style={{
                    ...getAspectRatioStyle(),
                    aspectRatio: aspectRatio === 'auto' ? '1/1' : undefined,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      );
    };

    // MASONRY VARIANT
    const renderMasonry = () => {
      const items =
        mediaItems.length > 0
          ? mediaItems
          : mediaUrl
            ? [{ id: '1', url: mediaUrl, altText }]
            : [];

      if (items.length === 0) {
        return (
          <div className="max-w-7xl mx-auto">
            {renderPlaceholder('Add images for masonry')}
            <p className="text-gray-400 text-xs text-center mt-2">
              Add multiple images in the properties panel
            </p>
          </div>
        );
      }

      // Distribute items into columns
      const columnCount = columns || 3;
      const columnItems: MediaItem[][] = Array.from(
        { length: columnCount },
        () => []
      );
      items.forEach((item, index) => {
        columnItems[index % columnCount].push(item);
      });

      return (
        <div className="max-w-7xl mx-auto">
          <div className={`flex ${getGapClass()}`}>
            {columnItems.map((colItems, colIndex) => (
              <div
                key={colIndex}
                className={`flex-1 flex flex-col ${getGapClass()}`}
              >
                {colItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`overflow-hidden ${getShadowClass()}`}
                    style={{ ...getBorderRadiusStyle() }}
                  >
                    <img
                      src={item.url}
                      alt={item.altText || `Image ${index + 1}`}
                      className="w-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    };

    // Render based on variant
    const renderContent = () => {
      switch (variant) {
        case 'carousel':
          return renderCarousel();
        case 'gallery':
          return renderGallery();
        case 'masonry':
          return renderMasonry();
        case 'single':
        default:
          return renderSingle();
      }
    };

    return (
      <section
        className={`${baseClasses} px-4 cursor-pointer overflow-hidden`}
        style={{
          backgroundColor: bgColor,
          paddingTop: paddingY,
          paddingBottom: paddingY,
        }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {renderContent()}
      </section>
    );
  }
);

MediaElement.displayName = 'MediaElement';
