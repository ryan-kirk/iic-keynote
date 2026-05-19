import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Slide } from './components/Slide';
import { SlideNavigation } from './components/SlideNavigation';
import { SignalChart } from './components/SignalChart';
import { PopulationChart } from './components/PopulationChart';
import { SystemDiagram } from './components/SystemDiagram';
import { IconGrid } from './components/IconGrid';

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 26;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
  }, [currentSlide]);

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
    const target = e.target as HTMLElement;
    if (!target.closest('button') && !target.closest('a')) {
      nextSlide();
    }
  };

  const slides = [
    // Slide 1 - Title
    <Slide background="https://images.unsplash.com/photo-1543173733-4d4da8719a64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxJb3dhJTIwZmFybWxhbmQlMjBhZXJpYWwlMjB2aWV3fGVufDF8fHx8MTc3ODg1OTQ2MHww&ixlib=rb-4.1.0&q=80&w=1080">
      <div className="text-center text-white space-y-8">
        <h1 className="text-7xl">From Signals to Decisions</h1>
        <h2 className="text-4xl text-white/80">Data, Geospatial, and AI in Agriculture</h2>
        <div className="mt-16 text-2xl text-white/60">
          <p>Agriculture Conference 2026</p>
          <p className="mt-4">May 15, 2026</p>
        </div>
      </div>
    </Slide>,

    // Slide 2 - Opening Question
    <Slide className="bg-slate-900">
      <div className="text-center text-white">
        <h2 className="text-6xl">How is agriculture actually changing?</h2>
      </div>
    </Slide>,

    // Slide 3 - The Shift
    <Slide className="bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center text-white space-y-12">
        <h2 className="text-6xl">Agriculture: Physical → Informational System</h2>
        <div className="grid grid-cols-2 gap-16 mt-16">
          <div className="space-y-4">
            <div className="text-8xl">🚜</div>
            <p className="text-3xl text-white/60">Physical</p>
          </div>
          <div className="space-y-4">
            <div className="text-8xl">📊</div>
            <p className="text-3xl text-white/60">Informational</p>
          </div>
        </div>
      </div>
    </Slide>,

    // Slide 4 - Visual Hook
    <Slide background="https://images.unsplash.com/photo-1722082840106-c6508ee966ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxzYXRlbGxpdGUlMjBpbWFnZXJ5JTIwYWdyaWN1bHR1cmUlMjBoZWF0bWFwfGVufDF8fHx8MTc3ODg1OTQ2MHww&ixlib=rb-4.1.0&q=80&w=1080">
      <div className="text-center">
        <div className="inline-block bg-black/60 backdrop-blur-sm px-12 py-6 rounded-lg">
          <p className="text-white text-4xl">Same field, different outcomes</p>
        </div>
      </div>
    </Slide>,

    // Slide 5 - Core Idea
    <Slide className="bg-slate-900">
      <div className="text-center text-white space-y-8">
        <h2 className="text-6xl">We are no longer limited by what we can see</h2>
        <p className="text-4xl text-white/60 mt-12">We are limited by how we interpret it</p>
      </div>
    </Slide>,

    // Slide 6 - Explosion of Data
    <Slide className="bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-white space-y-16">
        <h2 className="text-5xl text-center">Explosion of Data</h2>
        <IconGrid />
      </div>
    </Slide>,

    // Slide 7 - Signals vs Single Metrics
    <Slide className="bg-slate-900">
      <div className="text-white space-y-8">
        <h2 className="text-4xl text-center">Signals vs Single Metrics</h2>
        <SignalChart type="simple" />
        <p className="text-center text-2xl text-white/60">Single metric vs interaction</p>
      </div>
    </Slide>,

    // Slide 8 - Framework Intro
    <Slide className="bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-white space-y-16">
        <h2 className="text-5xl text-center">Our Framework</h2>
        <SystemDiagram type="progression" />
        <div className="flex justify-between text-lg text-white/60 px-8">
          <span>What is happening</span>
          <span>Quantify signals</span>
          <span>Understand relationships</span>
          <span>Drive decisions</span>
        </div>
      </div>
    </Slide>,

    // Slide 9 - Example: Signal Comparison
    <Slide className="bg-slate-900">
      <div className="text-white space-y-8">
        <h2 className="text-4xl text-center">Signal Comparison</h2>
        <SignalChart type="simple" />
        <p className="text-center text-xl text-white/60">What is happening</p>
      </div>
    </Slide>,

    // Slide 10 - Threshold Concept
    <Slide className="bg-slate-900">
      <div className="text-white space-y-8">
        <h2 className="text-4xl text-center">Thresholds</h2>
        <SignalChart type="threshold" />
        <p className="text-center text-xl text-white/60">When it matters</p>
      </div>
    </Slide>,

    // Slide 11 - Context Windows
    <Slide className="bg-slate-900">
      <div className="text-white space-y-8">
        <h2 className="text-4xl text-center">Context Windows</h2>
        <SignalChart type="context" />
        <p className="text-center text-xl text-white/60">Sustained pressure, not spikes</p>
      </div>
    </Slide>,

    // Slide 12 - Event Overlay
    <Slide className="bg-slate-900">
      <div className="text-white space-y-8">
        <h2 className="text-4xl text-center">Event Overlay</h2>
        <SignalChart type="events" />
        <p className="text-center text-xl text-white/60">What may explain it</p>
      </div>
    </Slide>,

    // Slide 13 - System Insight
    <Slide className="bg-slate-900">
      <div className="text-white space-y-8">
        <h2 className="text-4xl text-center">System Insight</h2>
        <SignalChart type="events" />
        <p className="text-center text-2xl text-green-400 mt-8">What changed—and why it matters</p>
      </div>
    </Slide>,

    // Slide 14 - Capital Context
    <Slide className="bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-white space-y-16">
        <h2 className="text-5xl text-center">Capital Context</h2>
        <SystemDiagram type="capital" />
        <p className="text-center text-xl text-white/60">Propagation beyond agriculture</p>
      </div>
    </Slide>,

    // Slide 15 - Population Pressure
    <Slide className="bg-slate-900">
      <div className="text-white space-y-8">
        <h2 className="text-4xl text-center">Population Pressure</h2>
        <PopulationChart />
        <p className="text-center text-2xl text-white/60">~680M → ~1.3B</p>
      </div>
    </Slide>,

    // Slide 16 - Key Insight
    <Slide className="bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center text-white">
        <h2 className="text-6xl leading-tight">Systems don't just grow — they experience pressure</h2>
      </div>
    </Slide>,

    // Slide 17 - Geospatial Importance
    <Slide background="https://images.unsplash.com/photo-1508175688576-0c076b47b5b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXRlbGxpdGUlMjBpbWFnZXJ5JTIwYWdyaWN1bHR1cmUlMjBoZWF0bWFwfGVufDF8fHx8MTc3ODg1OTQ2MHww&ixlib=rb-4.1.0&q=80&w=1080">
      <div className="text-center">
        <div className="inline-block bg-black/60 backdrop-blur-sm px-12 py-8 rounded-lg">
          <p className="text-white text-5xl">Everything is spatial</p>
        </div>
      </div>
    </Slide>,

    // Slide 18 - AI Role
    <Slide className="bg-slate-900">
      <div className="text-white space-y-12">
        <h2 className="text-5xl text-center">AI Role</h2>
        <div className="flex items-center justify-center gap-8">
          <div className="bg-blue-500/20 border-2 border-blue-500 px-12 py-8 rounded-lg text-center min-w-[200px]">
            <p className="text-2xl">Data</p>
          </div>
          <div className="text-4xl">→</div>
          <div className="bg-green-500/20 border-2 border-green-500 px-12 py-8 rounded-lg text-center min-w-[200px]">
            <p className="text-2xl">Model</p>
          </div>
          <div className="text-4xl">→</div>
          <div className="bg-purple-500/20 border-2 border-purple-500 px-12 py-8 rounded-lg text-center min-w-[200px]">
            <p className="text-2xl">Decision</p>
          </div>
        </div>
        <ul className="text-2xl space-y-4 text-center text-white/80 mt-16">
          <li>Pattern recognition</li>
          <li>Prediction</li>
          <li>Decision support</li>
        </ul>
      </div>
    </Slide>,

    // Slide 19 - Caution
    <Slide className="bg-gradient-to-br from-red-900/30 to-slate-900">
      <div className="text-center text-white space-y-8">
        <h2 className="text-6xl text-red-400">AI amplifies assumptions</h2>
        <p className="text-2xl text-white/60 mt-12">Decision risk in real-world systems</p>
      </div>
    </Slide>,

    // Slide 20 - Barnum Effect
    <Slide className="bg-slate-900">
      <div className="text-center text-white space-y-12">
        <h2 className="text-5xl">"We believe what sounds specific"</h2>
        <p className="text-2xl text-white/60 italic">Forer (1948)</p>
      </div>
    </Slide>,

    // Slide 21 - Co-op Opportunity
    <Slide className="bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-white space-y-16">
        <h2 className="text-5xl text-center">Co-op Opportunity</h2>
        <SystemDiagram type="coop" />
      </div>
    </Slide>,

    // Slide 22 - Practical Applications
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

    // Slide 23 - Intern Takeaway
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

    // Slide 24 - Executive Takeaway
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

    // Slide 25 - Closing Thought
    <Slide className="bg-gradient-to-br from-slate-900 to-black">
      <div className="text-center text-white">
        <h2 className="text-7xl">Better questions &gt; more data</h2>
      </div>
    </Slide>,

    // Slide 26 - Thank You
    <Slide className="bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center text-white space-y-12">
        <h2 className="text-6xl">Thank You</h2>
        <p className="text-3xl text-white/60">Questions & Discussion</p>
      </div>
    </Slide>,
  ];

  return (
    <div className="w-full h-screen bg-black overflow-hidden" onClick={handleClick}>
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