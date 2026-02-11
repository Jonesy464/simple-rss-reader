function SocialButtons({ url, title }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=Check out this article: ${encodedUrl}`,
  };

  const openShare = (e, link) => {
    e.preventDefault();
    if (link.startsWith('mailto:')) {
      window.location.href = link;
    } else {
      window.open(link, '_blank', 'width=600,height=400');
    }
  };

  return (
    <div className="social-buttons">
      <span className="social-label">Share:</span>

      <button
        className="social-btn facebook"
        onClick={(e) => openShare(e, shareLinks.facebook)}
        aria-label="Share on Facebook"
        title="Share on Facebook"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      </button>

      <button
        className="social-btn twitter"
        onClick={(e) => openShare(e, shareLinks.twitter)}
        aria-label="Share on Twitter"
        title="Share on Twitter"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      </button>

      <button
        className="social-btn email-share"
        onClick={(e) => openShare(e, shareLinks.email)}
        aria-label="Share via Email"
        title="Share via Email"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
      </button>
    </div>
  );
}

export default SocialButtons;
