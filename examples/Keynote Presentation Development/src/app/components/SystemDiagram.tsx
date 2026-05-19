import { ArrowRight } from 'lucide-react';

interface FlowNode {
  label: string;
  color: string;
}

interface SystemDiagramProps {
  type?: 'progression' | 'capital' | 'coop';
}

export function SystemDiagram({ type = 'progression' }: SystemDiagramProps) {
  const progressionNodes: FlowNode[] = [
    { label: 'Observe', color: 'bg-blue-500' },
    { label: 'Measure', color: 'bg-green-500' },
    { label: 'Model', color: 'bg-yellow-500' },
    { label: 'Orchestrate', color: 'bg-purple-500' },
  ];

  const capitalNodes: FlowNode[] = [
    { label: 'Agriculture', color: 'bg-green-500' },
    { label: 'FX Reserves', color: 'bg-blue-500' },
    { label: 'Debt Service', color: 'bg-yellow-500' },
    { label: 'Borrowing Costs', color: 'bg-red-500' },
  ];

  const nodes = type === 'capital' ? capitalNodes : progressionNodes;

  if (type === 'coop') {
    return (
      <div className="flex items-center justify-center">
        <div className="relative w-96 h-96">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-green-500/20 border-4 border-green-500 flex items-center justify-center">
            <span className="text-white text-xl">Co-op</span>
          </div>

          {['Agronomy', 'Logistics', 'Energy', 'Farmers'].map((label, i) => {
            const angle = (i * Math.PI * 2) / 4 - Math.PI / 2;
            const x = Math.cos(angle) * 140;
            const y = Math.sin(angle) * 140;

            return (
              <div
                key={label}
                className="absolute top-1/2 left-1/2 w-24 h-24 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-white text-center text-sm"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                }}
              >
                {label}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-4">
      {nodes.map((node, index) => (
        <div key={node.label} className="flex items-center gap-4">
          <div className={`${node.color} px-8 py-6 rounded-lg text-white text-center min-w-[160px]`}>
            <div className="text-xl">{node.label}</div>
          </div>
          {index < nodes.length - 1 && (
            <ArrowRight className="w-8 h-8 text-white/50" />
          )}
        </div>
      ))}
    </div>
  );
}
