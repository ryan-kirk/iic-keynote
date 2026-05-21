interface DeckChromeProps {
  kicker: string;
  title: string;
  description: string;
  downloadHref: string;
  downloadLabel: string;
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function DeckChrome({
  kicker,
  title,
  description,
  downloadHref,
  downloadLabel,
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
}: DeckChromeProps) {
  return (
    <>
      <aside className="deck-sidebar">
        <span className="deck-kicker">{kicker}</span>
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="deck-sidebar-actions">
          <a className="deck-sidebar-link deck-sidebar-link-primary" href={downloadHref} download>
            {downloadLabel}
          </a>
        </div>
        <div className="deck-progress">
          <div
            className="deck-progress-fill"
            style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
          />
        </div>
        <span className="deck-progress-label">
          Slide {currentSlide + 1} of {totalSlides}
        </span>
      </aside>

      <nav className="deck-nav" aria-label="Slide navigation">
        <button type="button" onClick={onPrevious} disabled={currentSlide === 0}>
          Previous
        </button>
        <button type="button" onClick={onNext} disabled={currentSlide === totalSlides - 1}>
          Next
        </button>
      </nav>
    </>
  );
}
