import fs from 'node:fs/promises';
import path from 'node:path';
import PptxGenJS from 'pptxgenjs';
import { getSlideWhatMattersBullets } from '../src/content/deck.ts';
import { formatMetricValue } from '../src/data/storyChartShared.ts';
import {
  CHART_OUTPUT_DIR,
  POWERPOINT_OUTPUT_DIR,
  buildSpeakerNotes,
  generateChartAssets,
  getVisiblePanelsForSlide,
  presentationMeta,
  slides,
  storyVisualConfigs,
} from './powerpoint-utils.mjs';

const FONT = {
  heading: 'Georgia',
  body: 'Arial',
};

const COLORS = {
  hero: { background: '173326', text: 'FFFDF7', muted: 'DEE6DE', accent: 'D4A846', panel: 'FFFFFF' },
  dark: { background: '12261D', text: 'FFFDF7', muted: 'D4DED7', accent: 'D4A846', panel: 'FFFFFF' },
  light: { background: 'FFFDF7', text: '1D2B22', muted: '53685C', accent: '244736', panel: '1D2B22' },
  accent: { background: '556B34', text: 'FFFDF7', muted: 'E7ECD8', accent: 'F2C766', panel: 'FFFFFF' },
  warning: { background: '432117', text: 'FFFDF7', muted: 'F0DDD8', accent: 'F2C766', panel: 'FFFFFF' },
};

const outputPath = path.join(POWERPOINT_OUTPUT_DIR, 'iowa-co-op-keynote.pptx');
const downloadOutputPath = path.resolve(process.cwd(), 'public/downloads/iowa-co-op-keynote.pptx');

await fs.mkdir(POWERPOINT_OUTPUT_DIR, { recursive: true });
await fs.mkdir(path.dirname(downloadOutputPath), { recursive: true });

const { datasets, manifest } = await generateChartAssets(CHART_OUTPUT_DIR);
const pptx = new PptxGenJS();
const SHAPE = pptx.ShapeType;

pptx.layout = 'LAYOUT_WIDE';
pptx.title = presentationMeta.title;
pptx.subject = presentationMeta.subtitle;

slides.forEach((definition, index) => {
  const slide = pptx.addSlide();
  applySlideChrome(pptx, slide, definition, index, slides.length);
  renderSlide(pptx, slide, definition, index);
  slide.addNotes(buildSpeakerNotes(definition, index, slides.length, datasets));
});

await pptx.writeFile({ fileName: outputPath, compression: true });
await fs.copyFile(outputPath, downloadOutputPath);

console.log(`Exported ${slides.length} slides to ${outputPath}.`);
console.log(`Chart assets written to ${CHART_OUTPUT_DIR}.`);
console.log(`Download copy written to ${downloadOutputPath}.`);

function renderSlide(pptx, slide, definition, index) {
  switch (definition.layout) {
    case 'hero':
      renderHeroSlide(pptx, slide, definition);
      return;
    case 'agenda':
    case 'next-steps':
      renderBulletSlide(pptx, slide, definition);
      return;
    case 'analytics':
      renderAnalyticsSlide(pptx, slide, definition, manifest);
      return;
    case 'signal-grid':
    case 'service-stack':
      renderSignalGridSlide(pptx, slide, definition);
      return;
    case 'trend-cards':
      renderTrendCardsSlide(pptx, slide, definition);
      return;
    case 'operating-model':
    case 'process':
      renderProcessSlide(pptx, slide, definition);
      return;
    case 'two-column':
      renderTwoColumnSlide(pptx, slide, definition);
      return;
    case 'quote':
      renderQuoteSlide(pptx, slide, definition);
      return;
    case 'timeline':
      renderTimelineSlide(pptx, slide, definition);
      return;
    case 'author-profile':
      renderAuthorProfileSlide(pptx, slide, definition);
      return;
    case 'closing':
      renderClosingSlide(pptx, slide, definition);
      return;
    default:
      renderBulletSlide(pptx, slide, definition);
  }
}

