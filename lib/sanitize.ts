import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * This function should be used before rendering any user-generated HTML
 *
 * @param html - The HTML string to sanitize
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtml(html: string): string {
  try {
    // Configure DOMPurify with secure defaults
    return DOMPurify.sanitize(html, {
      // Allow common HTML tags needed for landing pages
      ALLOWED_TAGS: [
        'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'a', 'img', 'ul', 'ol', 'li', 'br', 'hr',
        'strong', 'em', 'b', 'i', 'u', 'strike',
        'section', 'article', 'header', 'footer', 'nav', 'main',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'form', 'input', 'button', 'label', 'textarea', 'select', 'option',
        'video', 'audio', 'source', 'iframe',
        'svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon',
      ],
      // Allow common attributes
      ALLOWED_ATTR: [
        'class', 'id', 'style', 'href', 'src', 'alt', 'title',
        'width', 'height', 'target', 'rel', 'type', 'name', 'value',
        'placeholder', 'required', 'disabled', 'readonly',
        'data-*', 'aria-*', 'role',
        'viewBox', 'xmlns', 'd', 'fill', 'stroke', 'stroke-width',
      ],
      // Allow data attributes
      ALLOW_DATA_ATTR: true,
      // Allow aria attributes for accessibility
      ALLOW_ARIA_ATTR: true,
      // Keep safe URLs only
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      // Sanitize style attributes
      SANITIZE_DOM: true,
      SANITIZE_NAMED_PROPS: true,
      // Keep comments removed
      ALLOW_COMMENTS: false,
      // Return a string
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
    });
  } catch (error) {
    // If DOMPurify fails (e.g., in serverless environment), log error and return original HTML
    // This is a fallback - in production, you should fix the DOMPurify setup
    console.error('DOMPurify sanitization failed:', error);
    console.warn('Returning unsanitized HTML - THIS IS A SECURITY RISK');

    // At minimum, strip script tags as a basic safety measure
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '');
  }
}

/**
 * Validates that HTML content is safe and doesn't contain malicious patterns
 * Use this as an additional check before storing content
 *
 * @param html - The HTML string to validate
 * @returns true if the HTML appears safe, false otherwise
 */
export function isHtmlSafe(html: string): boolean {
  // Check for obvious script injection attempts
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // Event handlers like onclick=
    /<iframe[^>]+src\s*=\s*["'](?!https?:\/\/)/gi, // Non-HTTP iframes
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(html)) {
      return false;
    }
  }

  return true;
}
