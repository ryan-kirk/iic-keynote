import { CHART_OUTPUT_DIR, generateChartAssets } from './powerpoint-utils.mjs';

const { manifest } = await generateChartAssets();
const chartCount = Object.values(manifest).reduce((total, storyPanels) => total + Object.keys(storyPanels).length, 0);

console.log(`Generated ${chartCount} SVG chart assets in ${CHART_OUTPUT_DIR}.`);
