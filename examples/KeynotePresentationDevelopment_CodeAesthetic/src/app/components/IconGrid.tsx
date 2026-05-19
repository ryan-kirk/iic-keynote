import { Satellite, Activity, Cloud, Truck, TrendingUp } from 'lucide-react';

const dataTypes = [
  { icon: Satellite, label: 'Remote sensing', color: 'text-blue-400' },
  { icon: Activity, label: 'Equipment telemetry', color: 'text-green-400' },
  { icon: Cloud, label: 'Climate + weather', color: 'text-purple-400' },
  { icon: Truck, label: 'Supply chain data', color: 'text-yellow-400' },
  { icon: TrendingUp, label: 'Markets', color: 'text-red-400' },
];

export function IconGrid() {
  return (
    <div className="grid grid-cols-5 gap-8">
      {dataTypes.map(({ icon: Icon, label, color }) => (
        <div key={label} className="flex flex-col items-center gap-4 text-center">
          <div className={`${color}`}>
            <Icon size={64} strokeWidth={1.5} />
          </div>
          <span className="text-white text-sm">{label}</span>
        </div>
      ))}
    </div>
  );
}
