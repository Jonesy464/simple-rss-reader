import { sanitizeHtml, sanitizeUrl } from './sanitize';

const RSS2JSON_API = 'https://api.rss2json.com/v1/api.json';

/**
 * Extract the main image from an article.
 * Priority: thumbnail from API > enclosure image > first <img> in content.
 * All URLs are validated to use http/https.
 */
export const extractImage = (item) => {
  // 1. Thumbnail provided by rss2json
  if (item.thumbnail) return sanitizeUrl(item.thumbnail);

  // 2. Enclosure with image type
  if (
    item.enclosure?.link &&
    item.enclosure?.type?.startsWith('image')
  ) {
    return sanitizeUrl(item.enclosure.link);
  }

  // 3. First <img> in content HTML
  const content = item.content || item.description || '';
  const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch?.[1]) return sanitizeUrl(imgMatch[1]);

  return null;
};

/**
 * Extract a plain-text excerpt from an article.
 */
export const extractExcerpt = (item, maxLength = 200) => {
  const source = item.description || item.content || '';
  const text = String(source).replace(/<[^>]*>/g, '').trim();
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Fetch and parse an RSS feed via rss2json.com, returning normalized articles.
 */
export const parseFeed = async (feedUrl) => {
  const apiUrl = `${RSS2JSON_API}?rss_url=${encodeURIComponent(feedUrl)}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  let response;
  try {
    response = await fetch(apiUrl, { signal: controller.signal });
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') {
      throw new Error('Feed request timed out');
    }
    throw new Error(`Network error: ${err.message}`);
  }
  clearTimeout(timeout);

  if (!response.ok) {
    throw new Error(`Failed to fetch feed (${response.status})`);
  }

  const data = await response.json();

  if (data.status !== 'ok') {
    throw new Error(data.message || 'Failed to parse feed');
  }

  const feedTitle = data.feed?.title || feedUrl;

  return (data.items || []).map((item, index) => ({
    id: `${feedUrl}::${index}::${item.link || item.guid || index}`,
    title: item.title || 'Untitled',
    link: sanitizeUrl(item.link || item.guid || '') || '',
    author: item.author || 'Unknown',
    pubDate: item.pubDate || '',
    content: sanitizeHtml(item.content || item.description || ''),
    excerpt: extractExcerpt(item),
    image: extractImage(item),
    feedSource: feedTitle,
    categories: item.categories || [],
  }));
};
