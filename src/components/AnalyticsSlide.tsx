import type { SlideDefinition } from '../content/deck';
import {
  formatMetricValue,
  getStoryDataset,
  getSeriesSourceTypes,
  storyVisualConfigs,
  type ChartRecord,
  type ComparisonWindow,
  type StoryAnnotation,
  type StoryPanelConfig,
  type ThresholdRule,
} from '../data/storyCharts';

interface AnalyticsSlideProps {
  slide: SlideDefinition;
}

interface PanelPoint {
  date: string;
  value: number;
  timeGrain: string;
}

interface PanelSeries {
  metricKey: string;
  label: string;
  color: string;
  points: PanelPoint[];
}

export function AnalyticsSlide({ slide }: AnalyticsSlideProps) {
  if (!slide.chartStoryId) {
    return null;
  }

  const dataset = getStoryDataset(slide.chartStoryId);
  const config = storyVisualConfigs[slide.chartStoryId];

  return (
    <div className="analytics-layout">
      <div className="analytics-main">
        <h1>{slide.title}</h1>
        {slide.subtitle ? <p className="lede narrow">{slide.subtitle}</p> : null}

        <div className="analytics-grid">
          {config.panels.map((panel) => (
            <MetricPanel
              storyId={slide.chartStoryId}
              key={panel.id}
              panel={panel}
              records={dataset.records}
              thresholds={dataset.thresholds.filter((threshold) =>
                panel.series.some((series) => series.metricKey === threshold.metricKey),
              )}
              comparisonWindows={dataset.comparisonWindows}
            />
          ))}
        </div>
      </div>

      <aside className="analytics-sidebar">
        <article className="analytics-card">
          <span className="analytics-card-kicker">What the chart says</span>
          <h2>Story readout</h2>
          <ul className="analytics-list">
            {slide.bullets?.map((bullet) => <li key={bullet}>{bullet}</li>)}
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
}: {
  storyId: SlideDefinition['chartStoryId'];
  panel: StoryPanelConfig;
  records: ChartRecord[];
  thresholds: ThresholdRule[];
  comparisonWindows: ComparisonWindow[];
}) {
  const panelSeries = buildPanelSeries(panel, records);
  const points = panelSeries.flatMap((series) => series.points);

  if (points.length === 0) {
    return null;
  }

  const domain = resolveDomain(points, thresholds, panel.minValue, panel.maxValue);
  const uniqueDates = [...new Set(points.map((point) => point.date))].sort();
  const chartHeight = 176;
  const chartWidth = 320;
  const padding = { top: 18, right: 12, bottom: 18, left: 12 };
  const minDate = uniqueDates[0];
  const maxDate = uniqueDates[uniqueDates.length - 1];
  const panelSourceTypes = storyId ? getSeriesSourceTypes(storyId, panel.series.map((series) => series.metricKey)) : [];
  const showZeroAxis = domain.min <= 0 && domain.max >= 0;

  return (
    <article className="chart-card">
      <div className="chart-card-header">
        <div>
          <span className="analytics-card-kicker">{panel.eyebrow}</span>
          <h2>{panel.title}</h2>
          <p className="chart-description">{panel.description}</p>
          <div className="panel-source-row">
            {panelSourceTypes.map((sourceType) => (
              <span className={`source-pill source-${sourceType}`} key={`${panel.id}-${sourceType}`}>
                {formatSourceTypeLabel(sourceType)}
              </span>
            ))}
          </div>
        </div>
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
      </div>

      <svg className="metric-chart" viewBox={`0 0 ${chartWidth} ${chartHeight}`} role="img" aria-label={panel.title}>
        <rect className="chart-shell" x="0" y="0" width={chartWidth} height={chartHeight} rx="20" />

        {comparisonWindows.map((window) => {
          const x = scaleDate(window.startDate, minDate, maxDate, chartWidth, padding.left, padding.right);
          const nextX = scaleDate(window.endDate, minDate, maxDate, chartWidth, padding.left, padding.right);

          return (
            <rect
              className="chart-window"
              key={window.id}
              x={x}
              y={padding.top}
              width={Math.max(nextX - x, 4)}
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

function buildPanelSeries(panel: StoryPanelConfig, records: ChartRecord[]): PanelSeries[] {
  return panel.series.map((series) => {
    const seriesRecords = records
      .filter((record) => record.metricKey === series.metricKey)
      .sort((left, right) => left.date.localeCompare(right.date));

    const baseValue = panel.displayMode === 'baseline-index' ? seriesRecords[0]?.value ?? 1 : 1;

    return {
      metricKey: series.metricKey,
      label: series.label,
      color: series.color,
      points: seriesRecords.map((record) => ({
        date: record.date,
        timeGrain: record.timeGrain,
        value:
          panel.displayMode === 'baseline-index'
            ? Number.parseFloat(((record.value / baseValue) * 100).toFixed(2))
            : record.value,
      })),
    };
  });
}

function resolveDomain(
  points: PanelPoint[],
  thresholds: ThresholdRule[],
  minValue?: number,
  maxValue?: number,
) {
  const pointValues = points.map((point) => point.value);
  const thresholdValues = thresholds.map((threshold) => threshold.value);
  const values = [...pointValues, ...thresholdValues];
  const rawMin = minValue ?? Math.min(...values);
  const rawMax = maxValue ?? Math.max(...values);

  if (rawMin === rawMax) {
    return { min: rawMin - 1, max: rawMax + 1 };
  }

  return { min: rawMin, max: rawMax };
}

function buildPath(
  points: PanelPoint[],
  minValue: number,
  maxValue: number,
  minDate: string,
  maxDate: string,
  chartWidth: number,
  chartHeight: number,
  padding: { top: number; right: number; bottom: number; left: number },
) {
  return points
    .map((point, index) => {
      const x = scaleDate(point.date, minDate, maxDate, chartWidth, padding.left, padding.right);
      const y = scaleValue(point.value, minValue, maxValue, chartHeight, padding.top, padding.bottom);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');
}

function scaleDate(
  value: string,
  minDate: string,
  maxDate: string,
  chartWidth: number,
  leftPadding: number,
  rightPadding: number,
) {
  const min = dateToNumber(minDate);
  const max = dateToNumber(maxDate);

  if (min === max) {
    return chartWidth / 2;
  }

  const ratio = (dateToNumber(value) - min) / (max - min);
  return leftPadding + ratio * (chartWidth - leftPadding - rightPadding);
}

function scaleValue(
  value: number,
  minValue: number,
  maxValue: number,
  chartHeight: number,
  topPadding: number,
  bottomPadding: number,
) {
  const usableHeight = chartHeight - topPadding - bottomPadding;
  const ratio = (value - minValue) / (maxValue - minValue || 1);
  return chartHeight - bottomPadding - ratio * usableHeight;
}

function dateToNumber(value: string) {
  return new Date(`${value}T00:00:00`).getTime();
}

function formatAxisDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

function formatThreshold(threshold: ThresholdRule) {
  return `${threshold.severity}: ${threshold.operator} ${formatMetricValue(threshold.metricKey, threshold.value)}`;
}

function formatPanelValue(metricKey: string, value: number, displayMode?: StoryPanelConfig['displayMode']) {
  if (displayMode === 'baseline-index') {
    return `${value.toFixed(0)} index`;
  }

  return formatMetricValue(metricKey, value);
}

function formatSourceTypeLabel(sourceType: string) {
  if (sourceType === 'illustrative') {
    return 'Synthetic';
  }

  if (sourceType === 'proxy') {
    return 'Proxy';
  }

  if (sourceType === 'real') {
    return 'Real';
  }

  return sourceType;
}