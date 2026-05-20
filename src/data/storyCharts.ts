import marginPressureCsv from '../../data/chart-ready/v1/margin_pressure_chart_ready.csv?raw';
import precisionAgronomyCsv from '../../data/chart-ready/v1/precision_agronomy_chart_ready.csv?raw';
import grainLogisticsCsv from '../../data/chart-ready/v1/grain_logistics_chart_ready.csv?raw';
import thresholdAnnotations from '../../data/chart-ready/v1/threshold_annotations.json';
import type { StoryId } from '../content/deck';

export interface ChartRecord {
  date: string;
  timeGrain: string;
  storyId: StoryId;
  entityId: string;
  metricKey: string;
  metricLabel: string;
  value: number;
  unit: string;
  sourceType: string;
  sourceName: string;
  notes: string;
}

export interface ThresholdRule {
  id: string;
  metricKey: string;
  operator: string;
  value: number;
  unit: string;
  severity: string;
  meaning: string;
}

export interface ComparisonWindow {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  meaning: string;
}

export interface StoryAnnotation {
  date: string;
  type: string;
  label: string;
  description: string;
}

export interface StoryDataset {
  id: StoryId;
  records: ChartRecord[];
  thresholds: ThresholdRule[];
  comparisonWindows: ComparisonWindow[];
  annotations: StoryAnnotation[];
  sourceTypes: string[];
}

export interface StoryPanelSeries {
  metricKey: string;
  label: string;
  color: string;
}

export interface StoryPanelConfig {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  displayMode?: 'raw' | 'baseline-index';
  minValue?: number;
  maxValue?: number;
  series: StoryPanelSeries[];
}

export interface StoryVisualConfig {
  sourceLabel: string;
  panels: StoryPanelConfig[];
}

const csvFiles = [marginPressureCsv, precisionAgronomyCsv, grainLogisticsCsv];

const allRecords = csvFiles.flatMap((csv) => parseCsv(csv));

const storyDatasets = (Object.keys(thresholdAnnotations.stories) as StoryId[]).reduce<Record<StoryId, StoryDataset>>(
  (accumulator, storyId) => {
    const records = allRecords
      .filter((record) => record.storyId === storyId)
      .sort((left, right) => left.date.localeCompare(right.date));

    const storyAnnotations = thresholdAnnotations.stories[storyId];

    accumulator[storyId] = {
      id: storyId,
      records,
      thresholds: storyAnnotations.thresholds,
      comparisonWindows: storyAnnotations.comparisonWindows,
      annotations: storyAnnotations.annotations,
      sourceTypes: [...new Set(records.map((record) => record.sourceType))],
    };

    return accumulator;
  },
  {} as Record<StoryId, StoryDataset>,
);

const palette = {
  gold: '#d4a846',
  rust: '#9f5536',
  forest: '#244736',
  sage: '#77945f',
} as const;

