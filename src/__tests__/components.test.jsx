import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import bookmarksReducer from '../store/bookmarksSlice';
import settingsReducer from '../store/settingsSlice';
import feedsReducer from '../store/feedsSlice';
import authReducer from '../store/authSlice';
import BookmarkButton from '../components/BookmarkButton';
import StoryCard from '../components/StoryCard';
import Loader from '../components/Loader';
import SocialButtons from '../components/SocialButtons';

const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      feeds: feedsReducer,
      bookmarks: bookmarksReducer,
      settings: settingsReducer,
      auth: authReducer,
    },
    preloadedState,
  });
};

const defaultPreloadedState = {
  bookmarks: { items: [] },
  feeds: { data: {}, activeFeedUrl: null },
  settings: { feeds: [] },
  auth: { user: null, loading: false },
};

const renderWithProviders = (
  ui,
  { preloadedState = defaultPreloadedState, store, ...options } = {}
) => {
  const testStore = store || createTestStore(preloadedState);
  return {
    store: testStore,
    ...render(
      <Provider store={testStore}>
        <BrowserRouter>{ui}</BrowserRouter>
      </Provider>,
      options
    ),
  };
};

const sampleArticle = {
  id: 'test-1',
  title: 'Test Article Title',
  link: 'https://example.com/article-1',
  author: 'John Doe',
  pubDate: '2024-01-15T12:00:00Z',
  content: '<p>Full article content here</p>',
  excerpt: 'This is the excerpt of the article...',
  image: 'https://example.com/image.jpg',
  feedSource: 'Test Feed',
  categories: ['technology'],
};

/* ============================================
   BookmarkButton
   ============================================ */
describe('BookmarkButton', () => {
  it('should render with unbookmarked state by default', () => {
    renderWithProviders(<BookmarkButton article={sampleArticle} />);
    const button = screen.getByRole('button', { name: /add bookmark/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toHaveClass('bookmarked');
  });

  it('should render with bookmarked state when article is bookmarked', () => {
    renderWithProviders(<BookmarkButton article={sampleArticle} />, {
      preloadedState: {
        ...defaultPreloadedState,
        bookmarks: { items: [sampleArticle] },
      },
    });
    const button = screen.getByRole('button', { name: /remove bookmark/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bookmarked');
  });

  it('should toggle bookmark state on click', () => {
    const { store } = renderWithProviders(
      <BookmarkButton article={sampleArticle} />
    );

    const button = screen.getByRole('button', { name: /add bookmark/i });
    fireEvent.click(button);

    expect(store.getState().bookmarks.items).toHaveLength(1);
    expect(store.getState().bookmarks.items[0].link).toBe(sampleArticle.link);
  });

  it('should remove bookmark when clicking a bookmarked article', () => {
    const { store } = renderWithProviders(
      <BookmarkButton article={sampleArticle} />,
      {
        preloadedState: {
          ...defaultPreloadedState,
          bookmarks: { items: [sampleArticle] },
        },
      }
    );

    const button = screen.getByRole('button', { name: /remove bookmark/i });
    fireEvent.click(button);

    expect(store.getState().bookmarks.items).toHaveLength(0);
  });
});

/* ============================================
   StoryCard
   ============================================ */
describe('StoryCard', () => {
  it('should render article title', () => {
    renderWithProviders(<StoryCard article={sampleArticle} />);
    expect(screen.getByText('Test Article Title')).toBeInTheDocument();
  });

  it('should render article excerpt', () => {
    renderWithProviders(<StoryCard article={sampleArticle} />);
    expect(
      screen.getByText('This is the excerpt of the article...')
    ).toBeInTheDocument();
  });

  it('should render feed source', () => {
    renderWithProviders(<StoryCard article={sampleArticle} />);
    expect(screen.getByText('Test Feed')).toBeInTheDocument();
  });

  it('should render author name', () => {
    renderWithProviders(<StoryCard article={sampleArticle} />);
    expect(screen.getByText('By John Doe')).toBeInTheDocument();
  });

  it('should not render author when unknown', () => {
    const articleWithoutAuthor = { ...sampleArticle, author: 'Unknown' };
    renderWithProviders(<StoryCard article={articleWithoutAuthor} />);
    expect(screen.queryByText(/By Unknown/)).not.toBeInTheDocument();
  });

  it('should render formatted date', () => {
    renderWithProviders(<StoryCard article={sampleArticle} />);
    expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument();
  });

  it('should contain a link to story detail page', () => {
    renderWithProviders(<StoryCard article={sampleArticle} />);
    const links = screen.getAllByRole('link');
    const storyLink = links.find((l) =>
      l.getAttribute('href')?.includes('/story/')
    );
    expect(storyLink).toBeInTheDocument();
  });

  it('should include a bookmark button', () => {
    renderWithProviders(<StoryCard article={sampleArticle} />);
    expect(
      screen.getByRole('button', { name: /add bookmark/i })
    ).toBeInTheDocument();
  });
});

/* ============================================
   Loader
   ============================================ */
describe('Loader', () => {
  it('should render with custom message', () => {
    render(<Loader message="Loading feeds..." />);
    expect(screen.getByText('Loading feeds...')).toBeInTheDocument();
  });

  it('should render with default message', () => {
    render(<Loader />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should contain a spinner element', () => {
    const { container } = render(<Loader />);
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });
});

/* ============================================
   SocialButtons
   ============================================ */
describe('SocialButtons', () => {
  it('should render all three share buttons', () => {
    render(
      <SocialButtons
        url="https://example.com/article"
        title="Test Article"
      />
    );

    expect(
      screen.getByRole('button', { name: /facebook/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /twitter/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /email/i })
    ).toBeInTheDocument();
  });

  it('should render share label', () => {
    render(
      <SocialButtons
        url="https://example.com/article"
        title="Test Article"
      />
    );
    expect(screen.getByText('Share:')).toBeInTheDocument();
  });
});
