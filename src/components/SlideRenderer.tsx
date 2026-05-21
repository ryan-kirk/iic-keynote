import { ArrowRight, Sparkles } from 'lucide-react';
import { deckSignals, type SlideDefinition } from '../content/deck';
import { AnalyticsSlide } from './AnalyticsSlide';
import { AuthorProfileSlide } from './AuthorProfileSlide';
import { SlideFrame } from './SlideFrame';

interface SlideRendererProps {
  slide: SlideDefinition;
  index: number;
  total: number;
}

export function SlideRenderer({ slide, index, total }: SlideRendererProps) {
  return <SlideFrame slide={slide} index={index} total={total}>{renderSlide(slide)}</SlideFrame>;
}

function renderSlide(slide: SlideDefinition) {
  switch (slide.layout) {
    case 'hero':
      return (
        <div className="hero-layout">
          <div className="hero-copy">
            <h1>{slide.title}</h1>
            {slide.subtitle ? <p className="lede">{slide.subtitle}</p> : null}
          </div>
          {slide.stats ? (
            <div className="stat-row">
              {slide.stats.map((stat) => (
                <article className="stat-card" key={stat.label}>
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      );
    case 'agenda':
    case 'next-steps':
      return (
        <div className="stack-layout">
          <h1>{slide.title}</h1>
          {slide.subtitle ? <p className="lede narrow">{slide.subtitle}</p> : null}
          <div className="bullet-panel">
            {slide.bullets?.map((bullet) => (
              <div className="bullet-item" key={bullet}>
                <Sparkles size={18} />
                <p>{bullet}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case 'analytics':
      return <AnalyticsSlide slide={slide} />;
    case 'signal-grid':
    case 'service-stack':
      return (
        <div className="stack-layout">
          <h1>{slide.title}</h1>
          {slide.subtitle ? <p className="lede narrow">{slide.subtitle}</p> : null}
          <div className="signal-grid">
            {slide.signals?.map((signal) => {
              const Icon = signal.icon;

              return (
                <article className="signal-card" key={signal.title}>
                  <div className="signal-icon">
                    <Icon size={26} />
                  </div>
                  <h2>{signal.title}</h2>
                  <p>{signal.detail}</p>
                </article>
              );
            })}
          </div>
        </div>
      );
    case 'trend-cards':
      return (
        <div className="stack-layout">
          <h1>{slide.title}</h1>
          <div className="trend-grid">
            {slide.trends?.map((trend) => (
              <article className="trend-card" key={trend.title}>
                <h2>{trend.title}</h2>
                <p>{trend.summary}</p>
                <div className="trend-implication">
                  <span>Implication</span>
                  <strong>{trend.implication}</strong>
                </div>
              </article>
            ))}
          </div>
        </div>
      );
    case 'operating-model':
    case 'process':
      return (
        <div className="stack-layout">
          <h1>{slide.title}</h1>
          {slide.subtitle ? <p className="lede narrow">{slide.subtitle}</p> : null}
          <div className="process-row">
            {slide.steps?.map((step, stepIndex) => (
              <article className="process-card" key={step.title}>
                <span className="step-index">0{stepIndex + 1}</span>
                <h2>{step.title}</h2>
                <p>{step.detail}</p>
                {stepIndex < (slide.steps?.length ?? 0) - 1 ? <ArrowRight className="process-arrow" size={20} /> : null}
              </article>
            ))}
          </div>
        </div>
      );
    case 'two-column':
      return (
        <div className="stack-layout">
          <h1>{slide.title}</h1>
          {slide.subtitle ? <p className="lede narrow">{slide.subtitle}</p> : null}
          <div className="two-column-grid">
            <article className="column-panel">
              <h2>{slide.leftTitle}</h2>
              <ul>
                {slide.leftBullets?.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
            </article>
            <article className="column-panel emphasis">
              <h2>{slide.rightTitle}</h2>
              <ul>
                {slide.rightBullets?.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
            </article>
          </div>
        </div>
      );
    case 'quote':
      return (
        <div className="quote-layout">
          <h1>{slide.title}</h1>
          <blockquote>{slide.quote}</blockquote>
          {slide.quoteAttribution ? <p className="quote-attribution">{slide.quoteAttribution}</p> : null}
          <div className="signal-ribbon">
            {deckSignals.map(({ icon: Icon, label }) => (
              <span key={label}>
                <Icon size={16} />
                {label}
              </span>
            ))}
          </div>
        </div>
      );
    case 'timeline':
      return (
        <div className="stack-layout">
          <h1>{slide.title}</h1>
          <div className="timeline-list">
            {slide.timeline?.map((item) => (
              <article className="timeline-item" key={item.period}>
                <span>{item.period}</span>
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.detail}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      );
    case 'author-profile':
      return <AuthorProfileSlide slide={slide} />;
    case 'closing':
      return (
        <div className="closing-layout">
          <h1>{slide.title}</h1>
          {slide.subtitle ? <p className="lede narrow">{slide.subtitle}</p> : null}
        </div>
      );
    default:
      return null;
  }
}