function applySlideChrome(pptx, slide, definition, index, total) {
  const tone = COLORS[definition.tone];
  slide.background = { color: tone.background };

  slide.addShape(pptx.ShapeType.ellipse, {
    x: -0.3,
    y: -0.65,
    w: 3.1,
    h: 2.4,
    fill: { color: tone.accent, transparency: 80 },
    line: { color: tone.accent, transparency: 100 },
  });
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 10.8,
    y: -0.55,
    w: 2.8,
    h: 2.1,
    fill: { color: 'FFFFFF', transparency: 90 },
    line: { color: 'FFFFFF', transparency: 100 },
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 7.2,
    y: 6.75,
    w: 6.6,
    h: 1.2,
    rotate: -12,
    fill: { color: tone.accent, transparency: 92 },
    line: { color: tone.accent, transparency: 100 },
  });

  slide.addText(definition.eyebrow.toUpperCase(), {
    x: 0.55,
    y: 0.24,
    w: 4.8,
    h: 0.28,
    fontFace: FONT.body,
    fontSize: 10,
    bold: true,
    color: tone.accent,
    charSpace: 1.8,
    margin: 0,
  });

  slide.addText(`${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`, {
    x: 11.6,
    y: 0.24,
    w: 1.15,
    h: 0.28,
    align: 'right',
    fontFace: FONT.body,
    fontSize: 10,
    color: tone.muted,
    margin: 0,
  });
}

function renderHeroSlide(pptx, slide, definition) {
  const tone = COLORS[definition.tone];

  slide.addText(definition.title, {
    x: 0.8,
    y: 1.35,
    w: 8.8,
    h: 1.6,
    fontFace: FONT.heading,
    fontSize: 28,
    bold: true,
    color: tone.text,
    margin: 0,
    fit: 'shrink',
  });

  if (definition.subtitle) {
    slide.addText(definition.subtitle, {
      x: 0.85,
      y: 2.9,
      w: 8.9,
      h: 0.9,
      fontFace: FONT.body,
      fontSize: 17,
      color: tone.muted,
      margin: 0,
      fit: 'shrink',
    });
  }

  definition.stats?.forEach((stat, statIndex) => {
    const x = 0.85 + statIndex * 2.95;
    slide.addShape(pptx.ShapeType.roundRect, {
      x,
      y: 4.85,
      w: 2.65,
      h: 1.15,
      fill: { color: 'FFFFFF', transparency: 88 },
      line: { color: 'FFFFFF', transparency: 82, width: 1 },
    });
    slide.addText(stat.label.toUpperCase(), {
      x: x + 0.18,
      y: 5.03,
      w: 2.2,
      h: 0.18,
      fontFace: FONT.body,
      fontSize: 9,
      bold: true,
      color: tone.muted,
      charSpace: 1.4,
      margin: 0,
    });
    slide.addText(stat.value, {
      x: x + 0.18,
      y: 5.29,
      w: 2.2,
      h: 0.34,
      fontFace: FONT.body,
      fontSize: 18,
      bold: true,
      color: tone.text,
      margin: 0,
    });
  });
}

function renderBulletSlide(pptx, slide, definition) {
  addTitleBlock(slide, definition, { titleY: 1.1, titleW: 9.1, subtitleY: 1.9, subtitleW: 8.2 });
  addPanel(slide, { x: 0.85, y: 2.75, w: 7.4, h: 3.55, tone: definition.tone });
  addBulletList(slide, definition.bullets ?? [], { x: 1.15, y: 3.05, w: 6.75, lineH: 0.62, tone: definition.tone });
}

function renderSignalGridSlide(pptx, slide, definition) {
  addTitleBlock(slide, definition, { titleY: 0.95, titleW: 9.5, subtitleY: 1.8, subtitleW: 8.3 });

  const items = definition.signals ?? [];
  const cardWidth = 5.78;
  const cardHeight = 1.7;
  const startX = 0.85;
  const startY = 2.65;

  items.forEach((signal, itemIndex) => {
    const column = itemIndex % 2;
    const row = Math.floor(itemIndex / 2);
    const x = startX + column * 6.1;
    const y = startY + row * 1.95;

    addPanel(slide, { x, y, w: cardWidth, h: cardHeight, tone: definition.tone });
    slide.addShape(pptx.ShapeType.ellipse, {
      x: x + 0.24,
      y: y + 0.28,
      w: 0.36,
      h: 0.36,
      fill: { color: COLORS[definition.tone].accent },
      line: { color: COLORS[definition.tone].accent, transparency: 100 },
    });
    slide.addText(signal.title, {
      x: x + 0.72,
      y: y + 0.22,
      w: 4.65,
      h: 0.28,
      fontFace: FONT.body,
      fontSize: 16,
      bold: true,
      color: COLORS[definition.tone].text,
      margin: 0,
    });
    slide.addText(signal.detail, {
      x: x + 0.72,
      y: y + 0.56,
      w: 4.72,
      h: 0.8,
      fontFace: FONT.body,
      fontSize: 12.5,
      color: COLORS[definition.tone].muted,
      margin: 0,
      fit: 'shrink',
    });
  });
}

