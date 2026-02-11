import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BookmarkButton from '../components/BookmarkButton';
import SocialButtons from '../components/SocialButtons';
import { sanitizeHtml } from '../utils/sanitize';

function StoryPage() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const decodedLink = decodeURIComponent(storyId);

  const feedsData = useSelector((state) => state.feeds.data);
  const bookmarks = useSelector((state) => state.bookmarks.items);

  // Find article in feeds data
  let article = null;
  for (const feed of Object.values(feedsData)) {
    if (feed.articles) {
      article = feed.articles.find((a) => a.link === decodedLink);
      if (article) break;
    }
  }

  // Fall back to bookmarks
  if (!article) {
    article = bookmarks.find((a) => a.link === decodedLink);
  }

  if (!article) {
    return (
      <div className="story-page">
        <div className="story-not-found">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
          <h2>Story not found</h2>
          <p>This story may no longer be available in the current feed.</p>
          <button onClick={() => navigate('/')} className="btn btn-primary">
            Back to Feeds
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = article.pubDate
    ? new Date(article.pubDate).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div className="story-page">
      <div className="story-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      <article className="story-content">
        <div className="story-meta">
          <span className="story-source">{article.feedSource}</span>
          {formattedDate && (
            <time className="story-date">{formattedDate}</time>
          )}
        </div>

        <h1 className="story-title">{article.title}</h1>

        {article.author && article.author !== 'Unknown' && (
          <p className="story-author">By {article.author}</p>
        )}

        <div className="story-actions">
          <BookmarkButton article={article} />
          <SocialButtons url={article.link} title={article.title} />
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            Read Original
          </a>
        </div>

        {article.image && (
          <div className="story-hero-image">
            <img
              src={article.image}
              alt=""
              onError={(e) => {
                e.target.parentElement.style.display = 'none';
              }}
            />
          </div>
        )}

        {article.content ? (
          <div
            className="story-body"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
          />
        ) : article.excerpt ? (
          <div className="story-body">
            <p>{article.excerpt}</p>
            <p style={{ marginTop: '1rem' }}>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Read full article
              </a>
            </p>
          </div>
        ) : null}

        {article.categories && article.categories.length > 0 && (
          <div className="story-tags">
            {article.categories.map((cat, i) => (
              <span key={i} className="story-tag">
                {cat}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}

export default StoryPage;
