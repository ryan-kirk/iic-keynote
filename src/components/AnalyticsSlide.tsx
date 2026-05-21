import { getSlideWhatMattersBullets, type SlideDefinition } from '../content/deck';
import {
  getStoryDataset,
  getSeriesSourceTypes,
  storyVisualConfigs,
  type ChartRecord,
  type ComparisonWindow,
  type StoryAnnotation,
  type StoryPanelConfig,
  type ThresholdRule,
} from '../data/storyCharts';
import {
  buildPanelSeries,
  buildPath,
  formatAxisDate,
  formatPanelValue,
  formatSourceTypeLabel,
  formatThreshold,
  getPanelThresholds,
  resolveChartDateDomain,
  resolveDomain,
  resolveWindowBounds,
  scaleDate,
  scaleValue,
} from '../data/storyChartPresentation';
import { formatMetricValue } from '../data/storyChartShared';

interface AnalyticsSlideProps {
  slide: SlideDefinition;
}

export function AnalyticsSlide({ slide }: AnalyticsSlideProps) {
  if (!slide.chartStoryId) {
    return null;
  }

  const dataset = getStoryDataset(slide.chartStoryId);
  const config = storyVisualConfigs[slide.chartStoryId];
  const panels = slide.chartPanelIds?.length
    ? config.panels.filter((panel) => slide.chartPanelIds?.includes(panel.id))
    : config.panels;
  const compactMode = slide.analyticsMode === 'compact';
  const storyBullets = getSlideWhatMattersBullets(slide);

  if (compactMode) {
    return (
      <div className="analytics-layout analytics-layout-story">
        <div className="analytics-header-block analytics-header-block-story">
          <h1>{slide.title}</h1>
          {slide.subtitle ? <p className="lede narrow">{slide.subtitle}</p> : null}
        </div>

        <div className="analytics-main analytics-main-story">
          <div className="analytics-story-stack">
            {panels.map((panel) => (
              <MetricPanel
                storyId={slide.chartStoryId}
                key={panel.id}
                panel={panel}
                records={dataset.records}
                thresholds={getPanelThresholds(panel, dataset.thresholds)}
                comparisonWindows={dataset.comparisonWindows}
                compact
              />
            ))}
          </div>
        </div>

        <aside className="analytics-sidebar analytics-sidebar-story">
          <article className="analytics-card analytics-story-card">
            <span className="analytics-card-kicker">What matters</span>
            <h2>Story readout</h2>
            <ul className="analytics-list analytics-story-list">
              {storyBullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
            </ul>
            <p className="analytics-story-footer">{config.sourceLabel}</p>
          </article>
        </aside>
      </div>
    );
  }

  return (
    <div className="analytics-layout">
      <div className="analytics-header-block">
        <h1>{slide.title}</h1>
        {slide.subtitle ? <p className="lede narrow">{slide.subtitle}</p> : null}
      </div>

      <div className="analytics-main">
        <div className="analytics-grid">
          {panels.map((panel) => (
            <MetricPanel
              storyId={slide.chartStoryId}
              key={panel.id}
              panel={panel}
              records={dataset.records}
              thresholds={getPanelThresholds(panel, dataset.thresholds)}
              comparisonWindows={dataset.comparisonWindows}
              compact={compactMode}
            />
          ))}
        </div>
      </div>

      <aside className="analytics-sidebar">
        <article className="analytics-card">
          <span className="analytics-card-kicker">What the chart says</span>
          <h2>Story readout</h2>
          <ul className="analytics-list">
            {storyBullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
          </ul>
        </article>

        <article className="analytics-card">
          <span className="analytics-card-kicker">Thresholds</span>
          <h2>What moves this from noise to action</h2>
          <div className="threshold-stack">
            {dataset.thresholds.map((threshold) => (
              <div className={`threshold-row severity-${threshold.severity}`} key={threshold.id}>
                <strong>{formatThreshold(threshold)}</strong>
                <p>{threshold.meaning}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="analytics-card">
          <span className="analytics-card-kicker">Annotations</span>
          <h2>Context kept visible</h2>
          <div className="annotation-stack">
            {dataset.annotations.slice(0, 4).map((annotation) => (
              <AnnotationRow annotation={annotation} key={`${annotation.date}-${annotation.label}`} />
            ))}
          </div>
        </article>

        <article className="analytics-card">
          <span className="analytics-card-kicker">Data mix</span>
          <h2>{config.sourceLabel}</h2>
          <div className="source-pill-row">
            {dataset.sourceTypes.map((sourceType) => (
              <span className={`source-pill source-${sourceType}`} key={sourceType}>
                {formatSourceTypeLabel(sourceType)}
              </span>
            ))}
          </div>
        </article>
      </aside>
    </div>
  );
}

function MetricPanel({
  storyId,
  panel,
  records,
  thresholds,
  comparisonWindows,
  compact,
}: {
  storyId: SlideDefinition['chartStoryId'];
  panel: StoryPanelConfig;
  records: ChartRecord[];
  thresholds: ThresholdRule[];
  comparisonWindows: ComparisonWindow[];
  compact?: boolean;
}) {
  const panelSeries = buildPanelSeries(panel, records);
  const points = panelSeries.flatMap((series) => series.points);

  if (points.length === 0) {
    return null;
  }

  const domain = resolveDomain(points, thresholds, panel.minValue, panel.maxValue);
  const chartHeight = compact ? 240 : 176;
  const chartWidth = compact ? 420 : 320;
  const padding = compact ? { top: 20, right: 14, bottom: 22, left: 14 } : { top: 18, right: 12, bottom: 18, left: 12 };
  const { minDate, maxDate } = resolveChartDateDomain(points, records, comparisonWindows);
  const panelSourceTypes = storyId ? getSeriesSourceTypes(storyId, panel.series.map((series) => series.metricKey)) : [];
  const showZeroAxis = domain.min <= 0 && domain.max >= 0;

  return (
    <article className={`chart-card${compact ? ' chart-card-compact' : ''}`}>
      <div className={`chart-card-header${compact ? ' chart-card-header-compact' : ''}`}>
        <div>
          <span className="analytics-card-kicker">{panel.eyebrow}</span>
          <h2>{panel.title}</h2>
          {!compact ? <p className="chart-description">{panel.description}</p> : null}
          {!compact ? (
            <div className="panel-source-row">
              {panelSourceTypes.map((sourceType) => (
                <span className={`source-pill source-${sourceType}`} key={`${panel.id}-${sourceType}`}>
                  {formatSourceTypeLabel(sourceType)}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        {compact ? (
          <div className="chart-legend-row chart-legend-row-compact">
            {panelSeries.map((series) => (
              <div className="chart-legend-chip-label" key={series.metricKey}>
                <span className="legend-chip" style={{ backgroundColor: series.color }} />
                <strong>{series.label}</strong>
              </div>
            ))}
          </div>
        ) : (
          <div className="chart-legend-column">
            {panelSeries.map((series) => {
              const latestPoint = series.points[series.points.length - 1];

              return (
                <div className="chart-legend-item" key={series.metricKey}>
                  <span className="legend-chip" style={{ backgroundColor: series.color }} />
                  <div>
                    <strong>{series.label}</strong>
                    <span>{formatPanelValue(series.metricKey, latestPoint.value, panel.displayMode)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <svg className="metric-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label={panel.title}>
        <rect className="chart-shell" x="0" y="0" width={chartWidth} height={chartHeight} rx="20" />

        {comparisonWindows.map((window) => {
          const windowRect = resolveWindowBounds(
            window.startDate,
            window.endDate,
            minDate,
            maxDate,
            chartWidth,
            padding.left,
            padding.right,
          );

          return (
            <rect
              className="chart-window"
              key={window.id}
              x={windowRect.x}
              y={padding.top}
              width={windowRect.width}
              height={chartHeight - padding.top - padding.bottom}
            />
          );
        })}

        {[0.25, 0.5, 0.75].map((fraction) => {
          const y = padding.top + (chartHeight - padding.top - padding.bottom) * fraction;

          return <line className="chart-grid-line" key={fraction} x1={padding.left} x2={chartWidth - padding.right} y1={y} y2={y} />;
        })}

        {showZeroAxis ? (
          <line
            className="zero-axis-line"
            x1={padding.left}
            x2={chartWidth - padding.right}
            y1={scaleValue(0, domain.min, domain.max, chartHeight, padding.top, padding.bottom)}
            y2={scaleValue(0, domain.min, domain.max, chartHeight, padding.top, padding.bottom)}
          />
        ) : null}

        {thresholds.map((threshold) => {
          const y = scaleValue(threshold.value, domain.min, domain.max, chartHeight, padding.top, padding.bottom);

          return (
            <g key={threshold.id}>
              <line className={`threshold-line severity-${threshold.severity}`} x1={padding.left} x2={chartWidth - padding.right} y1={y} y2={y} />
              <text className="threshold-label" x={chartWidth - padding.right - 2} y={y - 6} textAnchor="end">
                {formatMetricValue(threshold.metricKey, threshold.value)}
              </text>
            </g>
          );
        })}

        {panelSeries.map((series) => {
          const drawLine = series.points.length > 2 && !series.points.every((point) => point.timeGrain === 'event');

          return (
            <g key={series.metricKey}>
              {drawLine ? (
                <path
                  d={buildPath(series.points, domain.min, domain.max, minDate, maxDate, chartWidth, chartHeight, padding)}
                  fill="none"
                  stroke={series.color}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                />
              ) : null}

              {series.points.map((point) => {
                const x = scaleDate(point.date, minDate, maxDate, chartWidth, padding.left, padding.right);
                const y = scaleValue(point.value, domain.min, domain.max, chartHeight, padding.top, padding.bottom);

                return <circle cx={x} cy={y} fill={series.color} key={`${series.metricKey}-${point.date}`} r="4.5" />;
              })}
            </g>
          );
        })}
      </svg>

      <div className="chart-axis-labels">
        <span>{formatAxisDate(minDate)}</span>
        <span>{formatAxisDate(maxDate)}</span>
      </div>
    </article>
  );
}

function AnnotationRow({ annotation }: { annotation: StoryAnnotation }) {
  return (
    <div className="annotation-row">
      <strong>{formatAxisDate(annotation.date)}</strong>
      <div>
        <span>{annotation.label}</span>
        <p>{annotation.description}</p>
      </div>
    </div>
  );
}
