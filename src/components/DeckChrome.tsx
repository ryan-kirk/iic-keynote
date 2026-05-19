interface DeckChromeProps {
  title: string;
  subtitle: string;
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function DeckChrome({
  title,
  subtitle,
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
}: DeckChromeProps) {
  return (
    <>
      <aside className="deck-sidebar">
        <span className="deck-kicker">Local deck demo</span>
        <h2>{title}</h2>
        <p>{subtitle}</p>
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