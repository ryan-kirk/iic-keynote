import fs from 'node:fs/promises';
import path from 'node:path';
import { slides, presentationMeta } from '../src/content/deck.ts';
import {
  buildStoryDatasets,
  formatMetricValue,
  parseChartCsv,
  storyVisualConfigs,
} from '../src/data/storyChartShared.ts';
import {
  buildPanelSeries,
  buildPath,
  formatAxisDate,
  formatPanelValue,
  formatSourceTypeLabel,
  formatThreshold,
  getPanelThresholds,
  resolveDomain,
  scaleDate,
  scaleValue,
} from '../src/data/storyChartPresentation.ts';

const CHART_READY_DIR = path.resolve(process.cwd(), 'data/chart-ready/v1');
const POWERPOINT_OUTPUT_DIR = path.resolve(process.cwd(), 'artifacts/powerpoint');
const CHART_OUTPUT_DIR = path.join(POWERPOINT_OUTPUT_DIR, 'charts');
const CHART_MANIFEST_PATH = path.join(CHART_OUTPUT_DIR, 'manifest.json');

const STORY_FILES = [
  'margin_pressure_chart_ready.csv',
  'precision_agronomy_chart_ready.csv',
  'grain_logistics_chart_ready.csv',
];

const SVG_COLORS = {
  white: '#fffdf7',
  paper: '#f4f1e8',
  muted: '#cfd8d1',
  line: '#ffffff',
  grid: '#ffffff22',
  window: '#ffffff14',
  shell: '#173126',
  stroke: '#ffffff1f',
  watch: '#d4a846',
  escalate: '#9f5536',
  context: '#b6c4ba',
  benchmark: '#77945f',
  real: '#77945f',
  proxy: '#d4a846',
  illustrative: '#9f5536',
};

export {
  CHART_MANIFEST_PATH,
  CHART_OUTPUT_DIR,
  POWERPOINT_OUTPUT_DIR,
  presentationMeta,
  slides,
  storyVisualConfigs,
};

export function getVisiblePanelsForSlide(slide) {
  if (!slide.chartStoryId) {
    return [];
  }

  const panels = storyVisualConfigs[slide.chartStoryId].panels;

  if (!slide.chartPanelIds?.length) {
    return panels;
  }

  return panels.filter((panel) => slide.chartPanelIds.includes(panel.id));
}

export async function loadStoryDatasets() {
  const [annotationsRaw, ...csvContents] = await Promise.all([
    fs.readFile(path.join(CHART_READY_DIR, 'threshold_annotations.json'), 'utf8'),
    ...STORY_FILES.map((fileName) => fs.readFile(path.join(CHART_READY_DIR, fileName), 'utf8')),
  ]);
  const records = csvContents.flatMap((csv) => parseChartCsv(csv));
  return buildStoryDatasets(records, JSON.parse(annotationsRaw));
}

export async function generateChartAssets(outputDir = CHART_OUTPUT_DIR) {
  const datasets = await loadStoryDatasets();
  const manifest = {};

  await fs.mkdir(outputDir, { recursive: true });

  for (const [storyId, config] of Object.entries(storyVisualConfigs)) {
    const dataset = datasets[storyId];
    manifest[storyId] = {};

    for (const panel of config.panels) {
      const svg = renderChartCardSvg({ dataset, panel, storyId });
      const filePath = path.join(outputDir, `${storyId}__${panel.id}.svg`);
      await fs.writeFile(filePath, svg, 'utf8');
      manifest[storyId][panel.id] = filePath;
    }
  }

  await fs.writeFile(CHART_MANIFEST_PATH, JSON.stringify(manifest, null, 2));

  return { datasets, manifest, outputDir };
}

