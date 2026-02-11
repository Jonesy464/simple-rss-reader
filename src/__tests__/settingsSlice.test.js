import { describe, it, expect, beforeEach, vi } from 'vitest';
import settingsReducer, {
  addFeed,
  removeFeed,
  resetFeeds,
  DEFAULT_FEEDS,
} from '../store/settingsSlice';

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

describe('settingsSlice', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should have default feeds in initial state', () => {
    const state = settingsReducer(undefined, { type: 'unknown' });
    expect(state.feeds).toBeDefined();
    expect(state.feeds.length).toBeGreaterThan(0);
  });

  it('should add a new feed', () => {
    const initialState = { feeds: [] };
    const newFeed = { name: 'New Feed', url: 'https://example.com/feed' };
    const state = settingsReducer(initialState, addFeed(newFeed));
    expect(state.feeds).toHaveLength(1);
    expect(state.feeds[0]).toEqual(newFeed);
  });

  it('should not add duplicate feed URLs', () => {
    const existingFeed = { name: 'Existing', url: 'https://example.com/feed' };
    const initialState = { feeds: [existingFeed] };
    const state = settingsReducer(
      initialState,
      addFeed({ name: 'Duplicate', url: 'https://example.com/feed' })
    );
    expect(state.feeds).toHaveLength(1);
    expect(state.feeds[0].name).toBe('Existing');
  });

  it('should remove a feed by URL', () => {
    const feed = { name: 'Feed', url: 'https://example.com/feed' };
    const initialState = { feeds: [feed] };
    const state = settingsReducer(initialState, removeFeed(feed.url));
    expect(state.feeds).toHaveLength(0);
  });

  it('should only remove the targeted feed', () => {
    const feed1 = { name: 'Feed 1', url: 'https://example.com/feed1' };
    const feed2 = { name: 'Feed 2', url: 'https://example.com/feed2' };
    const initialState = { feeds: [feed1, feed2] };
    const state = settingsReducer(initialState, removeFeed(feed1.url));
    expect(state.feeds).toHaveLength(1);
    expect(state.feeds[0].url).toBe(feed2.url);
  });

  it('should reset to default feeds', () => {
    const initialState = { feeds: [] };
    const state = settingsReducer(initialState, resetFeeds());
    expect(state.feeds).toEqual(DEFAULT_FEEDS);
  });

  it('should persist settings to localStorage when adding', () => {
    const initialState = { feeds: [] };
    settingsReducer(
      initialState,
      addFeed({ name: 'Test', url: 'https://test.com/feed' })
    );
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'rss-reader-settings',
      expect.any(String)
    );
  });
});
