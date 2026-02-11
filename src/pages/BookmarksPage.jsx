import { useSelector } from 'react-redux';
import StoryCard from '../components/StoryCard';
import { Link } from 'react-router-dom';

function BookmarksPage() {
  const bookmarks = useSelector((state) => state.bookmarks.items);

  return (
    <div className="bookmarks-page">
      <div className="page-header">
        <h1>Bookmarks</h1>
        <p className="page-subtitle">
          {bookmarks.length} saved{' '}
          {bookmarks.length === 1 ? 'story' : 'stories'}
        </p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="empty-state">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <h2>No bookmarks yet</h2>
          <p>Stories you bookmark will appear here for easy access.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Browse Feeds
          </Link>
        </div>
      ) : (
        <div className="stories-grid">
          {bookmarks.map((article) => (
            <StoryCard key={article.link} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

export default BookmarksPage;