export function buildSpeakerNotes(slide, index, total, datasets) {
  const lines = [
    `${presentationMeta.title}`,
    `Slide ${String(index + 1).padStart(2, '0')} of ${String(total).padStart(2, '0')}: ${slide.title}`,
  ];

  if (slide.subtitle) {
    lines.push('', slide.subtitle);
  }

  if (slide.stats?.length) {
    lines.push('', 'Key stats:');
    slide.stats.forEach((stat) => lines.push(`- ${stat.label}: ${stat.value}`));
  }

  if (slide.bullets?.length) {
    lines.push('', 'Talking points:');
    slide.bullets.forEach((bullet) => lines.push(`- ${bullet}`));
  }

  if (slide.signals?.length) {
    lines.push('', 'Signals to emphasize:');
    slide.signals.forEach((signal) => lines.push(`- ${signal.title}: ${signal.detail}`));
  }

  if (slide.steps?.length) {
    lines.push('', 'Step sequence:');
    slide.steps.forEach((step, stepIndex) => lines.push(`- ${stepIndex + 1}. ${step.title}: ${step.detail}`));
  }

  if (slide.leftTitle && slide.leftBullets?.length) {
    lines.push('', `${slide.leftTitle}:`);
    slide.leftBullets.forEach((bullet) => lines.push(`- ${bullet}`));
  }

  if (slide.rightTitle && slide.rightBullets?.length) {
    lines.push('', `${slide.rightTitle}:`);
    slide.rightBullets.forEach((bullet) => lines.push(`- ${bullet}`));
  }

  if (slide.timeline?.length) {
    lines.push('', 'Roadmap:');
    slide.timeline.forEach((item) => lines.push(`- ${item.period}: ${item.title}. ${item.detail}`));
  }

  if (slide.quote) {
    lines.push('', `Quote: ${slide.quote}`);
    if (slide.quoteAttribution) {
      lines.push(`Attribution: ${slide.quoteAttribution}`);
    }
  }

  if (slide.chartStoryId) {
    const dataset = datasets[slide.chartStoryId];
    const config = storyVisualConfigs[slide.chartStoryId];
    const panels = getVisiblePanelsForSlide(slide);
    const metricKeys = panels.flatMap((panel) => panel.series.map((series) => series.metricKey));
    const thresholds = dataset.thresholds.filter((threshold) => metricKeys.includes(threshold.metricKey));

    lines.push('', `Data mix: ${config.sourceLabel}`);
    lines.push(`Visible panels: ${panels.map((panel) => panel.title).join(' | ')}`);

    if (panels.length) {
      lines.push('', 'Panel detail:');
      panels.forEach((panel) => lines.push(`- ${panel.title}: ${panel.description}`));
    }

    if (thresholds.length) {
      lines.push('', 'Thresholds:');
      thresholds.forEach((threshold) => lines.push(`- ${formatThreshold(threshold)}. ${threshold.meaning}`));
    }

    if (dataset.annotations.length) {
      lines.push('', 'Context kept visible:');
      dataset.annotations.slice(0, 4).forEach((annotation) => {
        lines.push(`- ${formatAxisDate(annotation.date)}: ${annotation.label}. ${annotation.description}`);
      });
    }
  }

  if (slide.speakerNotes?.length) {
    lines.push('', 'Expanded framing:');
    slide.speakerNotes.forEach((note) => lines.push(`- ${note}`));
  }

  lines.push('', `Audience: ${presentationMeta.audience}`);
  lines.push(`Event: ${presentationMeta.event}`);

  return lines.join('\n');
}

