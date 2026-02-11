# RSS Reader

A clean, responsive RSS feed reader built with React, Redux Toolkit, and React Router. Browse multiple RSS feeds, read full story content, bookmark your favorite articles, and share them on social media.

## Features

- **Multiple RSS Feeds** — Browse Backchannel, TechCrunch, The Economist, and any custom feeds
- **Story Headlines with Images** — Cards display the main image extracted from each RSS item
- **Full Story View** — Click a headline to read the complete content in-app
- **Bookmarks** — Save articles with one click; bookmarks persist across sessions via localStorage
- **Social Sharing** — Share stories on Facebook, Twitter, or via email
- **Feed Management** — Add, remove, and reset RSS feed sources in Settings
- **Redux State Management** — Full Redux Toolkit store with slices for feeds, bookmarks, settings, and auth
- **Responsive Design** — Optimized layout for desktop, tablet, and mobile (custom CSS, no libraries)
- **Google OAuth** — Optional Firebase-based Google sign-in (requires configuration)
- **Tests** — Unit and component tests with Vitest and React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & Run

```bash
npm install
npm run dev
```

The app will start at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

### Run Tests

```bash
npm test         # watch mode
npm run test:run # single run
```

## Project Structure

```
src/
├── __tests__/            # Test files
├── components/           # Reusable UI components
│   ├── BookmarkButton.jsx
│   ├── FeedTabs.jsx
│   ├── Header.jsx
│   ├── Loader.jsx
│   ├── SocialButtons.jsx
│   └── StoryCard.jsx
├── hooks/
│   └── useAuth.js        # Firebase auth hook
├── pages/
│   ├── BookmarksPage.jsx
│   ├── HomePage.jsx
│   ├── SettingsPage.jsx
│   └── StoryPage.jsx
├── store/                # Redux Toolkit store
│   ├── authSlice.js
│   ├── bookmarksSlice.js
│   ├── feedsSlice.js
│   ├── index.js
│   └── settingsSlice.js
├── utils/
│   ├── auth.js           # Firebase auth helpers
│   └── feedParser.js     # RSS parsing & image extraction
├── App.jsx
├── index.css             # All styles (responsive, no CSS libs)
└── main.jsx              # Entry point
```

## Google OAuth (Optional)

To enable Google sign-in:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Google sign-in under Authentication > Sign-in method
3. Copy your Firebase config and create a `.env` file:

```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

The app works fully without auth configured — the sign-in option simply won't appear.

## Default RSS Feeds

| Feed | URL |
|------|-----|
| Backchannel | https://medium.com/feed/backchannel |
| TechCrunch | https://techcrunch.com/feed/ |
| The Economist | https://medium.com/feed/the-economist |

You can add, remove, or reset feeds in the Settings page.

## Tech Stack

- **React 18** — UI framework
- **Redux Toolkit** — State management
- **React Router v6** — Client-side routing
- **rss-parser** — RSS XML to JSON conversion
- **Firebase Auth** — Google OAuth (optional)
- **Vite** — Build tool
- **Vitest** + **React Testing Library** — Testing
- **Custom CSS** — No CSS libraries; fully hand-crafted responsive styles
