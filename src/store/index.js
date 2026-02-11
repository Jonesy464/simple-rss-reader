import { configureStore } from '@reduxjs/toolkit';
import feedsReducer from './feedsSlice';
import bookmarksReducer from './bookmarksSlice';
import settingsReducer from './settingsSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    feeds: feedsReducer,
    bookmarks: bookmarksReducer,
    settings: settingsReducer,
    auth: authReducer,
  },
});