function renderTrendCardsSlide(pptx, slide, definition) {
  addTitleBlock(slide, definition, { titleY: 1.0, titleW: 8.8 });
  const trends = definition.trends ?? [];
  const width = 3.9;
  const startX = 0.85;
  const y = 2.4;

  trends.forEach((trend, trendIndex) => {
    const x = startX + trendIndex * 4.1;
    addPanel(slide, { x, y, w: width, h: 3.55, tone: definition.tone });
    slide.addText(trend.title, {
      x: x + 0.2,
      y: y + 0.28,
      w: width - 0.4,
      h: 0.3,
      fontFace: FONT.body,
      fontSize: 15,
      bold: true,
      color: COLORS[definition.tone].text,
      margin: 0,
    });
    slide.addText(trend.summary, {
      x: x + 0.2,
      y: y + 0.7,
      w: width - 0.4,
      h: 1.5,
      fontFace: FONT.body,
      fontSize: 12.5,
      color: COLORS[definition.tone].muted,
      margin: 0,
      fit: 'shrink',
    });
    slide.addShape(pptx.ShapeType.roundRect, {
      x: x + 0.2,
      y: y + 2.72,
      w: width - 0.4,
      h: 0.55,
      fill: { color: COLORS[definition.tone].accent, transparency: 82 },
      line: { color: COLORS[definition.tone].accent, transparency: 100 },
    });
    slide.addText(`Implication: ${trend.implication}`, {
      x: x + 0.28,
      y: y + 2.86,
      w: width - 0.56,
      h: 0.22,
      fontFace: FONT.body,
      fontSize: 11,
      bold: true,
      color: COLORS[definition.tone].text,
      margin: 0,
      fit: 'shrink',
    });
  });
}

function renderProcessSlide(pptx, slide, definition) {
  addTitleBlock(slide, definition, { titleY: 0.95, titleW: 9.2, subtitleY: 1.78, subtitleW: 8.5 });
  const steps = definition.steps ?? [];
  const width = 2.85;
  const startX = 0.82;
  const y = 3.05;

  steps.forEach((step, stepIndex) => {
    const x = startX + stepIndex * 3.12;
    addPanel(slide, { x, y, w: width, h: 2.3, tone: definition.tone });
    slide.addText(`0${stepIndex + 1}`, {
      x: x + 0.18,
      y: y + 0.2,
      w: 0.45,
      h: 0.18,
      fontFace: FONT.body,
      fontSize: 10,
      bold: true,
      color: COLORS[definition.tone].accent,
      charSpace: 1.8,
      margin: 0,
    });
    slide.addText(step.title, {
      x: x + 0.18,
      y: y + 0.52,
      w: width - 0.36,
      h: 0.3,
      fontFace: FONT.body,
      fontSize: 16,
      bold: true,
      color: COLORS[definition.tone].text,
      margin: 0,
    });
    slide.addText(step.detail, {
      x: x + 0.18,
      y: y + 0.93,
      w: width - 0.36,
      h: 0.98,
      fontFace: FONT.body,
      fontSize: 12,
      color: COLORS[definition.tone].muted,
      margin: 0,
      fit: 'shrink',
    });

    if (stepIndex < steps.length - 1) {
      slide.addShape(pptx.ShapeType.chevron, {
        x: x + width + 0.07,
        y: y + 0.92,
        w: 0.26,
        h: 0.38,
        fill: { color: COLORS[definition.tone].accent, transparency: 18 },
        line: { color: COLORS[definition.tone].accent, transparency: 100 },
      });
    }
  });
}

