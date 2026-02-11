import { useSelector, useDispatch } from 'react-redux';
import { toggleBookmark } from '../store/bookmarksSlice';

function BookmarkButton({ article }) {
  const dispatch = useDispatch();
  const isBookmarked = useSelector((state) =>
    state.bookmarks.items.some((item) => item.link === article.link)
  );

  return (
    <button
      className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(toggleBookmark(article));
      }}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      title={isBookmarked ? 'Remove bookmark' : 'Bookmark this story'}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill={isBookmarked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}

export default BookmarkButton;
