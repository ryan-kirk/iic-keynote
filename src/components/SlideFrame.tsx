import type { PropsWithChildren } from 'react';
import type { SlideDefinition } from '../content/deck';

const toneClassMap: Record<SlideDefinition['tone'], string> = {
  hero: 'tone-hero',
  light: 'tone-light',
  dark: 'tone-dark',
  accent: 'tone-accent',
  warning: 'tone-warning',
};

interface SlideFrameProps extends PropsWithChildren {
  slide: SlideDefinition;
  index: number;
  total: number;
}

export function SlideFrame({ slide, index, total, children }: SlideFrameProps) {
  return (
    <section className={`slide-frame ${toneClassMap[slide.tone]}`}>
      <div className="slide-backdrop" />
      <div className="slide-shell">
        <header className="slide-header">
          <span className="slide-eyebrow">{slide.eyebrow}</span>
          <span className="slide-count">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </header>
        <div className="slide-body">{children}</div>
      </div>
    </section>
  );
}