function renderTwoColumnSlide(pptx, slide, definition) {
  addTitleBlock(slide, definition, { titleY: 0.95, titleW: 9.2, subtitleY: 1.78, subtitleW: 8.5 });
  addPanel(slide, { x: 0.85, y: 2.75, w: 5.85, h: 3.55, tone: definition.tone });
  addPanel(slide, { x: 6.95, y: 2.75, w: 5.55, h: 3.55, tone: definition.tone, emphasis: true });

  slide.addText(definition.leftTitle ?? '', {
    x: 1.1,
    y: 3.0,
    w: 5.25,
    h: 0.28,
    fontFace: FONT.body,
    fontSize: 16,
    bold: true,
    color: COLORS[definition.tone].text,
    margin: 0,
  });
  addBulletList(slide, definition.leftBullets ?? [], { x: 1.12, y: 3.42, w: 5.1, lineH: 0.55, tone: definition.tone });

  slide.addText(definition.rightTitle ?? '', {
    x: 7.2,
    y: 3.0,
    w: 4.95,
    h: 0.28,
    fontFace: FONT.body,
    fontSize: 16,
    bold: true,
    color: COLORS[definition.tone].text,
    margin: 0,
  });
  addBulletList(slide, definition.rightBullets ?? [], {
    x: 7.22,
    y: 3.42,
    w: 4.75,
    lineH: 0.55,
    tone: definition.tone,
  });
}

function renderQuoteSlide(pptx, slide, definition) {
  addTitleBlock(slide, definition, { titleY: 1.1, titleW: 9.3 });
  addPanel(slide, { x: 1.0, y: 2.35, w: 11.35, h: 2.5, tone: definition.tone });
  slide.addText(definition.quote ?? '', {
    x: 1.4,
    y: 2.8,
    w: 10.5,
    h: 1.2,
    fontFace: FONT.heading,
    fontSize: 21,
    italic: true,
    color: COLORS[definition.tone].text,
    align: 'center',
    margin: 0,
    fit: 'shrink',
  });
  if (definition.quoteAttribution) {
    slide.addText(definition.quoteAttribution, {
      x: 1.4,
      y: 4.18,
      w: 10.5,
      h: 0.22,
      fontFace: FONT.body,
      fontSize: 11,
      color: COLORS[definition.tone].muted,
      align: 'center',
      margin: 0,
    });
  }
}

function renderTimelineSlide(pptx, slide, definition) {
  addTitleBlock(slide, definition, { titleY: 0.95, titleW: 9.4 });
  const items = definition.timeline ?? [];
  const startY = 2.0;

  items.forEach((item, itemIndex) => {
    const y = startY + itemIndex * 1.18;
    addPanel(slide, { x: 0.95, y, w: 11.95, h: 0.92, tone: definition.tone });
    slide.addText(item.period.toUpperCase(), {
      x: 1.2,
      y: y + 0.23,
      w: 1.55,
      h: 0.18,
      fontFace: FONT.body,
      fontSize: 10,
      bold: true,
      color: COLORS[definition.tone].accent,
      charSpace: 1.5,
      margin: 0,
    });
    slide.addText(item.title, {
      x: 2.55,
      y: y + 0.18,
      w: 2.85,
      h: 0.22,
      fontFace: FONT.body,
      fontSize: 15,
      bold: true,
      color: COLORS[definition.tone].text,
      margin: 0,
    });
    slide.addText(item.detail, {
      x: 5.0,
      y: y + 0.18,
      w: 6.5,
      h: 0.34,
      fontFace: FONT.body,
      fontSize: 11.5,
      color: COLORS[definition.tone].muted,
      margin: 0,
      fit: 'shrink',
    });
  });
}

function renderClosingSlide(pptx, slide, definition) {
  const tone = COLORS[definition.tone];
  slide.addText(definition.title, {
    x: 0.95,
    y: 2.15,
    w: 10.8,
    h: 1.15,
    fontFace: FONT.heading,
    fontSize: 27,
    bold: true,
    color: tone.text,
    margin: 0,
    fit: 'shrink',
  });

  if (definition.subtitle) {
    slide.addText(definition.subtitle, {
      x: 0.98,
      y: 3.45,
      w: 8.8,
      h: 0.7,
      fontFace: FONT.body,
      fontSize: 16,
      color: tone.muted,
      margin: 0,
      fit: 'shrink',
    });
  }
}

