import { describe, it, expect, beforeEach, vi } from 'vitest';
import bookmarksReducer, {
  toggleBookmark,
  removeBookmark,
} from '../store/bookmarksSlice';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

const sampleArticle = {
  id: 'test-1',
  title: 'Test Article',
  link: 'https://example.com/article-1',
  author: 'Test Author',
  pubDate: '2024-01-01T00:00:00Z',
  content: '<p>Test content</p>',
  excerpt: 'Test excerpt...',
  image: 'https://example.com/image.jpg',
  feedSource: 'Test Feed',
  categories: ['tech'],
};

describe('bookmarksSlice', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should return the initial state', () => {
    const state = bookmarksReducer(undefined, { type: 'unknown' });
    expect(state).toHaveProperty('items');
    expect(Array.isArray(state.items)).toBe(true);
  });

  it('should add a bookmark via toggleBookmark', () => {
    const state = bookmarksReducer({ items: [] }, toggleBookmark(sampleArticle));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].link).toBe(sampleArticle.link);
    expect(state.items[0].title).toBe(sampleArticle.title);
  });

  it('should remove a bookmark when toggled again', () => {
    const initialState = { items: [sampleArticle] };
    const state = bookmarksReducer(initialState, toggleBookmark(sampleArticle));
    expect(state.items).toHaveLength(0);
  });

  it('should remove a bookmark by link', () => {
    const initialState = { items: [sampleArticle] };
    const state = bookmarksReducer(
      initialState,
      removeBookmark(sampleArticle.link)
    );
    expect(state.items).toHaveLength(0);
  });

  it('should handle multiple bookmarks', () => {
    const article2 = {
      ...sampleArticle,
      link: 'https://example.com/article-2',
      id: 'test-2',
    };
    let state = bookmarksReducer({ items: [] }, toggleBookmark(sampleArticle));
    state = bookmarksReducer(state, toggleBookmark(article2));
    expect(state.items).toHaveLength(2);
  });

  it('should only remove the targeted bookmark', () => {
    const article2 = {
      ...sampleArticle,
      link: 'https://example.com/article-2',
      id: 'test-2',
      title: 'Second Article',
    };
    const initialState = { items: [sampleArticle, article2] };
    const state = bookmarksReducer(
      initialState,
      toggleBookmark(sampleArticle)
    );
    expect(state.items).toHaveLength(1);
    expect(state.items[0].link).toBe(article2.link);
  });

  it('should persist bookmarks to localStorage', () => {
    bookmarksReducer({ items: [] }, toggleBookmark(sampleArticle));
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'rss-reader-bookmarks',
      expect.any(String)
    );
  });
});
