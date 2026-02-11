import { useSelector, useDispatch } from 'react-redux';
import { setActiveFeed } from '../store/feedsSlice';

function FeedTabs() {
  const dispatch = useDispatch();
  const feeds = useSelector((state) => state.settings.feeds);
  const activeFeedUrl = useSelector((state) => state.feeds.activeFeedUrl);

  return (
    <div className="feed-tabs-wrapper">
      <div className="feed-tabs">
        <button
          className={`feed-tab ${activeFeedUrl === null ? 'active' : ''}`}
          onClick={() => dispatch(setActiveFeed(null))}
        >
          All Feeds
        </button>
        {feeds.map((feed) => (
          <button
            key={feed.url}
            className={`feed-tab ${activeFeedUrl === feed.url ? 'active' : ''}`}
            onClick={() => dispatch(setActiveFeed(feed.url))}
          >
            {feed.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FeedTabs;