function renderAuthorProfileSlide(pptx, slide, definition) {
  const tone = COLORS[definition.tone];
  const profile = definition.authorProfile;

  if (!profile) {
    renderClosingSlide(pptx, slide, definition);
    return;
  }

  addTitleBlock(slide, definition, {
    titleY: 0.98,
    titleW: 8.5,
    subtitleY: 1.7,
    subtitleW: 8.4,
    titleFontSize: 25,
    subtitleFontSize: 14.4,
  });

  addPanel(slide, { x: 0.71, y: 2.0, w: 5.28, h: 5.02, tone: definition.tone });
  slide.addShape(SHAPE.ellipse, {
    x: 2.03,
    y: 2.22,
    w: 2.64,
    h: 2.64,
    fill: { color: 'FFFFFF', transparency: 2 },
    line: { color: 'DCE6DF', width: 1 },
    shadow: { type: 'outer', color: '20352A', opacity: 0.14, blur: 2, offset: 2, angle: 45 },
  });
  slide.addImage({
    path: resolveDeckAssetPath(profile.photoSrc),
    x: 2.15,
    y: 2.34,
    w: 2.4,
    h: 2.4,
    rounding: true,
  });
  slide.addText(profile.role.toUpperCase(), {
    x: 1.07,
    y: 4.9,
    w: 4.6,
    h: 0.2,
    fontFace: FONT.body,
    fontSize: 9.6,
    bold: true,
    color: '2F58D8',
    charSpace: 1.8,
    align: 'center',
    margin: 0,
  });
  slide.addText(profile.name, {
    x: 0.95,
    y: 5.15,
    w: 4.8,
    h: 0.42,
    fontFace: FONT.heading,
    fontSize: 22,
    bold: true,
    color: tone.text,
    align: 'center',
    margin: 0,
  });
  slide.addText(profile.summary, {
    x: 2.58,
    y: 5.56,
    w: 2.92,
    h: 0.67,
    fontFace: FONT.body,
    fontSize: 10.4,
    color: tone.muted,
    margin: 0,
    fit: 'shrink',
  });

  slide.addShape(SHAPE.roundRect, {
    x: 0.92,
    y: 5.2,
    w: 1.52,
    h: 1.52,
    fill: { color: 'FFFFFF' },
    line: { color: 'D7E0DA', width: 1 },
    radius: 0.08,
  });
  slide.addImage({
    path: resolveDeckAssetPath(profile.qrSrc),
    x: 1.04,
    y: 5.32,
    w: 1.28,
    h: 1.28,
  });
  slide.addText('CONNECT', {
    x: 2.52,
    y: 6.29,
    w: 2.25,
    h: 0.18,
    fontFace: FONT.body,
    fontSize: 10,
    bold: true,
    color: '2F58D8',
    charSpace: 1.6,
    margin: 0,
  });
  slide.addText(profile.qrLabel, {
    x: 2.52,
    y: 6.44,
    w: 2.1,
    h: 0.28,
    fontFace: FONT.body,
    fontSize: 12.2,
    bold: true,
    color: tone.text,
    margin: 0,
    fit: 'shrink',
  });

  const highlightPalette = {
    sky: { fill: 'E7F0FF', line: 'D4E0F5' },
    lavender: { fill: 'F2EAF9', line: 'E4D7F2' },
    sage: { fill: 'E6F3EA', line: 'D0E7D7' },
  };

  profile.highlights.forEach((highlight, highlightIndex) => {
    const palette = highlightPalette[highlight.accent];
    const y = [2.28, 3.9, 5.59][highlightIndex] ?? 2.28 + highlightIndex * 1.62;

    slide.addShape(SHAPE.roundRect, {
      x: 6.42,
      y,
      w: 5.85,
      h: 1.3,
      fill: { color: palette.fill },
      line: { color: palette.line, width: 1 },
      radius: 0.08,
    });
    slide.addText(highlight.title, {
      x: 6.68,
      y: y + 0.22,
      w: 5.25,
      h: 0.24,
      fontFace: FONT.body,
      fontSize: 16,
      bold: true,
      color: tone.text,
      margin: 0,
      fit: 'shrink',
    });
    slide.addText(highlight.detail, {
      x: 6.68,
      y: y + 0.62,
      w: 5.1,
      h: 0.42,
      fontFace: FONT.body,
      fontSize: 11.4,
      color: '425447',
      margin: 0,
      fit: 'shrink',
    });
  });
}

