import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Slide } from './components/Slide';
import { TerminalSlide } from './components/TerminalSlide';
import { CodeBlock } from './components/CodeBlock';
import { WatchSignal } from './components/WatchSignal';
import { SlideNavigation } from './components/SlideNavigation';
import { SignalChart } from './components/SignalChart';
import { PopulationChart } from './components/PopulationChart';
import { SystemDiagram } from './components/SystemDiagram';
import { IconGrid } from './components/IconGrid';
import { FileDown, Presentation } from 'lucide-react';

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [printMode, setPrintMode] = useState(false);
  const totalSlides = 27;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (printMode) return;

      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, printMode]);

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (printMode) return;

    const target = e.target as HTMLElement;
    if (!target.closest('button') && !target.closest('a')) {
      nextSlide();
    }
  };

  const handlePrint = () => {
    setPrintMode(true);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const slides = [
    // Slide 1 - Title
    <Slide background="https://images.unsplash.com/photo-1543173733-4d4da8719a64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJb3dhJTIwZmFybWxhbmQlMjBhZXJpYWwlMjB2aWV3fGVufDF8fHx8MTc3ODg1OTQ2MHww&ixlib=rb-4.1.0&q=80&w=1080">
      <div className="text-center text-white space-y-8">
        <div className="inline-block bg-black/70 border border-green-500/30 px-12 py-8 backdrop-blur-sm">
          <h1 className="text-6xl text-green-400 font-mono">From Signals to Decisions</h1>
          <h2 className="text-2xl text-green-500/80 font-mono mt-4">Data, Geospatial, and AI in Agriculture</h2>
        </div>
        <div className="mt-16 text-xl text-white/80 font-mono">
          <p>Agriculture Conference 2026</p>
          <p className="mt-4 text-green-400">2026-05-15</p>
        </div>
      </div>
    </Slide>,

    // Slide 2 - Opening Question
    <TerminalSlide>
      <div className="text-center">
        <CodeBlock
          lines={[
            '',
            '',
            '        # Opening Question',
            '',
            '        How is agriculture actually changing?',
            '',
            '',
          ]}
          highlight={[4]}
        />
      </div>
    </TerminalSlide>,

    // Slide 3 - The Shift
    <TerminalSlide title="hypothesis --paradigm-shift">
      <div className="space-y-8">
        <CodeBlock
          lines={[
            '# THE SHIFT: Agriculture as an information system',
            '',
            'before = {',
            '    "system_type": "physical",',
            '    "limiting_factor": "land, labor, machinery",',
            '    "optimization": "inputs per acre"',
            '}',
            '',
            'after = {',
            '    "system_type": "informational",',
            '    "limiting_factor": "interpretation, not data availability",',
            '    "optimization": "signals to decisions"',
            '}',
            '',
            '# The constraint moved from "what can we see" to "what does it mean"',
          ]}
          highlight={[0, 10, 14]}
        />
      </div>
    </TerminalSlide>,

    // Slide 4 - Visual Hook
    <Slide background="https://images.unsplash.com/photo-1722082840106-c6508ee966ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxzYXRlbGxpdGUlMjBpbWFnZXJ5JTIwYWdyaWN1bHR1cmUlMjBoZWF0bWFwfGVufDF8fHx8MTc3ODg1OTQ2MHww&ixlib=rb-4.1.0&q=80&w=1080">
      <div className="text-center">
        <div className="inline-block bg-black/60 backdrop-blur-sm px-12 py-6 rounded-lg">
          <p className="text-white text-4xl">Same field, different outcomes</p>
        </div>
      </div>
    </Slide>,

    // Slide 5 - Core Idea
    <TerminalSlide>
      <div className="text-center space-y-8">
        <CodeBlock
          lines={[
            '',
            '',
            '        # The new constraint',
            '',
            '        limitation != "what we can see"',
            '        limitation == "how we interpret it"',
            '',
            '',
          ]}
          highlight={[4, 5]}
        />
        <p className="text-green-500/60 font-mono text-sm mt-8 italic">
          // Data abundance → interpretation scarcity
        </p>
      </div>
    </TerminalSlide>,

    // Slide 6 - Explosion of Data
    <TerminalSlide title="data --list-sources">
      <div className="space-y-8">
        <CodeBlock
          lines={[
            '# DATA SOURCES: The explosion',
            '',
            'sources = [',
            '    "remote_sensing",      # Satellite, drone imagery',
            '    "equipment_telemetry", # IoT sensors, GPS trackers',
            '    "climate_weather",     # Real-time meteorological data',
            '    "supply_chain",        # Logistics, inventory flows',
            '    "market_data"          # Prices, demand signals',
            ']',
            '',
            '// We have more data than ever.',
            '// Are we asking better questions?',
          ]}
          highlight={[0, 10, 11]}
        />
        <div className="mt-6">
          <IconGrid />
        </div>
      </div>
    </TerminalSlide>,

    // Slide 7 - Signals vs Single Metrics
    <TerminalSlide title="analysis --region=SSA --metric=food_security">
      <div className="space-y-6">
        <h2 className="text-2xl text-green-400 font-mono mb-6">$ ./analyze_signals.sh</h2>
        <SignalChart type="simple" />
        <div className="mt-6 font-mono text-green-500/70 text-xs space-y-1">
          <p>→ Signal 1: imported_food_share (% of total supply)</p>
          <p>→ Signal 2: capital_cost_proxy (lending rates: NG, ZA, KE avg)</p>
          <p className="text-green-300 mt-2">// Single metrics tell you WHAT. Relationships tell you WHY.</p>
        </div>
      </div>
    </TerminalSlide>,

    // Slide 8 - Framework Intro
    <TerminalSlide title="framework --define-methodology">
      <div className="space-y-8">
        <CodeBlock
          lines={[
            '# ANALYTICAL PROGRESSION: From signals to decisions',
            '',
            'pipeline = [',
            '    "1. OBSERVE   → What is happening in the data",',
            '    "2. MEASURE   → Set thresholds: when does it matter?",',
            '    "3. MODEL     → Detect patterns: sustained vs transient",',
            '    "4. ORCHESTRATE → Add context: what explains the pattern?"',
            ']',
            '',
            'output = "Better questions, not causal claims"',
            '',
            '# Each layer adds context.',
            '# Context transforms data into evidence.',
          ]}
          highlight={[0, 3, 4, 5, 6, 12]}
        />
        <div className="mt-8">
          <SystemDiagram type="progression" />
        </div>
      </div>
    </TerminalSlide>,

    // Slide 9 - Example: Signal Comparison
    <TerminalSlide title="observe --mode=raw_data">
      <div className="space-y-6">
        <CodeBlock
          lines={[
            '# OBSERVATION: What is happening',
            'data_range: 2008-2024',
            'region: Sub-Saharan Africa',
            'signals: [imported_food_share, capital_cost_proxy]',
            '',
            '// Two trends, moving together',
            '// But correlation ≠ causation',
            '// We need thresholds to know when it matters',
          ]}
          highlight={[0, 5, 7]}
        />
        <SignalChart type="simple" />
      </div>
    </TerminalSlide>,

    // Slide 10 - Threshold Concept
    <TerminalSlide title="measure --set-threshold=15.0">
      <div className="space-y-6">
        <CodeBlock
          lines={[
            '# THRESHOLD: When it matters',
            'threshold_value: 15.0%',
            'rationale: structural_dependency_vs_temporary_spike',
            '',
            'def is_pressure(imported_food_share):',
            '    return imported_food_share > 15.0',
            '',
            '// Crossing once? Maybe noise.',
            '// Sustained above threshold? System shift.',
          ]}
          highlight={[1, 4, 5, 8]}
        />
        <SignalChart type="threshold" />
      </div>
    </TerminalSlide>,

    // Slide 11 - Context Windows
    <TerminalSlide title="model --detect-windows --min-duration=2yr">
      <div className="space-y-6">
        <CodeBlock
          lines={[
            '# CONTEXT WINDOWS: Sustained pressure detection',
            '',
            'pressure_windows = [',
            '    {"period": "2011-2014", "duration": "3yr", "type": "structural"},',
            '    {"period": "2016-2018", "duration": "2yr", "type": "structural"}',
            ']',
            '',
            '// This is where context transforms data into evidence.',
            '// Not spikes. Sustained multi-year periods above threshold.',
            '// This tells us: the system changed, not just the weather.',
          ]}
          highlight={[0, 3, 4, 7, 9]}
        />
        <SignalChart type="context" />
      </div>
    </TerminalSlide>,

    // Slide 12 - Event Overlay
    <TerminalSlide title="orchestrate --overlay-events --source=historical_records">
      <div className="space-y-6">
        <CodeBlock
          lines={[
            '# EVENT OVERLAY: What may explain it',
            '',
            'events = {',
            '    "2011": ["Global food price spike", "Horn of Africa drought"],',
            '    "2014": ["Commodity market downturn"],',
            '    "2016": ["FX pressure across SSA economies"],',
            '    "2018": ["Policy push: mechanization + digital ag"]',
            '}',
            '',
            '// Events don\'t prove causation.',
            '// They help us ask better questions.',
          ]}
          highlight={[0, 3, 5, 9, 10]}
        />
        <SignalChart type="events" />
      </div>
    </TerminalSlide>,

    // Slide 13 - System Insight
    <TerminalSlide title="insight --generate-interpretation">
      <div className="space-y-6">
        <CodeBlock
          lines={[
            '# SYSTEM INSIGHT: Context creates meaningful evidence',
            '',
            'interpretation = {',
            '    "finding": "Two sustained pressure windows (2011-14, 2016-18)",',
            '    "evidence": "Not random spikes—structural shifts in food supply",',
            '    "context": "Aligned with global shocks + capital cost increases",',
            '    "implication": "Agricultural vulnerability linked to capital access",',
            '    "action": "Monitor 2024 trend (13.9%, rising toward threshold)"',
            '}',
            '',
            '# Without context: "Food imports went up"',
            '# With context: "System pressure + capital constraints = watch period"',
          ]}
          highlight={[0, 4, 6, 11]}
        />
        <SignalChart type="events" />
      </div>
    </TerminalSlide>,

    // Slide 14 - Current Watch Signal (NEW)
    <TerminalSlide title="alert --check-recent-trends --year=2024">
      <div className="space-y-6">
        <CodeBlock
          lines={[
            '# RECENT SIGNAL: 2024 Watch Period',
            '',
            'current_state = {',
            '    "imported_food_2022": 12.5,  # Below threshold',
            '    "imported_food_2024": 13.9,  # Rising toward 15.0',
            '    "capital_cost_2022": 11.2,',
            '    "capital_cost_2024": 14.1,   # Significant increase',
            '    "status": "WATCH"             # Not pressure window yet',
            '}',
            '',
            '# This is the power of context:',
            '# We\'re not waiting for crisis. We\'re watching early signals.',
            '# Better questions = earlier action.',
          ]}
          highlight={[0, 4, 7, 10, 11, 12]}
        />
        <div className="mt-8">
          <WatchSignal />
        </div>
      </div>
    </TerminalSlide>,

    // Slide 15 - Capital Context
    <Slide className="bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-white space-y-16">
        <h2 className="text-5xl text-center">Capital Context</h2>
        <SystemDiagram type="capital" />
        <p className="text-center text-xl text-white/60">Propagation beyond agriculture</p>
      </div>
    </Slide>,

    // Slide 16 - Population Pressure
    <Slide className="bg-slate-900">
      <div className="text-white space-y-8">
        <h2 className="text-4xl text-center">Population Pressure</h2>
        <PopulationChart />
        <p className="text-center text-2xl text-white/60">~680M → ~1.3B</p>
      </div>
    </Slide>,

    // Slide 17 - Key Insight
    <TerminalSlide>
      <div className="text-center space-y-8">
        <CodeBlock
          lines={[
            '',
            '',
            '        # CORE PRINCIPLE',
            '',
            '        Systems don\'t just grow',
            '        They experience pressure',
            '',
            '',
          ]}
          highlight={[4, 5]}
        />
        <p className="text-green-500/60 font-mono text-sm mt-8 italic">
          // Growth metrics miss the strain signals
        </p>
      </div>
    </TerminalSlide>,

    // Slide 18 - Geospatial Importance
    <Slide background="https://images.unsplash.com/photo-1508175688576-0c076b47b5b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlbGxpdGUlMjBpbWFnZXJ5JTIwYWdyaWN1bHR1cmUlMjBoZWF0bWFwfGVufDF8fHx8MTc3ODg1OTQ2MHww&ixlib=rb-4.1.0&q=80&w=1080">
      <div className="text-center">
        <div className="inline-block bg-black/80 border border-green-500/30 px-12 py-8 font-mono">
          <p className="text-green-400 text-4xl">$ echo "Everything is spatial"</p>
          <p className="text-green-500/60 text-sm mt-4">// Aggregate metrics hide geographic variance</p>
        </div>
      </div>
    </Slide>,

    // Slide 19 - AI Role
    <TerminalSlide title="ai --role-in-analysis">
      <div className="space-y-8">
        <CodeBlock
          lines={[
            '# AI PIPELINE: Pattern recognition at scale',
            '',
            'class AgAnalytics:',
            '    def pipeline(self, data):',
            '        patterns = self.detect_patterns(data)    # Find relationships',
            '        forecast = self.predict_trends(patterns)  # Project forward',
            '        support = self.generate_insights(forecast) # Inform decisions',
            '        return support',
            '',
            'capabilities = [',
            '    "Multi-signal pattern recognition",',
            '    "Temporal trend detection",',
            '    "Decision support (not decision making)"',
            ']',
          ]}
          highlight={[0, 4, 5, 6, 12]}
        />
        <div className="flex items-center justify-center gap-4 mt-8 font-mono text-green-400">
          <span className="border border-green-500/30 px-6 py-3 bg-green-500/5">Data</span>
          <span>→</span>
          <span className="border border-green-500/30 px-6 py-3 bg-green-500/5">Model</span>
          <span>→</span>
          <span className="border border-green-500/30 px-6 py-3 bg-green-500/5">Decision Support</span>
        </div>
      </div>
    </TerminalSlide>,

    // Slide 20 - Caution
    <TerminalSlide title="warning --ai-limitations">
      <div className="space-y-8">
        <div className="border border-red-500/50 bg-red-500/5 p-8">
          <CodeBlock
            lines={[
              '# CRITICAL WARNING',
              '',
              'ai_risk = {',
              '    "capability": "Pattern recognition at scale",',
              '    "limitation": "AI amplifies your assumptions",',
              '    "danger": "Confident predictions ≠ accurate predictions",',
              '    "mitigation": "Validate signals before acting"',
              '}',
              '',
              '# AI makes you faster.',
              '# It doesn\'t make you right.',
            ]}
            highlight={[0, 4, 5, 10]}
          />
        </div>
        <p className="text-red-400/80 font-mono text-sm text-center">
          Decision risk increases when confidence exceeds validation
        </p>
      </div>
    </TerminalSlide>,

    // Slide 21 - Barnum Effect
    <Slide className="bg-slate-900">
      <div className="text-center text-white space-y-12">
        <h2 className="text-5xl">"We believe what sounds specific"</h2>
        <p className="text-2xl text-white/60 italic">Forer (1948)</p>
      </div>
    </Slide>,

    // Slide 22 - Co-op Opportunity
    <Slide className="bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-white space-y-16">
        <h2 className="text-5xl text-center">Co-op Opportunity</h2>
        <SystemDiagram type="coop" />
      </div>
    </Slide>,

    // Slide 23 - Practical Applications
    <Slide className="bg-slate-900">
      <div className="text-white space-y-12">
        <h2 className="text-5xl text-center">Practical Applications</h2>
        <ul className="text-3xl space-y-6 max-w-3xl mx-auto">
          <li className="flex items-start gap-4">
            <span className="text-green-400">•</span>
            <span>Inventory forecasting</span>
          </li>
          <li className="flex items-start gap-4">
            <span className="text-green-400">•</span>
            <span>Precision agronomy</span>
          </li>
          <li className="flex items-start gap-4">
            <span className="text-green-400">•</span>
            <span>Logistics optimization</span>
          </li>
          <li className="flex items-start gap-4">
            <span className="text-green-400">•</span>
            <span>Energy coordination</span>
          </li>
        </ul>
      </div>
    </Slide>,

    // Slide 24 - Intern Takeaway
    <Slide className="bg-gradient-to-br from-blue-900/30 to-slate-900">
      <div className="text-white space-y-12">
        <h2 className="text-5xl text-center">Intern Takeaway</h2>
        <p className="text-4xl text-center text-blue-300">Learn to ask better questions</p>
        <ul className="text-2xl space-y-6 max-w-2xl mx-auto mt-16">
          <li className="flex items-start gap-4">
            <span className="text-blue-400">•</span>
            <span>Think in systems</span>
          </li>
          <li className="flex items-start gap-4">
            <span className="text-blue-400">•</span>
            <span>Use data as context</span>
          </li>
          <li className="flex items-start gap-4">
            <span className="text-blue-400">•</span>
            <span>Focus on signals, not noise</span>
          </li>
        </ul>
      </div>
    </Slide>,

    // Slide 25 - Executive Takeaway
    <Slide className="bg-gradient-to-br from-green-900/30 to-slate-900">
      <div className="text-white space-y-12">
        <h2 className="text-5xl text-center">Executive Takeaway</h2>
        <p className="text-4xl text-center text-green-300">Better decisions come from better interpretation</p>
        <ul className="text-2xl space-y-6 max-w-2xl mx-auto mt-16">
          <li className="flex items-start gap-4">
            <span className="text-green-400">•</span>
            <span>Validate signals</span>
          </li>
          <li className="flex items-start gap-4">
            <span className="text-green-400">•</span>
            <span>Understand thresholds</span>
          </li>
          <li className="flex items-start gap-4">
            <span className="text-green-400">•</span>
            <span>Add context before acting</span>
          </li>
        </ul>
      </div>
    </Slide>,

    // Slide 26 - Closing Thought
    <TerminalSlide>
      <div className="text-center space-y-8">
        <CodeBlock
          lines={[
            '',
            '',
            '',
            '        if better_questions > more_data:',
            '            return True',
            '',
            '',
            '',
          ]}
          highlight={[3, 4]}
        />
        <p className="text-green-500/60 font-mono text-sm mt-12 italic">
          // Context transforms information into insight
        </p>
      </div>
    </TerminalSlide>,

    // Slide 27 - Thank You
    <TerminalSlide>
      <div className="text-center space-y-8">
        <CodeBlock
          lines={[
            '',
            '',
            '        # Thank you',
            '',
            '        $ questions --open-discussion',
            '',
            '',
          ]}
          highlight={[2, 4]}
        />
        <p className="text-green-500/60 font-mono text-xs mt-8">
          [Session ready for Q&A]
        </p>
      </div>
    </TerminalSlide>,
  ];

  if (printMode) {
    return (
      <div className="w-full bg-black print-mode">
        <style>{`
          @media print {
            @page {
              size: landscape;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
            }
            .print-slide {
              page-break-after: always;
              page-break-inside: avoid;
            }
            .no-print {
              display: none !important;
            }
          }
        `}</style>

        <div className="no-print fixed top-4 right-4 z-50 flex gap-4">
          <button
            onClick={() => setPrintMode(false)}
            className="px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg text-white flex items-center gap-2"
          >
            <Presentation size={20} />
            Back to Presentation
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white flex items-center gap-2"
          >
            <FileDown size={20} />
            Print / Save as PDF
          </button>
        </div>

        {slides.map((slide, index) => (
          <div key={index} className="print-slide">
            {slide}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black overflow-hidden" onClick={handleClick}>
      <div className="no-print fixed top-4 right-4 z-50">
        <button
          onClick={() => setPrintMode(true)}
          className="px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg text-white flex items-center gap-2"
        >
          <FileDown size={20} />
          Export to PDF
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          {slides[currentSlide]}
        </motion.div>
      </AnimatePresence>

      <SlideNavigation
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        onNext={nextSlide}
        onPrev={prevSlide}
      />
    </div>
  );
}