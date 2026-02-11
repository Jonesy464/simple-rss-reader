import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addFeed, removeFeed, resetFeeds } from '../store/settingsSlice';
import { clearFeeds } from '../store/feedsSlice';
import { useAuth } from '../hooks/useAuth';

function SettingsPage() {
  const dispatch = useDispatch();
  const feeds = useSelector((state) => state.settings.feeds);
  const { user, login, logout, configured } = useAuth();
  const [newFeedName, setNewFeedName] = useState('');
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddFeed = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newFeedName.trim() || !newFeedUrl.trim()) {
      setError('Please provide both a name and URL.');
      return;
    }

    try {
      new URL(newFeedUrl);
    } catch {
      setError('Please enter a valid URL.');
      return;
    }

    if (feeds.find((f) => f.url === newFeedUrl)) {
      setError('This feed URL already exists.');
      return;
    }

    dispatch(addFeed({ name: newFeedName.trim(), url: newFeedUrl.trim() }));
    setNewFeedName('');
    setNewFeedUrl('');
    setSuccess(`"${newFeedName.trim()}" has been added!`);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleRemoveFeed = (url) => {
    dispatch(removeFeed(url));
    dispatch(clearFeeds());
  };

  const handleReset = () => {
    if (window.confirm('Reset to default feeds? This will remove any custom feeds you have added.')) {
      dispatch(resetFeeds());
      dispatch(clearFeeds());
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      {/* Authentication Section */}
      <section className="settings-section">
        <h2>Account</h2>
        {configured ? (
          user ? (
            <div className="account-info">
              <div className="account-details">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    alt=""
                    className="account-avatar"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div>
                  <p className="account-name">{user.displayName}</p>
                  <p className="account-email">{user.email}</p>
                </div>
              </div>
              <button onClick={logout} className="btn btn-outline">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="account-login">
              <p>Sign in with your Google account to personalize your experience.</p>
              <button onClick={login} className="btn btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </button>
            </div>
          )
        ) : (
          <div className="account-unconfigured">
            <p>
              To enable Google authentication, create a Firebase project and add
              your configuration to a <code>.env</code> file in the project
              root. See <code>.env.example</code> for the required variables.
            </p>
          </div>
        )}
      </section>

      {/* Feed Management */}
      <section className="settings-section">
        <div className="section-header">
          <h2>RSS Feeds</h2>
          <button onClick={handleReset} className="btn btn-sm btn-outline">
            Reset to Defaults
          </button>
        </div>

        <div className="feeds-list">
          {feeds.length === 0 && (
            <p className="feeds-empty">
              No feeds configured. Add one below or reset to defaults.
            </p>
          )}
          {feeds.map((feed) => (
            <div key={feed.url} className="feed-item">
              <div className="feed-item-info">
                <span className="feed-item-name">{feed.name}</span>
                <span className="feed-item-url">{feed.url}</span>
              </div>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleRemoveFeed(feed.url)}
                aria-label={`Remove ${feed.name}`}
                title={`Remove ${feed.name}`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <form className="add-feed-form" onSubmit={handleAddFeed}>
          <h3>Add New Feed</h3>
          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">{success}</p>}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="feed-name">Feed Name</label>
              <input
                id="feed-name"
                type="text"
                placeholder="e.g., Hacker News"
                value={newFeedName}
                onChange={(e) => setNewFeedName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="feed-url">Feed URL</label>
              <input
                id="feed-url"
                type="url"
                placeholder="https://example.com/rss"
                value={newFeedUrl}
                onChange={(e) => setNewFeedUrl(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Add Feed
          </button>
        </form>
      </section>

      {/* About */}
      <section className="settings-section">
        <h2>About</h2>
        <p className="about-text">
          RSS Reader is a simple, clean feed reader built with React and Redux.
          Your bookmarks and feed preferences are stored locally in your browser.
        </p>
      </section>
    </div>
  );
}

export default SettingsPage;