function renderAnalyticsSlide(pptx, slide, definition, manifest) {
  const storyId = definition.chartStoryId;
  const config = storyVisualConfigs[storyId];
  const panels = getVisiblePanelsForSlide(definition);
  const chartPaths = panels.map((panel) => manifest[storyId][panel.id]);
  const compactMode = definition.analyticsMode === 'compact';
  const storyBullets = getSlideWhatMattersBullets(definition);

  if (compactMode && chartPaths.length === 2) {
    renderCompactStoryAnalyticsSlide(slide, definition, chartPaths, storyBullets, config);
    return;
  }

  addTitleBlock(slide, definition, {
    titleY: 0.72,
    titleW: 8.2,
    subtitleY: 1.45,
    subtitleW: 8.1,
    titleFontSize: 24,
    subtitleFontSize: 14,
  });

  const chartWidth = 3.95;
  const chartHeight = panels.length > 2 ? 1.65 : 1.84;
  const leftX = 0.6;
  const secondColumnX = 4.8;
  const topY = 2.2;
  const rowGap = 0.18;

  chartPaths.forEach((chartPath, chartIndex) => {
    const column = chartIndex % 2;
    const row = Math.floor(chartIndex / 2);
    const x = column === 0 ? leftX : secondColumnX;
    let y = topY + row * (chartHeight + rowGap);

    if (chartPaths.length === 3 && chartIndex === 2) {
      y = topY + chartHeight + rowGap;
      slide.addImage({ path: chartPath, x: 2.68, y, w: chartWidth, h: chartHeight });
      return;
    }

    slide.addImage({ path: chartPath, x, y, w: chartWidth, h: chartHeight });
  });

  addPanel(slide, { x: 9.1, y: 1.85, w: 3.62, h: 5.15, tone: definition.tone });
  slide.addText('Story readout', {
    x: 9.35,
    y: 2.08,
    w: 2.9,
    h: 0.22,
    fontFace: FONT.body,
    fontSize: 10,
    bold: true,
    color: COLORS[definition.tone].accent,
    charSpace: 1.4,
    margin: 0,
  });
  slide.addText('What the chart says', {
    x: 9.35,
    y: 2.34,
    w: 2.9,
    h: 0.26,
    fontFace: FONT.body,
    fontSize: 15,
    bold: true,
    color: COLORS[definition.tone].text,
    margin: 0,
  });
  addBulletList(slide, storyBullets, {
    x: 9.35,
    y: 2.72,
    w: 2.95,
    lineH: 0.52,
    tone: definition.tone,
    fontSize: 10.8,
  });

  const dataset = datasets[storyId];
  const thresholdLines = dataset.thresholds.map((threshold) => `${formatThresholdLabel(threshold)} ${threshold.meaning}`);
  slide.addText('Thresholds', {
    x: 9.35,
    y: 4.25,
    w: 2.9,
    h: 0.2,
    fontFace: FONT.body,
    fontSize: 10,
    bold: true,
    color: COLORS[definition.tone].accent,
    charSpace: 1.4,
    margin: 0,
  });
  addCompactList(slide, thresholdLines.slice(0, 4), {
    x: 9.35,
    y: 4.52,
    w: 2.95,
    tone: definition.tone,
  });

  const annotationLines = dataset.annotations
    .slice(0, 3)
    .map((annotation) => `${annotation.date}: ${annotation.label}. ${annotation.description}`);
  slide.addText('Annotations', {
    x: 9.35,
    y: 5.78,
    w: 2.9,
    h: 0.2,
    fontFace: FONT.body,
    fontSize: 10,
    bold: true,
    color: COLORS[definition.tone].accent,
    charSpace: 1.4,
    margin: 0,
  });
  addCompactList(slide, annotationLines, {
    x: 9.35,
    y: 6.05,
    w: 2.95,
    tone: definition.tone,
  });
}

