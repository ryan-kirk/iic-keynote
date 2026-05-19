import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideNavigationProps {
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
}

export function SlideNavigation({ currentSlide, totalSlides, onNext, onPrev }: SlideNavigationProps) {
  return (
    <div className="fixed bottom-8 left-0 right-0 flex items-center justify-center gap-8 z-50">
      <button
        onClick={onPrev}
        disabled={currentSlide === 0}
        className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>

      <div className="flex gap-2">
        {Array.from({ length: totalSlides }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === currentSlide
                ? 'w-8 bg-white'
                : 'w-2 bg-white/30'
            }`}
          />
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={currentSlide === totalSlides - 1}
        className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}
