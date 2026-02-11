import { Link } from 'react-router-dom';
import BookmarkButton from './BookmarkButton';

function StoryCard({ article }) {
  const storyId = encodeURIComponent(article.link);
  const formattedDate = article.pubDate
    ? new Date(article.pubDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <article className="story-card">
      {article.image && (
        <Link to={`/story/${storyId}`} className="story-card-image-link">
          <div className="story-card-image">
            <img
              src={article.image}
              alt=""
              loading="lazy"
              onError={(e) => {
                e.target.parentElement.style.display = 'none';
              }}
            />
          </div>
        </Link>
      )}
      <div className="story-card-body">
        <div className="story-card-meta">
          <span className="story-card-source">{article.feedSource}</span>
          {formattedDate && (
            <span className="story-card-date">{formattedDate}</span>
          )}
        </div>
        <h3 className="story-card-title">
          <Link to={`/story/${storyId}`}>{article.title}</Link>
        </h3>
        <p className="story-card-excerpt">{article.excerpt}</p>
        <div className="story-card-footer">
          <span className="story-card-author">
            {article.author !== 'Unknown' ? `By ${article.author}` : ''}
          </span>
          <BookmarkButton article={article} />
        </div>
      </div>
    </article>
  );
}

export default StoryCard;
