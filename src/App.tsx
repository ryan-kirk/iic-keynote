import { useEffect, useState } from 'react';
import { DeckChrome } from './components/DeckChrome';
import { SlideRenderer } from './components/SlideRenderer';
import { presentationMeta, slides } from './content/deck';

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault();
        setCurrentSlide((value) => Math.min(value + 1, slides.length - 1));
      }

      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault();
        setCurrentSlide((value) => Math.max(value - 1, 0));
      }

      if (event.key === 'Home') {
        setCurrentSlide(0);
      }

      if (event.key === 'End') {
        setCurrentSlide(slides.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  return (
    <main className="app-shell">
      <DeckChrome
        kicker={presentationMeta.appKicker}
        title={presentationMeta.title}
        description={presentationMeta.appDescription}
        downloadHref={presentationMeta.powerpointDownloadHref}
        downloadLabel={presentationMeta.powerpointDownloadLabel}
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onPrevious={() => setCurrentSlide((value) => Math.max(value - 1, 0))}
        onNext={() => setCurrentSlide((value) => Math.min(value + 1, slides.length - 1))}
      />

      <div className="presentation-stage">
        <SlideRenderer slide={slides[currentSlide]} index={currentSlide} total={slides.length} />
      </div>
    </main>
  );
}