export const storyVisualConfigs: Record<StoryId, StoryVisualConfig> = {
  margin_pressure: {
    sourceLabel: 'Proxy market data + synthetic operating examples',
    panels: [
      {
        id: 'margin-context',
        title: 'Corn, fertilizer, and financing proxies',
        eyebrow: 'Proxy market context',
        description: 'Proxy market and financing series, rebased to January = 100, show the real economic setup before any synthetic response is introduced.',
        displayMode: 'baseline-index',
        minValue: 84,
        maxValue: 116,
        series: [
          { metricKey: 'corn_price_proxy_usd_mt', label: 'Corn proxy', color: palette.sage },
          { metricKey: 'fertilizer_cost_proxy_index', label: 'Fertilizer proxy', color: palette.gold },
          { metricKey: 'financing_proxy_pct', label: 'Financing proxy', color: palette.forest },
        ],
      },
      {
        id: 'margin-pressure',
        title: 'Synthetic margin pressure example',
        eyebrow: 'Synthetic operating example',
        description: 'Synthetic pressure example shows how a co-op could combine the real proxy inputs into a watch-and-escalate workflow.',
        minValue: 88,
        maxValue: 118,
        series: [{ metricKey: 'margin_pressure_index', label: 'Margin pressure', color: palette.rust }],
      },
      {
        id: 'booking-behavior',
        title: 'Synthetic member booking example',
        eyebrow: 'Synthetic response example',
        description: 'Synthetic booking response shows how member behavior could soften after the pressure story moves into watch territory.',
        minValue: 86,
        maxValue: 110,
        series: [{ metricKey: 'booking_behavior_index', label: 'Booking behavior', color: palette.gold }],
      },
    ],
  },
  precision_agronomy: {
    sourceLabel: 'Real weather context + synthetic field examples',
    panels: [
      {
        id: 'temperature-deviation',
        title: 'Heat signal',
        eyebrow: 'Real weather context',
        description: 'Real Mesonet temperature anomalies show the hot weeks that plausibly push the canopy into stress during late vegetative growth.',
        minValue: -5,
        maxValue: 12,
        series: [{ metricKey: 'temp_deviation_f', label: 'Temp deviation', color: palette.rust }],
      },
      {
        id: 'precipitation-deviation',
        title: 'Moisture and recovery signal',
        eyebrow: 'Real weather context',
        description: 'Real Mesonet precipitation anomalies show the dry windows and the rain week that supports the first NDVI recovery.',
        minValue: -1.5,
        maxValue: 4.5,
        series: [{ metricKey: 'precip_deviation_in', label: 'Precip deviation', color: palette.forest }],
      },
      {
        id: 'ndvi-anomaly',
        title: 'Synthetic NDVI example',
        eyebrow: 'Synthetic field example',
        description: 'Synthetic NDVI anomaly line shows a late-June drop, a rain-assisted early-July recovery, and a second stress wave near pollination and early grain fill.',
        minValue: -0.1,
        maxValue: 0.06,
        series: [{ metricKey: 'ndvi_anomaly_index', label: 'NDVI anomaly', color: palette.sage }],
      },
      {
        id: 'scout-attention',
        title: 'Synthetic scout triage example',
        eyebrow: 'Synthetic workflow example',
        description: 'Synthetic scout-priority events show where agronomist attention becomes most urgent after the stress windows appear.',
        minValue: 0,
        maxValue: 100,
        series: [{ metricKey: 'scout_attention_score', label: 'Attention score', color: palette.gold }],
      },
    ],
  },
  grain_logistics: {
    sourceLabel: 'Real USDA crop progress + synthetic logistics inference',
    panels: [
      {
        id: 'harvest-progress',
        title: 'Weekly USDA crop progress',
        eyebrow: 'Real public anchor',
        description: 'Real USDA report values lead the story and establish the statewide harvest curve before any synthetic operational inference is shown.',
        minValue: 0,
        maxValue: 100,
        series: [
          { metricKey: 'corn_mature_pct', label: 'Corn mature', color: palette.sage },
          { metricKey: 'corn_harvested_pct', label: 'Corn harvested', color: palette.gold },
        ],
      },
      {
        id: 'daily-receipts',
        title: 'Synthetic receipts inference',
        eyebrow: 'Synthetic operating inference',
        description: 'Synthetic intake curve is inferred from the USDA harvest ramp and shows how inbound pressure could build at a location level.',
        minValue: 8000,
        maxValue: 15500,
        series: [{ metricKey: 'receipts_bu_day', label: 'Receipts', color: palette.gold }],
      },
      {
        id: 'turn-time',
        title: 'Synthetic truck turn-time inference',
        eyebrow: 'Synthetic service inference',
        description: 'Synthetic turn-time curve shows the earliest member-facing symptom inferred from the harvest ramp and throughput pressure.',
        minValue: 35,
        maxValue: 125,
        series: [{ metricKey: 'truck_turn_time_minutes', label: 'Turn time', color: palette.rust }],
      },
      {
        id: 'capacity',
        title: 'Synthetic capacity inference',
        eyebrow: 'Synthetic constraint inference',
        description: 'Synthetic storage-utilization curve shows how the USDA harvest ramp could translate into a visible watch period before a hard constraint.',
        minValue: 40,
        maxValue: 100,
        series: [{ metricKey: 'bin_capacity_utilization_pct', label: 'Capacity', color: palette.forest }],
      },
    ],
  },
};

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

export function formatMetricValue(metricKey: string, value: number): string {
  if (metricKey.endsWith('_pct')) {
    return `${value.toFixed(0)}%`;
  }

  if (metricKey.includes('minutes')) {
    return `${value.toFixed(0)} min`;
  }

  if (metricKey.includes('receipts_bu_day')) {
    return `${Math.round(value).toLocaleString()} bu`;
  }

  if (metricKey.includes('usd_mt')) {
    return `$${value.toFixed(0)}/mt`;
  }

  if (metricKey.includes('precip')) {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)} in`;
  }

  if (metricKey.includes('temp')) {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)} F`;
  }

  if (metricKey.includes('ndvi')) {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}`;
  }

  return value.toFixed(0);
}

function parseCsv(csv: string): ChartRecord[] {
  const lines = csv.trim().split(/\r?\n/);

  if (lines.length < 2) {
    return [];
  }

  const headers = splitCsvLine(lines[0]);

  return lines.slice(1).filter(Boolean).map((line) => {
    const values = splitCsvLine(line);
    const row = headers.reduce<Record<string, string>>((accumulator, header, index) => {
      accumulator[header] = values[index] ?? '';
      return accumulator;
    }, {});

    return {
      date: row.date,
      timeGrain: row.timeGrain,
      storyId: row.storyId as StoryId,
      entityId: row.entityId,
      metricKey: row.metricKey,
      metricLabel: row.metricLabel,
      value: Number.parseFloat(row.value),
      unit: row.unit,
      sourceType: row.sourceType,
      sourceName: row.sourceName,
      notes: row.notes,
    };
  });
}

function splitCsvLine(line: string): string[] {
  const values: string[] = [];
  let currentValue = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];

    if (character === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (character === ',' && !inQuotes) {
      values.push(currentValue);
      currentValue = '';
      continue;
    }

    currentValue += character;
  }

  values.push(currentValue);
  return values;
}