function renderCompactStoryAnalyticsSlide(slide, definition, chartPaths, storyBullets, config) {
  const tone = COLORS[definition.tone];

  slide.addText(definition.title, {
    x: 0.8,
    y: 0.68,
    w: 4.45,
    h: 1.56,
    fontFace: FONT.heading,
    fontSize: 25,
    bold: true,
    color: tone.text,
    margin: 0,
    fit: 'shrink',
  });

  if (definition.subtitle) {
    slide.addText(definition.subtitle, {
      x: 1.16,
      y: 2.06,
      w: 3.92,
      h: 1.16,
      fontFace: FONT.body,
      fontSize: 18.8,
      color: tone.muted,
      margin: 0,
      fit: 'shrink',
    });
  }

  addPanel(slide, { x: 0.84, y: 3.87, w: 4.52, h: 3.39, tone: definition.tone });
  slide.addText('What matters', {
    x: 1.16,
    y: 4.03,
    w: 2.52,
    h: 0.22,
    fontFace: FONT.body,
    fontSize: 10,
    bold: true,
    color: tone.accent,
    charSpace: 1.4,
    margin: 0,
  });
  slide.addText('Story readout', {
    x: 1.16,
    y: 4.29,
    w: 2.52,
    h: 0.26,
    fontFace: FONT.body,
    fontSize: 15.5,
    bold: true,
    color: tone.text,
    margin: 0,
  });
  addBulletList(slide, storyBullets.slice(0, 3), {
    x: 1.07,
    y: 4.61,
    w: 4.1,
    lineH: 0.805,
    tone: definition.tone,
    fontSize: 14,
    bulletSize: 0.16,
    bulletTextOffset: 0.26,
  });
  slide.addText(config.sourceLabel, {
    x: 1.39,
    y: 6.9,
    w: 3.26,
    h: 0.42,
    fontFace: FONT.body,
    fontSize: 10.2,
    color: tone.muted,
    margin: 0,
    fit: 'shrink',
  });

  slide.addImage({ path: chartPaths[0], x: 5.29, y: 0.24, w: 6.63, h: 3.35 });
  slide.addImage({ path: chartPaths[1], x: 6.18, y: 3.87, w: 6.63, h: 3.35 });
}

function addTitleBlock(slide, definition, options) {
  const tone = COLORS[definition.tone];
  slide.addText(definition.title, {
    x: 0.8,
    y: options.titleY,
    w: options.titleW,
    h: 0.62,
    fontFace: FONT.heading,
    fontSize: options.titleFontSize ?? 24,
    bold: true,
    color: tone.text,
    margin: 0,
    fit: 'shrink',
  });

  if (definition.subtitle && options.subtitleY && options.subtitleW) {
    slide.addText(definition.subtitle, {
      x: 0.84,
      y: options.subtitleY,
      w: options.subtitleW,
      h: 0.58,
      fontFace: FONT.body,
      fontSize: options.subtitleFontSize ?? 14,
      color: tone.muted,
      margin: 0,
      fit: 'shrink',
    });
  }
}

function addPanel(slide, options) {
  slide.addShape(SHAPE.roundRect, {
    x: options.x,
    y: options.y,
    w: options.w,
    h: options.h,
    fill: {
      color: options.emphasis ? COLORS[options.tone].accent : COLORS[options.tone].panel,
      transparency: options.emphasis ? 82 : 90,
    },
    line: { color: COLORS[options.tone].panel, transparency: 78, width: 1 },
  });
}

function addBulletList(slide, bullets, options) {
  bullets.forEach((bullet, bulletIndex) => {
    const y = options.y + bulletIndex * options.lineH;
    const bulletSize = options.bulletSize ?? 0.12;
    const bulletTextOffset = options.bulletTextOffset ?? 0.22;
    slide.addShape(SHAPE.ellipse, {
      x: options.x,
      y: y + 0.13,
      w: bulletSize,
      h: bulletSize,
      fill: { color: COLORS[options.tone].accent },
      line: { color: COLORS[options.tone].accent, transparency: 100 },
    });
    slide.addText(bullet, {
      x: options.x + bulletTextOffset,
      y,
      w: options.w - bulletTextOffset,
      h: options.lineH - 0.06,
      fontFace: FONT.body,
      fontSize: options.fontSize ?? 12.5,
      color: COLORS[options.tone].text,
      margin: 0,
      fit: 'shrink',
    });
  });
}

function addCompactList(slide, items, options) {
  items.forEach((item, itemIndex) => {
    slide.addText(`- ${item}`, {
      x: options.x,
      y: options.y + itemIndex * 0.34,
      w: options.w,
      h: 0.3,
      fontFace: FONT.body,
      fontSize: 9.2,
      color: COLORS[options.tone].muted,
      margin: 0,
      fit: 'shrink',
    });
  });
}

function resolveDeckAssetPath(assetPath) {
  if (assetPath.startsWith('/')) {
    return path.resolve(process.cwd(), 'public', assetPath.slice(1));
  }

  return path.resolve(process.cwd(), assetPath);
}

function formatThresholdLabel(threshold) {
  return `${threshold.severity.toUpperCase()}: ${threshold.operator} ${formatMetricValue(
    threshold.metricKey,
    threshold.value,
  )}`;
}