function renderChartCardSvg({ dataset, panel }) {
  const width = 920;
  const height = 420;
  const padding = { top: 20, right: 18, bottom: 20, left: 18 };
  const chartBounds = { x: 24, y: 122, w: 872, h: 240 };
  const plotPadding = { top: 18, right: 12, bottom: 20, left: 12 };
  const panelSeries = buildPanelSeries(panel, dataset.records);
  const points = panelSeries.flatMap((series) => series.points);
  const thresholds = getPanelThresholds(panel, dataset.thresholds);
  const sourceTypes = getPanelSourceTypes(dataset.records, panel.series.map((series) => series.metricKey));
  const uniqueDates = [...new Set(points.map((point) => point.date))].sort();
  const minDate = uniqueDates[0];
  const maxDate = uniqueDates[uniqueDates.length - 1];
  const domain = resolveDomain(points, thresholds, panel.minValue, panel.maxValue);
  const showZeroAxis = domain.min <= 0 && domain.max >= 0;

  const comparisonWindowsMarkup = dataset.comparisonWindows
    .map((window) => {
      const x = chartBounds.x + scaleDate(window.startDate, minDate, maxDate, chartBounds.w, plotPadding.left, plotPadding.right);
      const nextX =
        chartBounds.x + scaleDate(window.endDate, minDate, maxDate, chartBounds.w, plotPadding.left, plotPadding.right);
      return `<rect x="${round(x)}" y="${chartBounds.y + plotPadding.top}" width="${round(
        Math.max(nextX - x, 4),
      )}" height="${chartBounds.h - plotPadding.top - plotPadding.bottom}" rx="10" fill="${SVG_COLORS.window}" />`;
    })
    .join('');

  const gridMarkup = [0.25, 0.5, 0.75]
    .map((fraction) => {
      const y = chartBounds.y + plotPadding.top + (chartBounds.h - plotPadding.top - plotPadding.bottom) * fraction;
      return `<line x1="${chartBounds.x + plotPadding.left}" x2="${chartBounds.x + chartBounds.w - plotPadding.right}" y1="${round(
        y,
      )}" y2="${round(y)}" stroke="${SVG_COLORS.grid}" stroke-width="1" />`;
    })
    .join('');

  const zeroAxisMarkup = showZeroAxis
    ? `<line x1="${chartBounds.x + plotPadding.left}" x2="${chartBounds.x + chartBounds.w - plotPadding.right}" y1="${round(
        chartBounds.y +
          scaleValue(0, domain.min, domain.max, chartBounds.h, plotPadding.top, plotPadding.bottom),
      )}" y2="${round(
        chartBounds.y +
          scaleValue(0, domain.min, domain.max, chartBounds.h, plotPadding.top, plotPadding.bottom),
      )}" stroke="#ffffff55" stroke-width="1.5" />`
    : '';

  const thresholdMarkup = thresholds
    .map((threshold) => {
      const y = chartBounds.y + scaleValue(threshold.value, domain.min, domain.max, chartBounds.h, plotPadding.top, plotPadding.bottom);
      const color = severityColor(threshold.severity);
      return `
        <line x1="${chartBounds.x + plotPadding.left}" x2="${chartBounds.x + chartBounds.w - plotPadding.right}" y1="${round(
          y,
        )}" y2="${round(y)}" stroke="${color}" stroke-width="1.5" stroke-dasharray="7 5" />
        <text x="${chartBounds.x + chartBounds.w - plotPadding.right - 2}" y="${round(
          y - 6,
        )}" fill="${color}" text-anchor="end" font-family="Arial, sans-serif" font-size="11">${escapeXml(
          formatMetricValue(threshold.metricKey, threshold.value),
        )}</text>
      `;
    })
    .join('');

  const seriesMarkup = panelSeries
    .map((series) => {
      const drawLine = series.points.length > 2 && !series.points.every((point) => point.timeGrain === 'event');
      const pathMarkup = drawLine
        ? `<path d="${buildPath(
            series.points,
            domain.min,
            domain.max,
            minDate,
            maxDate,
            chartBounds.w,
            chartBounds.h,
            plotPadding,
          )}" fill="none" stroke="${series.color}" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" transform="translate(${chartBounds.x}, ${chartBounds.y})" />`
        : '';
      const pointMarkup = series.points
        .map((point) => {
          const x =
            chartBounds.x + scaleDate(point.date, minDate, maxDate, chartBounds.w, plotPadding.left, plotPadding.right);
          const y =
            chartBounds.y + scaleValue(point.value, domain.min, domain.max, chartBounds.h, plotPadding.top, plotPadding.bottom);
          return `<circle cx="${round(x)}" cy="${round(y)}" r="4.5" fill="${series.color}" />`;
        })
        .join('');

      return `${pathMarkup}${pointMarkup}`;
    })
    .join('');

  const legendMarkup = panelSeries
    .map((series, index) => {
      const latestPoint = series.points[series.points.length - 1];
      const baseY = 44 + index * 46;
      return `
        <rect x="664" y="${baseY}" width="14" height="14" rx="7" fill="${series.color}" />
        <text x="686" y="${baseY + 12}" fill="${SVG_COLORS.white}" font-family="Arial, sans-serif" font-size="14" font-weight="700">${escapeXml(
          series.label,
        )}</text>
        <text x="686" y="${baseY + 30}" fill="${SVG_COLORS.muted}" font-family="Arial, sans-serif" font-size="12">${escapeXml(
          formatPanelValue(series.metricKey, latestPoint.value, panel.displayMode),
        )}</text>
      `;
    })
    .join('');

  const sourcePillsMarkup = renderPills(sourceTypes, 28, 82);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="28" fill="#ffffff" fill-opacity="0.08" stroke="${SVG_COLORS.stroke}" />
  <text x="${padding.left + 10}" y="36" fill="${SVG_COLORS.watch}" font-family="Arial, sans-serif" font-size="12" font-weight="700" letter-spacing="1.8">${escapeXml(
    panel.eyebrow.toUpperCase(),
  )}</text>
  <text x="28" y="64" fill="${SVG_COLORS.white}" font-family="Georgia, serif" font-size="26" font-weight="700">${escapeXml(
    panel.title,
  )}</text>
  ${sourcePillsMarkup}
  ${legendMarkup}
  <rect x="${chartBounds.x}" y="${chartBounds.y}" width="${chartBounds.w}" height="${chartBounds.h}" rx="20" fill="${SVG_COLORS.shell}" stroke="${SVG_COLORS.stroke}" />
  ${comparisonWindowsMarkup}
  ${gridMarkup}
  ${zeroAxisMarkup}
  ${thresholdMarkup}
  ${seriesMarkup}
  <text x="${chartBounds.x + plotPadding.left}" y="${height - 24}" fill="${SVG_COLORS.muted}" font-family="Arial, sans-serif" font-size="12">${escapeXml(
    formatAxisDate(minDate),
  )}</text>
  <text x="${chartBounds.x + chartBounds.w - plotPadding.right}" y="${height - 24}" fill="${SVG_COLORS.muted}" font-family="Arial, sans-serif" font-size="12" text-anchor="end">${escapeXml(
    formatAxisDate(maxDate),
  )}</text>
</svg>`;
}

function renderPills(sourceTypes, startX, y) {
  let cursorX = startX;

  return sourceTypes
    .map((sourceType) => {
      const label = formatSourceTypeLabel(sourceType);
      const width = 18 + label.length * 7.2;
      const markup = `
        <rect x="${round(cursorX)}" y="${y}" width="${round(width)}" height="22" rx="11" fill="${severityColor(
        sourceType,
      )}" fill-opacity="0.18" stroke="${severityColor(sourceType)}" stroke-opacity="0.35" />
        <text x="${round(cursorX + width / 2)}" y="${y + 15}" fill="${severityColor(
          sourceType,
        )}" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" font-weight="700">${escapeXml(
        label,
      )}</text>
      `;
      cursorX += width + 8;
      return markup;
    })
    .join('');
}

function getPanelSourceTypes(records, metricKeys) {
  return [...new Set(records.filter((record) => metricKeys.includes(record.metricKey)).map((record) => record.sourceType))];
}

function severityColor(severity) {
  if (severity === 'watch' || severity === 'proxy') {
    return SVG_COLORS.watch;
  }

  if (severity === 'escalate' || severity === 'illustrative') {
    return SVG_COLORS.escalate;
  }

  if (severity === 'benchmark' || severity === 'real') {
    return SVG_COLORS.benchmark;
  }

  return SVG_COLORS.context;
}

function round(value) {
  return Number(value.toFixed(2));
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}
