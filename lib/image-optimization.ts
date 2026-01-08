/**
 * Image Optimization Utilities
 * Helpers for optimizing images in published pages
 */

export interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * Generate optimized image URL using Next.js Image Optimization API
 */
export function getOptimizedImageUrl(
  originalUrl: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
  }
): string {
  // If using external URL (Supabase storage), return as-is for now
  // In production, you'd want to proxy through Next.js Image API
  if (originalUrl.startsWith('http')) {
    return originalUrl;
  }

  // For local images, use Next.js Image Optimization
  const params = new URLSearchParams();
  if (options?.width) params.append('w', options.width.toString());
  if (options?.height) params.append('h', options.height.toString());
  if (options?.quality) params.append('q', options.quality.toString());

  return `/_next/image?url=${encodeURIComponent(originalUrl)}&${params.toString()}`;
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(
  originalUrl: string,
  widths: number[] = [640, 768, 1024, 1280, 1536]
): string {
  return widths
    .map((width) => {
      const url = getOptimizedImageUrl(originalUrl, { width, quality: 80 });
      return `${url} ${width}w`;
    })
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(breakpoints?: Record<string, string>): string {
  if (breakpoints) {
    return Object.entries(breakpoints)
      .map(([breakpoint, size]) => `(max-width: ${breakpoint}) ${size}`)
      .join(', ');
  }

  // Default sizes
  return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
}

/**
 * Validate image file size (max 5MB)
 */
export function validateImageSize(file: File, maxSizeMB: number = 5): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxBytes;
}

/**
 * Validate image file type
 */
export function validateImageType(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  return allowedTypes.includes(file.type);
}

/**
 * Get image dimensions from file
 */
export function getImageDimensions(file: File): Promise<ImageDimensions> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Compress image client-side before upload
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.85
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      // Resize image on canvas
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        file.type,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

/**
 * Generate lazy loading attributes for images
 */
export function getLazyLoadingAttrs(): { loading: 'lazy'; decoding: 'async' } {
  return {
    loading: 'lazy',
    decoding: 'async',
  };
}

/**
 * Generate blur placeholder data URL
 */
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) return '';

  // Create a simple gradient as placeholder
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#e5e7eb');
  gradient.addColorStop(1, '#f3f4f6');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL();
}

/**
 * Preload critical images
 */
export function preloadImage(url: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = url;
  document.head.appendChild(link);
}

/**
 * Calculate optimal image format based on browser support
 */
export function getOptimalImageFormat(): 'webp' | 'jpeg' {
  // Check WebP support
  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0 ? 'webp' : 'jpeg';
  }
  return 'jpeg';
}

/**
 * Generate responsive image HTML for published pages
 */
export function generateResponsiveImageHTML(
  src: string,
  alt: string,
  options?: {
    width?: number;
    height?: number;
    className?: string;
    loading?: 'lazy' | 'eager';
  }
): string {
  const srcset = generateSrcSet(src);
  const sizes = generateSizes();
  const loading = options?.loading || 'lazy';

  return `<img
    src="${src}"
    srcset="${srcset}"
    sizes="${sizes}"
    alt="${alt}"
    loading="${loading}"
    decoding="async"
    ${options?.width ? `width="${options.width}"` : ''}
    ${options?.height ? `height="${options.height}"` : ''}
    ${options?.className ? `class="${options.className}"` : ''}
  />`;
}
