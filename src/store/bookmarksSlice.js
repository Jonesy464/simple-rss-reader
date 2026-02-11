import { createSlice } from '@reduxjs/toolkit';

const STORAGE_KEY = 'rss-reader-bookmarks';

const loadBookmarks = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveBookmarks = (bookmarks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch {
    // Storage full or unavailable
  }
};

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState: {
    items: loadBookmarks(),
  },
  reducers: {
    toggleBookmark: (state, action) => {
      const article = action.payload;
      const index = state.items.findIndex((item) => item.link === article.link);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push({
          id: article.id,
          title: article.title,
          link: article.link,
          author: article.author,
          pubDate: article.pubDate,
          // Store only the excerpt for localStorage size/safety; full content
          // is retrieved from the feed when viewing. The excerpt is plain text.
          excerpt: article.excerpt,
          image: article.image,
          feedSource: article.feedSource,
          categories: article.categories,
        });
      }
      saveBookmarks(state.items);
    },
    removeBookmark: (state, action) => {
      const link = action.payload;
      state.items = state.items.filter((item) => item.link !== link);
      saveBookmarks(state.items);
    },
  },
});

export const { toggleBookmark, removeBookmark } = bookmarksSlice.actions;

export const selectIsBookmarked = (state, link) =>
  state.bookmarks.items.some((item) => item.link === link);

export default bookmarksSlice.reducer;
