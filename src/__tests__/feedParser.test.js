import { describe, it, expect } from 'vitest';
import { extractImage, extractExcerpt } from '../utils/feedParser';

describe('extractImage', () => {
  it('should extract image from thumbnail field', () => {
    const item = {
      thumbnail: 'https://example.com/thumb.jpg',
    };
    expect(extractImage(item)).toBe('https://example.com/thumb.jpg');
  });

  it('should extract image from enclosure with image type', () => {
    const item = {
      enclosure: {
        link: 'https://example.com/image.jpg',
        type: 'image/jpeg',
      },
    };
    expect(extractImage(item)).toBe('https://example.com/image.jpg');
  });

  it('should not extract from enclosure with non-image type', () => {
    const item = {
      enclosure: {
        link: 'https://example.com/audio.mp3',
        type: 'audio/mpeg',
      },
    };
    expect(extractImage(item)).toBeNull();
  });

  it('should extract image from content HTML img tag', () => {
    const item = {
      content:
        '<p>Some text</p><img src="https://example.com/photo.png" alt="Photo" /><p>More text</p>',
    };
    expect(extractImage(item)).toBe('https://example.com/photo.png');
  });

  it('should extract first image when multiple img tags exist', () => {
    const item = {
      content:
        '<img src="https://example.com/first.jpg" /><img src="https://example.com/second.jpg" />',
    };
    expect(extractImage(item)).toBe('https://example.com/first.jpg');
  });

  it('should return null when no image found', () => {
    const item = {
      content: '<p>Just text, no images here</p>',
    };
    expect(extractImage(item)).toBeNull();
  });

  it('should return null for empty item', () => {
    expect(extractImage({})).toBeNull();
  });

  it('should prefer thumbnail over content images', () => {
    const item = {
      thumbnail: 'https://example.com/thumb.jpg',
      content: '<img src="https://example.com/content.jpg" />',
    };
    expect(extractImage(item)).toBe('https://example.com/thumb.jpg');
  });

  it('should prefer thumbnail over enclosure', () => {
    const item = {
      thumbnail: 'https://example.com/thumb.jpg',
      enclosure: {
        link: 'https://example.com/enclosure.jpg',
        type: 'image/jpeg',
      },
    };
    expect(extractImage(item)).toBe('https://example.com/thumb.jpg');
  });

  it('should handle img tags with single quotes', () => {
    const item = {
      content: "<img src='https://example.com/single-quote.jpg' />",
    };
    expect(extractImage(item)).toBe('https://example.com/single-quote.jpg');
  });
});

describe('extractExcerpt', () => {
  it('should use description when available', () => {
    const item = {
      description: 'This is a clean description',
    };
    expect(extractExcerpt(item)).toBe('This is a clean description');
  });

  it('should strip HTML tags from content', () => {
    const item = {
      description: '<p>This is <strong>bold</strong> text</p>',
    };
    expect(extractExcerpt(item)).toBe('This is bold text');
  });

  it('should truncate long content to 200 characters', () => {
    const longText = 'A'.repeat(300);
    const item = {
      description: longText,
    };
    const excerpt = extractExcerpt(item);
    expect(excerpt.length).toBe(203); // 200 + '...'
    expect(excerpt.endsWith('...')).toBe(true);
  });

  it('should not truncate short content', () => {
    const item = {
      description: 'Short text',
    };
    const excerpt = extractExcerpt(item);
    expect(excerpt).toBe('Short text');
    expect(excerpt.endsWith('...')).toBe(false);
  });

  it('should handle missing content gracefully', () => {
    const item = {};
    expect(extractExcerpt(item)).toBe('');
  });

  it('should respect custom maxLength', () => {
    const item = {
      description: 'This is a test with enough characters to exceed the limit',
    };
    const excerpt = extractExcerpt(item, 20);
    expect(excerpt.length).toBe(23); // 20 + '...'
  });

  it('should fall back to content when description is missing', () => {
    const item = {
      content: '<p>Content fallback</p>',
    };
    expect(extractExcerpt(item)).toBe('Content fallback');
  });
});
