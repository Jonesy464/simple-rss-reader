import DOMPurify from 'dompurify';

/**
 * Sanitize untrusted HTML from RSS feeds.
 * Strips scripts, event handlers, dangerous tags, and non-http(s) URLs.
 */
export function sanitizeHtml(dirty) {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, {
    // Allow common content tags
    ALLOWED_TAGS: [
      'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code',
      'img', 'figure', 'figcaption', 'hr', 'span', 'div', 'table',
      'thead', 'tbody', 'tr', 'th', 'td', 'caption', 'sub', 'sup',
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'width', 'height', 'class',
      'target', 'rel', 'loading',
    ],
    // Only allow safe URI schemes
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    // Force links to open safely
    ADD_ATTR: ['target'],
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'textarea'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
  });
}

/**
 * Validate that a URL uses http or https scheme.
 * Returns the URL if valid, or null.
 */
export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return url;
    }
    return null;
  } catch {
    return null;
  }
}
