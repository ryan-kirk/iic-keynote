import {
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  Combine,
  Fuel,
  GraduationCap,
  HandCoins,
  MapPinned,
  Network,
  Route,
  Satellite,
  Sprout,
  TrendingUp,
  Users,
  Warehouse,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type SlideTone = 'hero' | 'light' | 'dark' | 'accent' | 'warning';

export type SlideLayout =
  | 'hero'
  | 'agenda'
  | 'analytics'
  | 'signal-grid'
  | 'trend-cards'
  | 'operating-model'
  | 'service-stack'
  | 'process'
  | 'two-column'
  | 'quote'
  | 'timeline'
  | 'next-steps'
  | 'closing';

export type StoryId = 'margin_pressure' | 'precision_agronomy' | 'grain_logistics';

export interface Stat {
  label: string;
  value: string;
}

export interface SignalItem {
  title: string;
  detail: string;
  icon: LucideIcon;
}

export interface TrendItem {
  title: string;
  summary: string;
  implication: string;
}

export interface StepItem {
  title: string;
  detail: string;
}

export interface TimelineItem {
  period: string;
  title: string;
  detail: string;
}

export interface SlideDefinition {
  id: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  layout: SlideLayout;
  tone: SlideTone;
  chartStoryId?: StoryId;
  chartPanelIds?: string[];
  analyticsMode?: 'full' | 'compact';
  stats?: Stat[];
  bullets?: string[];
  leftTitle?: string;
  rightTitle?: string;
  leftBullets?: string[];
  rightBullets?: string[];
  signals?: SignalItem[];
  trends?: TrendItem[];
  steps?: StepItem[];
  timeline?: TimelineItem[];
  speakerNotes?: string[];
  quote?: string;
  quoteAttribution?: string;
}

const ORIGINAL_COMBINED_TITLE_PREFIX = 'Original combined-slide title:';

export const presentationMeta = {
  title: 'Iowa Agricultural Co-ops',
  subtitle: 'A data-and-AI narrative built around signals, thresholds, and co-op operating examples',
  audience: 'Agricultural professionals and interns',
  event: 'One-day Iowa co-op trends session',
  exportNote:
    'Slides are defined as structured content objects so the same source can later map into PowerPoint or PDF export workflows.',
};

export function getSlideWhatMattersBullets(slide: SlideDefinition): string[] {
  const bullets = slide.bullets ? [...slide.bullets] : [];
  const originalCombinedTitle = slide.speakerNotes
    ?.find((note) => note.startsWith(ORIGINAL_COMBINED_TITLE_PREFIX))
    ?.slice(ORIGINAL_COMBINED_TITLE_PREFIX.length)
    .trim();

  if (originalCombinedTitle && !bullets.includes(originalCombinedTitle)) {
    bullets.unshift(originalCombinedTitle);
  }

  return bullets;
}

export const slides: SlideDefinition[] = [
  {
    id: 'title',
    eyebrow: 'Iowa Institute Keynote',
    title: 'From Signals to Decisions',
    subtitle:
      'How data and AI are transforming Iowa agricultural co-ops through earlier signal detection and better decision support.',
    layout: 'hero',
    tone: 'hero',
    stats: [
      { label: 'Audience', value: 'Leaders + interns' },
      { label: 'Lens', value: 'Data + AI' },
      { label: 'Method', value: 'Story-driven' },
    ],
  },
  {
    id: 'opening-question',
    eyebrow: 'Opening Question',
    title: 'What changes when a co-op can interpret signals earlier?',
    subtitle: 'This talk stays narrowly focused on the intersection of data, AI, and co-op decision-making.',
    layout: 'agenda',
    tone: 'light',
    bullets: [
      'How data changed the operating environment',
      'How signals become a usable story',
      'Where AI helps in credible, high-trust workflows',
      'Which examples map cleanly to co-op reality',
    ],
  },
  {
    id: 'shift',
    eyebrow: 'The Shift',
    title: 'Co-ops are becoming information interpreters',
    subtitle: 'Agronomy, markets, logistics, and member-service data now arrive continuously. The constraint moved from access to interpretation.',
    layout: 'signal-grid',
    tone: 'dark',
    signals: [
      {
        title: 'Agronomic signals',
        detail: 'Imagery, tissue results, scouting notes, and equipment data surface field variation much earlier than before.',
        icon: Satellite,
      },
      {
        title: 'Market signals',
        detail: 'Input prices, crop prices, and rates reshape member decisions together, not one at a time.',
        icon: HandCoins,
      },
      {
        title: 'Logistics signals',
        detail: 'Receipts, moisture, truck turns, and storage availability reveal pressure before the phone starts ringing.',
        icon: Route,
      },
      {
        title: 'Member-service signals',
        detail: 'Booking patterns, exception volume, and communication delays show where the member experience is changing.',
        icon: Users,
      },
    ],
  },
  {
    id: 'framework',
    eyebrow: 'Framework',
    title: 'A usable data story follows the same sequence every time',
    subtitle: 'This restores the original signals-to-decisions spine: compare signals, add thresholds, add context, then ask what action deserves support.',
    layout: 'operating-model',
    tone: 'accent',
    steps: [
      {
        title: 'Observe',
        detail: 'Start with signals that appear to be moving together across agronomy, markets, or operations.',
      },
      {
        title: 'Measure',
        detail: 'Add a threshold so the team can separate ordinary noise from something operationally meaningful.',
      },
      {
        title: 'Explain',
        detail: 'Overlay events, notes, or local context to understand what may be driving the pattern.',
      },
      {
        title: 'Assist',
        detail: 'Use AI to summarize, prioritize, and support a human decision instead of pretending the model is the decision-maker.',
      },
    ],
  },
  {
    id: 'margin-story-context',
    eyebrow: 'Data Story 1A',
    title: 'Margin setup tightened before outreach decisions changed',
    subtitle:
      'Two charts establish the setup: corn weakens while fertilizer and financing stay firm.',
    layout: 'analytics',
    tone: 'dark',
    chartStoryId: 'margin_pressure',
    chartPanelIds: ['margin-context', 'margin-pressure'],
    analyticsMode: 'compact',
    bullets: [
      'Corn weakens into August while fertilizer peaks in June and financing stays above 5%.',
      'The synthetic pressure index crosses watch in April and peaks in June.',
    ],
    speakerNotes: [
      'Original combined-slide title: Corn proxy fell 15% while fertilizer proxy rose to 114.',
      'Original fuller framing: Start with the real proxy signals, then use synthetic margin-pressure and booking examples to show how a co-op might translate that setup into action.',
      'Real proxy data leads the story: corn weakens from January to August while fertilizer pressure builds into June and financing stays above 5% through September.',
      'The synthetic margin-pressure example crosses the watch threshold in April and peaks in June, showing how those real inputs could be operationalized.',
    ],
  },
  {
    id: 'margin-story-response',
    eyebrow: 'Data Story 1B',
    title: 'Booking softened after pressure moved above the watch line',
    subtitle: 'The relationship becomes operational when pressure and booking behavior are visible together.',
    layout: 'analytics',
    tone: 'dark',
    chartStoryId: 'margin_pressure',
    chartPanelIds: ['margin-pressure', 'booking-behavior'],
    analyticsMode: 'compact',
    bullets: [
      'Pressure stays above watch from April through September.',
      'Booking softens after the break, turning this into an outreach-timing story.',
    ],
    speakerNotes: [
      'Original combined-slide title: Corn proxy fell 15% while fertilizer proxy rose to 114.',
      'Original fuller framing: Start with the real proxy signals, then use synthetic margin-pressure and booking examples to show how a co-op might translate that setup into action.',
      'The synthetic margin-pressure example crosses the watch threshold in April and peaks in June, showing how those real inputs could be operationalized.',
      'The synthetic booking example softens after the pressure example moves above the watch line, which turns the slide into an outreach-timing story.',
    ],
  },
  {
    id: 'margin-ai',
    eyebrow: 'AI Layer 1',
    title: 'AI can turn a margin story into an early-warning workflow',
    subtitle: 'This is the narrow, credible use case: summarize inputs, flag thresholds, prioritize outreach, and keep a human in the loop.',
    layout: 'process',
    tone: 'dark',
    steps: [
      {
        title: 'Summarize',
        detail: 'Pull market updates and local notes into one concise daily view instead of six disconnected sources.',
      },
      {
        title: 'Flag thresholds',
        detail: 'Detect when the margin story moved outside a normal operating range rather than just drifting a little.',
      },
      {
        title: 'Prioritize outreach',
        detail: 'Identify which member segments deserve a conversation first based on the combined signals.',
      },
      {
        title: 'Support action',
        detail: 'Prepare a suggested next conversation for staff to review, adjust, and send with local judgment.',
      },
    ],
  },
  {
    id: 'agronomy-story-weather',
    eyebrow: 'Data Story 2A',
    title: 'Heat and moisture shifts explain the first canopy stress window',
    subtitle:
      'Weather context comes first: hotter weeks and dry intervals set up the late-June decline.',
    layout: 'analytics',
    tone: 'dark',
    chartStoryId: 'precision_agronomy',
    chartPanelIds: ['temperature-deviation', 'precipitation-deviation'],
    analyticsMode: 'compact',
    bullets: [
      'Late-June heat moves well above normal while precipitation runs below trend ahead of the first NDVI drop.',
      'A strong July 1 rain week explains why the first stress cycle partly recovers.',
    ],
    speakerNotes: [
      'Original combined-slide title: NDVI fell to -0.07 before a rain-assisted early-July recovery.',
      'Original fuller framing: The chart now emphasizes the weather-to-canopy narrative: hot weeks and dry intervals precede the first NDVI decline, early-July rainfall supports recovery, and a second July window likely aligns with pollination and early grain fill.',
      'The late-June window plausibly aligns with late vegetative canopy growth, when hot and dry conditions can start to show up as canopy stress.',
      'The first NDVI drop is followed by a July 1 week with +2.32 inches of precipitation and a partial canopy recovery, so the heat-and-recovery narrative is supportable for the first stress cycle.',
    ],
  },
  {
    id: 'agronomy-story-response',
    eyebrow: 'Data Story 2B',
    title: 'NDVI and scout triage show where agronomists should look first',
    subtitle: 'The field response matters once the weather signal becomes a prioritization problem.',
    layout: 'analytics',
    tone: 'dark',
    chartStoryId: 'precision_agronomy',
    chartPanelIds: ['ndvi-anomaly', 'scout-attention'],
    analyticsMode: 'compact',
    bullets: [
      'NDVI bottoms near -0.07 before a partial recovery.',
      'The July 15 to July 29 wave is the stronger case for scout triage and human review.',
    ],
    speakerNotes: [
      'Original combined-slide title: NDVI fell to -0.07 before a rain-assisted early-July recovery.',
      'Original fuller framing: The chart now emphasizes the weather-to-canopy narrative: hot weeks and dry intervals precede the first NDVI decline, early-July rainfall supports recovery, and a second July window likely aligns with pollination and early grain fill.',
      'The first NDVI drop is followed by a July 1 week with +2.32 inches of precipitation and a partial canopy recovery, so the heat-and-recovery narrative is supportable for the first stress cycle.',
      'The stronger July 15 to July 29 window is more plausibly a pollination to early grain-fill problem, which makes scout triage more important than a generic anomaly alert.',
    ],
  },
  {
    id: 'agronomy-ai',
    eyebrow: 'AI Layer 2',
    title: 'AI can help triage attention across fields and agronomists',
    subtitle: 'The AI role is to accelerate pattern finding and note synthesis so agronomists can spend more time on field judgment.',
    layout: 'process',
    tone: 'accent',
    steps: [
      {
        title: 'Consolidate',
        detail: 'Combine imagery summaries, scouting notes, and lab results into one review surface.',
      },
      {
        title: 'Detect',
        detail: 'Flag field patterns that look unusual relative to local history or nearby fields.',
      },
      {
        title: 'Rank',
        detail: 'Help agronomists prioritize where to spend limited time first when many acres show stress at once.',
      },
      {
        title: 'Recommend',
        detail: 'Draft a human-checked recommendation that can enter the co-op workflow faster.',
      },
    ],
  },
  {
    id: 'logistics-story-ramp',
    eyebrow: 'Data Story 3A',
    title: 'Statewide harvest pace explains the first inbound pressure build',
    subtitle:
      'Start with the public anchor, then translate it into a local receipts inference.',
    layout: 'analytics',
    tone: 'dark',
    chartStoryId: 'grain_logistics',
    chartPanelIds: ['harvest-progress', 'daily-receipts'],
    analyticsMode: 'compact',
    bullets: [
      'Corn harvest rises from 11% to 97% statewide between September 30 and November 18.',
      'The synthetic receipts curve shows how that harvest ramp could stress one facility.',
    ],
    speakerNotes: [
      'Original combined-slide title: Corn harvest rose from 11% to 97% statewide.',
      'Original fuller framing: Lead with the real USDA crop-progress curve, then use synthetic receipts, turn-time, and capacity examples as location-level inferences from that harvest ramp.',
      'The real USDA series leads the slide: statewide corn harvest moves from 11% on September 30 to 97% by November 18.',
      'The receipts, turn-time, and capacity panels are synthetic inferences, included to show how a local facility could experience that statewide harvest ramp.',
    ],
  },
  {
    id: 'logistics-story-service',
    eyebrow: 'Data Story 3B',
    title: 'Turn time warns earlier than capacity does',
    subtitle: 'Member delay becomes visible before the site reaches its hardest storage constraint.',
    layout: 'analytics',
    tone: 'dark',
    chartStoryId: 'grain_logistics',
    chartPanelIds: ['turn-time', 'capacity'],
    analyticsMode: 'compact',
    bullets: [
      'The service signal crosses watch before capacity reaches hard-pressure territory.',
      'That makes truck delay the earlier intervention signal for staffing, routing, and communication.',
    ],
    speakerNotes: [
      'Original combined-slide title: Corn harvest rose from 11% to 97% statewide.',
      'Original fuller framing: Lead with the real USDA crop-progress curve, then use synthetic receipts, turn-time, and capacity examples as location-level inferences from that harvest ramp.',
      'The receipts, turn-time, and capacity panels are synthetic inferences, included to show how a local facility could experience that statewide harvest ramp.',
      'The synthetic service signal crosses its watch line before the synthetic capacity line reaches hard-pressure territory, which is why operations should watch member delay first.',
    ],
  },
  {
    id: 'logistics-ai',
    eyebrow: 'AI Layer 3',
    title: 'AI can support dispatch and exception handling before members feel the delay',
    subtitle: 'This is where AI helps operations teams surface thresholds, spot exceptions, and communicate earlier.',
    layout: 'process',
    tone: 'light',
    steps: [
      {
        title: 'Monitor',
        detail: 'Watch key logistics thresholds continuously without asking staff to babysit every dashboard.',
      },
      {
        title: 'Spot exceptions',
        detail: 'Detect patterns like rising turn time or unexpected moisture clusters sooner than manual review usually does.',
      },
      {
        title: 'Suggest options',
        detail: 'Prepare rerouting, staffing, or communication suggestions for dispatch and location managers.',
      },
      {
        title: 'Keep human control',
        detail: 'The operation still owns the decision because the consequence lands with members and employees, not the model.',
      },
    ],
  },
  {
    id: 'ai-leverage',
    eyebrow: 'Where AI Helps',
    title: 'The most credible uses of AI in co-ops are narrow and high-trust',
    subtitle: 'The examples above point to a consistent pattern: AI helps most when the job is bounded and the human owner is obvious.',
    layout: 'signal-grid',
    tone: 'accent',
    signals: [
      {
        title: 'Summarization',
        detail: 'Turn scattered notes, reports, and updates into a reviewable operating picture.',
        icon: BrainCircuit,
      },
      {
        title: 'Anomaly detection',
        detail: 'Notice unusual patterns across fields, markets, or logistics before they become expensive.',
        icon: TrendingUp,
      },
      {
        title: 'Prioritization',
        detail: 'Help teams decide what deserves attention first when the volume of signals spikes.',
        icon: Network,
      },
      {
        title: 'Recommendation support',
        detail: 'Prepare draft actions for humans to review instead of pushing autonomous decisions into the operation.',
        icon: BriefcaseBusiness,
      },
    ],
  },
  {
    id: 'readiness',
    eyebrow: 'Data Readiness',
    title: 'AI only works well after the signals are structured',
    subtitle: 'This is the operational discipline point: weak notes and fragmented systems produce weak AI outputs.',
    layout: 'two-column',
    tone: 'dark',
    leftTitle: 'What weak data habits look like',
    leftBullets: [
      'Different teams define the same metric differently',
      'Field notes live in disconnected places',
      'Operational thresholds are implied but undocumented',
      'No one can explain why a recommendation was made',
    ],
    rightTitle: 'What stronger operating discipline looks like',
    rightBullets: [
      'Shared definitions for the signals that matter',
      'Structured notes and visible ownership',
      'Clear thresholds for watch periods and exceptions',
      'Documented reasoning before action is taken',
    ],
  },
  {
    id: 'caution',
    eyebrow: 'Caution',
    title: 'AI will amplify whatever operating habits already exist',
    subtitle: 'If data is fragmented, goals are fuzzy, or ownership is unclear, automation spreads confusion faster.',
    layout: 'two-column',
    tone: 'warning',
    leftTitle: 'Weak habits AI scales',
    leftBullets: [
      'Unclear definitions of success',
      'Fragmented notes and disconnected systems',
      'Advice without documented reasoning',
      'Outputs no one reviews carefully',
    ],
    rightTitle: 'Better habits to scale first',
    rightBullets: [
      'Shared terms and operating metrics',
      'Structured notes and visible ownership',
      'Decision logs for major recommendations',
      'Human review before high-stakes action',
    ],
  },
  {
    id: 'timeline',
    eyebrow: 'Practical Playbook',
    title: 'A 12-month data-and-AI roadmap can stay simple',
    layout: 'timeline',
    tone: 'light',
    timeline: [
      {
        period: '0-90 days',
        title: 'Standardize the signals',
        detail: 'Choose a small set of agronomic, market, and operational indicators that leadership reviews consistently.',
      },
      {
        period: 'Quarter 2',
        title: 'Instrument one workflow',
        detail: 'Pick one decision process such as pricing outreach, agronomy follow-up, or dispatch exceptions and structure its signals.',
      },
      {
        period: 'Quarter 3',
        title: 'Add a digital layer',
        detail: 'Expose the workflow to staff with a simple interface that keeps context visible instead of hiding it in spreadsheets.',
      },
      {
        period: 'Quarter 4',
        title: 'Evaluate AI selectively',
        detail: 'Apply AI where summarization, pattern detection, or prioritization can save time without removing human accountability.',
      },
    ],
  },
  {
    id: 'takeaways',
    eyebrow: 'What to Remember',
    title: 'The near-term advantage for Iowa co-ops is earlier interpretation',
    layout: 'next-steps',
    tone: 'dark',
    bullets: [
      'Tell better operational stories with data, not more disconnected charts.',
      'Use AI where it assists judgment in narrow, high-trust workflows.',
      'Anchor every concept in a co-op example leaders and interns can recognize.',
      'Win by acting earlier, not by collecting more dashboards.',
    ],
  },
  {
    id: 'closing',
    eyebrow: 'Closing',
    title: 'Better questions lead to better timing',
    subtitle: 'The co-ops that interpret signals earlier will be the ones that use data and AI to serve members more effectively.',
    layout: 'closing',
    tone: 'hero',
  },
];

export const deckSignals = [
  { icon: Combine, label: 'Crop production' },
  { icon: Sprout, label: 'Agronomy service' },
  { icon: Warehouse, label: 'Storage + grain' },
  { icon: Fuel, label: 'Energy systems' },
  { icon: Network, label: 'Member relationships' },
  { icon: BrainCircuit, label: 'Decision support' },
  { icon: GraduationCap, label: 'Workforce pipeline' },
];
