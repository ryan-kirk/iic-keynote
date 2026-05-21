import type { ChartRecord, StoryPanelConfig, ThresholdRule } from './storyChartShared.ts';
import { formatMetricValue } from './storyChartShared.ts';

export interface PanelPoint {
  date: string;
  value: number;
  timeGrain: string;
}

export interface PanelSeries {
  metricKey: string;
  label: string;
  color: string;
  points: PanelPoint[];
}

export function getPanelThresholds(panel: StoryPanelConfig, thresholds: ThresholdRule[]) {
  return thresholds.filter((threshold) => panel.series.some((series) => series.metricKey === threshold.metricKey));
}

export function buildPanelSeries(panel: StoryPanelConfig, records: ChartRecord[]): PanelSeries[] {
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

export function resolveDomain(
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

export function buildPath(
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

export function scaleDate(
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

export function scaleValue(
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

export function dateToNumber(value: string) {
  return new Date(`${value}T00:00:00`).getTime();
}

export function formatAxisDate(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
    new Date(`${value}T00:00:00`),
  );
}

export function formatThreshold(threshold: ThresholdRule) {
  return `${threshold.severity}: ${threshold.operator} ${formatMetricValue(threshold.metricKey, threshold.value)}`;
}

export function formatPanelValue(metricKey: string, value: number, displayMode?: StoryPanelConfig['displayMode']) {
  if (displayMode === 'baseline-index') {
    return `${value.toFixed(0)} index`;
  }

  return formatMetricValue(metricKey, value);
}

export function formatSourceTypeLabel(sourceType: string) {
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
