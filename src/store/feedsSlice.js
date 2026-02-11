import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { parseFeed } from '../utils/feedParser';

export const fetchFeed = createAsyncThunk(
  'feeds/fetchFeed',
  async (feedUrl, { rejectWithValue }) => {
    try {
      const articles = await parseFeed(feedUrl);
      return { url: feedUrl, articles };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const feedsSlice = createSlice({
  name: 'feeds',
  initialState: {
    data: {},
    activeFeedUrl: null,
  },
  reducers: {
    setActiveFeed: (state, action) => {
      state.activeFeedUrl = action.payload;
    },
    clearFeeds: (state) => {
      state.data = {};
      state.activeFeedUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state, action) => {
        const url = action.meta.arg;
        state.data[url] = {
          ...(state.data[url] || {}),
          loading: true,
          error: null,
        };
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        const { url, articles } = action.payload;
        state.data[url] = { articles, loading: false, error: null };
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        const url = action.meta.arg;
        state.data[url] = {
          articles: state.data[url]?.articles || [],
          loading: false,
          error: action.payload || 'Failed to fetch feed',
        };
      });
  },
});

export const { setActiveFeed, clearFeeds } = feedsSlice.actions;
export default feedsSlice.reducer;
