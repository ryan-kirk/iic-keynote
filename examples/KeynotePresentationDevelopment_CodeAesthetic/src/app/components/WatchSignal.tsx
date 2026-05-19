export function WatchSignal() {
  return (
    <div className="border border-yellow-500/50 bg-yellow-500/5 p-6 font-mono">
      <div className="flex items-start gap-4">
        <div className="text-yellow-500 text-2xl">⚠</div>
        <div className="flex-1 space-y-3">
          <div className="text-yellow-400 font-bold">WATCH SIGNAL DETECTED</div>
          <div className="text-green-500/80 text-sm space-y-1">
            <p>→ 2022: 12.5% (below threshold)</p>
            <p>→ 2024: 13.9% (approaching threshold)</p>
            <p>→ Capital costs: 11.2% → 14.1%</p>
          </div>
          <div className="text-yellow-300/90 text-sm mt-4">
            Status: Watch period triggered at 13.5% (not formal pressure window)
          </div>
          <div className="text-green-400/70 text-xs mt-3 italic">
            // Rising trend + capital stress = early warning signal
          </div>
        </div>
      </div>
    </div>
  );
}
