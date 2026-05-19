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
  quote?: string;
  quoteAttribution?: string;
}

export const presentationMeta = {
  title: 'Iowa Agricultural Co-ops',
  subtitle: 'A data-and-AI narrative built around signals, thresholds, and co-op operating examples',
  audience: 'Agricultural professionals and interns',
  event: 'One-day Iowa co-op trends session',
  exportNote:
    'Slides are defined as structured content objects so the same source can later map into PowerPoint or PDF export workflows.',
};

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
    id: 'margin-story',
    eyebrow: 'Data Story 1',
    title: 'Margin pressure becomes clearer when signals are read together',
    subtitle: 'A single fertilizer chart is not the story. The stronger story combines input cost, crop price, credit cost, and booking behavior.',
    layout: 'signal-grid',
    tone: 'light',
    signals: [
      {
        title: 'Fertilizer price trend',
        detail: 'Input cost volatility changes the economics of the recommendation before the member ever asks about timing.',
        icon: HandCoins,
      },
      {
        title: 'Corn price trend',
        detail: 'Revenue expectations shape how much pricing pressure the operation can absorb.',
        icon: TrendingUp,
      },
      {
        title: 'Operating loan rate',
        detail: 'The cost of working capital changes the margin story even when the crop outlook looks steady.',
        icon: BriefcaseBusiness,
      },
      {
        title: 'Booking behavior',
        detail: 'Early or delayed commitments reveal how members are reacting before a sales report fully explains it.',
        icon: Users,
      },
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
    id: 'agronomy-story',
    eyebrow: 'Data Story 2',
    title: 'Precision agronomy is a data interpretation problem before it is an AI problem',
    subtitle: 'The value appears when imagery, tests, weather, and as-applied history become one coherent field story.',
    layout: 'signal-grid',
    tone: 'light',
    signals: [
      {
        title: 'Imagery variation',
        detail: 'Remote sensing shows where the field is diverging, but it does not explain why on its own.',
        icon: Satellite,
      },
      {
        title: 'Tissue test results',
        detail: 'Lab evidence turns a visible anomaly into a more defensible agronomic hypothesis.',
        icon: Sprout,
      },
      {
        title: 'Weather deviation',
        detail: 'Rainfall and temperature context help separate a temporary stress response from something more structural.',
        icon: MapPinned,
      },
      {
        title: 'As-applied history',
        detail: 'What was actually done in the field is often the missing context that changes the recommendation.',
        icon: Combine,
      },
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
    id: 'logistics-story',
    eyebrow: 'Data Story 3',
    title: 'Logistics becomes a service issue when the signal mix changes fast',
    subtitle: 'Receipts alone are not enough. The stronger operational story includes moisture, truck turns, and available capacity.',
    layout: 'signal-grid',
    tone: 'dark',
    signals: [
      {
        title: 'Daily receipts',
        detail: 'Volume is the obvious signal, but it rarely explains the whole service picture by itself.',
        icon: Warehouse,
      },
      {
        title: 'Average moisture',
        detail: 'Drying demand changes the pace at which volume can actually move through the system.',
        icon: Fuel,
      },
      {
        title: 'Truck cycle time',
        detail: 'Turn-time deterioration is often the earliest sign that the member experience is about to worsen.',
        icon: Route,
      },
      {
        title: 'Available bin capacity',
        detail: 'Capacity context distinguishes a busy day from a watch period that needs intervention.',
        icon: BarChart3,
      },
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