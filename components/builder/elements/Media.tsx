import React from 'react';
import { MediaProps } from '@/types';
import { ImageIcon, Video, Upload } from 'lucide-react';

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
      mediaType = 'image',
      sourceType = 'url',
      mediaUrl,
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

    // Render empty state placeholder
    const renderPlaceholder = () => (
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
            <p className="text-gray-500 font-medium">Add an Image</p>
            <p className="text-gray-400 text-sm mt-1">Upload or paste URL</p>
          </>
        ) : (
          <>
            <Video className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-500 font-medium">Add a Video</p>
            <p className="text-gray-400 text-sm mt-1">Upload or paste URL</p>
          </>
        )}
      </div>
    );

    // Render image
    const renderImage = () => (
      <img
        src={mediaUrl}
        alt={altText}
        className={`object-cover ${getShadowClass()} w-full`}
        style={{
          ...getAspectRatioStyle(),
          ...getBorderRadiusStyle(),
          maxWidth: '100%',
          height: 'auto',
        }}
        onError={(e) => {
          console.error('[MediaElement] Failed to load image:', mediaUrl);
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
        // Extract YouTube video ID
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
        // Extract Vimeo video ID
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

      // Regular video file
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
    const renderCaption = () => {
      if (!showCaption || !caption) return null;

      return (
        <p
          className="text-gray-600 text-sm text-center mt-3"
          style={{
            maxWidth: '100%',
          }}
        >
          {caption}
        </p>
      );
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
        <div className={`max-w-7xl mx-auto ${getAlignmentClasses()}`}>
          <div
            className={`${layout !== 'full_width' ? '' : 'w-full'}`}
            style={{
              width: layout === 'full_width' ? '100%' : maxWidth,
              maxWidth: '100%',
            }}
          >
            {/* Caption Above */}
            {captionPosition === 'above' && renderCaption()}

            {/* Media Content */}
            {!mediaUrl
              ? renderPlaceholder()
              : mediaType === 'image'
                ? renderImage()
                : renderVideo()}

            {/* Caption Below */}
            {captionPosition === 'below' && renderCaption()}
          </div>
        </div>
      </section>
    );
  }
);

MediaElement.displayName = 'MediaElement';
