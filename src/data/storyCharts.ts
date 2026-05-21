import marginPressureCsv from '../../data/chart-ready/v1/margin_pressure_chart_ready.csv?raw';
import precisionAgronomyCsv from '../../data/chart-ready/v1/precision_agronomy_chart_ready.csv?raw';
import grainLogisticsCsv from '../../data/chart-ready/v1/grain_logistics_chart_ready.csv?raw';
import thresholdAnnotations from '../../data/chart-ready/v1/threshold_annotations.json';
import type { StoryId } from '../content/deck';
import {
  buildStoryDatasets,
  formatMetricValue,
  parseChartCsv,
  storyVisualConfigs,
  type ChartRecord,
  type ComparisonWindow,
  type StoryAnnotation,
  type StoryDataset,
  type StoryPanelConfig,
  type StoryPanelSeries,
  type StoryVisualConfig,
  type ThresholdAnnotationManifest,
  type ThresholdRule,
} from './storyChartShared.ts';

export { formatMetricValue, storyVisualConfigs };
export type {
  ChartRecord,
  ComparisonWindow,
  StoryAnnotation,
  StoryDataset,
  StoryPanelConfig,
  StoryPanelSeries,
  StoryVisualConfig,
  ThresholdRule,
};

const csvFiles = [marginPressureCsv, precisionAgronomyCsv, grainLogisticsCsv];

const allRecords = csvFiles.flatMap((csv) => parseChartCsv(csv));
const storyDatasets = buildStoryDatasets(allRecords, thresholdAnnotations as ThresholdAnnotationManifest);

export function getSeriesSourceTypes(storyId: StoryId, metricKeys: string[]): string[] {
  return [
    ...new Set(
      storyDatasets[storyId].records
        .filter((record) => metricKeys.includes(record.metricKey))
        .map((record) => record.sourceType),
    ),
  ];
}

export function getStoryDataset(storyId: StoryId): StoryDataset {
  return storyDatasets[storyId];
}
