import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user, login, logout, configured } = useAuth();

  const isActive = (path) => location.pathname === path;

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo" onClick={closeMenu}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 11a9 9 0 0 1 9 9" />
            <path d="M4 4a16 16 0 0 1 16 16" />
            <circle cx="5" cy="19" r="1" />
          </svg>
          <span>RSS Reader</span>
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${menuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <nav className={`nav ${menuOpen ? 'nav-open' : ''}`}>
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Feeds
          </Link>
          <Link
            to="/bookmarks"
            className={`nav-link ${isActive('/bookmarks') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Bookmarks
          </Link>
          <Link
            to="/settings"
            className={`nav-link ${isActive('/settings') ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Settings
          </Link>

          {configured && (
            <div className="auth-section">
              {user ? (
                <div className="user-info">
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt=""
                      className="user-avatar"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <span className="user-name">{user.displayName}</span>
                  <button onClick={logout} className="btn btn-sm btn-outline">
                    Sign Out
                  </button>
                </div>
              ) : (
                <button onClick={login} className="btn btn-sm btn-primary">
                  Sign In with Google
                </button>
              )}
            </div>
          )}
        </nav>

        {menuOpen && (
          <div
            className="nav-overlay"
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}
      </div>
    </header>
  );
}

export default Header;
