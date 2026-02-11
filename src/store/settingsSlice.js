import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'rss-reader-settings';

const DEFAULT_FEEDS = [
  { name: 'Backchannel', url: 'https://medium.com/feed/backchannel' },
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
  { name: 'The Economist', url: 'https://medium.com/feed/the-economist' },
];

const loadSettings = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return { feeds: parsed.feeds || DEFAULT_FEEDS };
    }
    return { feeds: DEFAULT_FEEDS };
  } catch {
    return { feeds: DEFAULT_FEEDS };
  }
};

const saveSettings = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ feeds: state.feeds }));
  } catch {
    // Storage full or unavailable
  }
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState: loadSettings(),
  reducers: {
    addFeed: (state, action) => {
      const { name, url } = action.payload;
      if (!state.feeds.find((f) => f.url === url)) {
        state.feeds.push({ name, url });
        saveSettings(state);
      }
    },
    removeFeed: (state, action) => {
      state.feeds = state.feeds.filter((f) => f.url !== action.payload);
      saveSettings(state);
    },
    reorderFeeds: (state, action) => {
      state.feeds = action.payload;
      saveSettings(state);
    },
    resetFeeds: (state) => {
      state.feeds = DEFAULT_FEEDS;
      saveSettings(state);
    },
  },
});

export const { addFeed, removeFeed, reorderFeeds, resetFeeds } =
  settingsSlice.actions;
export { DEFAULT_FEEDS };
export default settingsSlice.reducer;
