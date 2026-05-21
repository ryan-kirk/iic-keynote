import type { SlideDefinition } from '../content/deck';

interface AuthorProfileSlideProps {
  slide: SlideDefinition;
}

export function AuthorProfileSlide({ slide }: AuthorProfileSlideProps) {
  const profile = slide.authorProfile;

  if (!profile) {
    return null;
  }

  return (
    <div className="author-layout">
      <div className="author-header-block">
        <h1>{slide.title}</h1>
        {slide.subtitle ? <p className="lede narrow">{slide.subtitle}</p> : null}
      </div>

      <article className="author-profile-card">
        <div className="author-profile-hero">
          <div className="author-photo-shell">
            <img className="author-photo" src={profile.photoSrc} alt={profile.name} />
          </div>
          <div className="author-profile-copy">
            <span className="author-role">{profile.role}</span>
            <h2>{profile.name}</h2>
            <p>{profile.summary}</p>
          </div>
        </div>
        <div className="author-connect-row">
          <div className="author-qr-shell">
            <img className="author-qr" src={profile.qrSrc} alt={profile.qrLabel} />
          </div>
          <div className="author-connect-copy">
            <span className="author-connect-kicker">Connect</span>
            <h3>{profile.qrLabel}</h3>
            <p>{profile.qrCaption}</p>
          </div>
        </div>
      </article>

      <div className="author-highlights">
        {profile.highlights.map((highlight) => (
          <article className={`author-highlight-card author-highlight-${highlight.accent}`} key={highlight.title}>
            <h3>{highlight.title}</h3>
            <p>{highlight.detail}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
