import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFeed } from '../store/feedsSlice';
import StoryCard from '../components/StoryCard';
import FeedTabs from '../components/FeedTabs';
import Loader from '../components/Loader';

function HomePage() {
  const dispatch = useDispatch();
  const feeds = useSelector((state) => state.settings.feeds);
  const feedsData = useSelector((state) => state.feeds.data);
  const activeFeedUrl = useSelector((state) => state.feeds.activeFeedUrl);

  useEffect(() => {
    feeds.forEach((feed) => {
      if (!feedsData[feed.url]) {
        dispatch(fetchFeed(feed.url));
      }
    });
  }, [feeds, dispatch]); // eslint-disable-line react-hooks/exhaustive-deps

  const getArticles = useCallback(() => {
    if (activeFeedUrl) {
      return feedsData[activeFeedUrl]?.articles || [];
    }
    const allArticles = [];
    Object.values(feedsData).forEach((feed) => {
      if (feed.articles) {
        allArticles.push(...feed.articles);
      }
    });
    return allArticles.sort(
      (a, b) => new Date(b.pubDate) - new Date(a.pubDate)
    );
  }, [feedsData, activeFeedUrl]);

  const isLoading = () => {
    if (activeFeedUrl) {
      return feedsData[activeFeedUrl]?.loading;
    }
    return feeds.some((feed) => feedsData[feed.url]?.loading);
  };

  const getError = () => {
    if (activeFeedUrl) {
      return feedsData[activeFeedUrl]?.error;
    }
    return null;
  };

  const handleRefresh = (url) => {
    dispatch(fetchFeed(url));
  };

  const articles = getArticles();
  const loading = isLoading();
  const error = getError();

  return (
    <div className="home-page">
      <FeedTabs />

      {loading && articles.length === 0 && (
        <Loader message="Fetching stories..." />
      )}

      {error && (
        <div className="error-message">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p>Failed to load feed: {error}</p>
          <button
            className="btn btn-primary"
            onClick={() => handleRefresh(activeFeedUrl)}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && articles.length === 0 && !error && (
        <div className="empty-state">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M4 11a9 9 0 0 1 9 9" />
            <path d="M4 4a16 16 0 0 1 16 16" />
            <circle cx="5" cy="19" r="1" />
          </svg>
          <h2>No stories yet</h2>
          <p>Add some RSS feeds in Settings to get started.</p>
        </div>
      )}

      <div className="stories-grid">
        {articles.map((article) => (
          <StoryCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
