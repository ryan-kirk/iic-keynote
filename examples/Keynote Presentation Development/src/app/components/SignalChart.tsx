import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart, ReferenceArea } from 'recharts';

interface SignalChartProps {
  type?: 'simple' | 'threshold' | 'context' | 'events';
}

const data = [
  { month: 'Jan', yield: 65, rainfall: 45, threshold: 50 },
  { month: 'Feb', yield: 59, rainfall: 52, threshold: 50 },
  { month: 'Mar', yield: 80, rainfall: 78, threshold: 50 },
  { month: 'Apr', yield: 81, rainfall: 85, threshold: 50 },
  { month: 'May', yield: 56, rainfall: 42, threshold: 50 },
  { month: 'Jun', yield: 55, rainfall: 38, threshold: 50 },
  { month: 'Jul', yield: 40, rainfall: 25, threshold: 50 },
  { month: 'Aug', yield: 65, rainfall: 55, threshold: 50 },
  { month: 'Sep', yield: 75, rainfall: 68, threshold: 50 },
  { month: 'Oct', yield: 82, rainfall: 72, threshold: 50 },
];

const events = [
  { month: 'Apr', label: 'Planting' },
  { month: 'Jul', label: 'Drought' },
  { month: 'Oct', label: 'Harvest' },
];

export function SignalChart({ type = 'simple' }: SignalChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="month" stroke="#fff" />
        <YAxis stroke="#fff" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px'
          }}
        />

        {type === 'threshold' && (
          <ReferenceLine y={50} stroke="#ff6b6b" strokeWidth={2} strokeDasharray="5 5" label={{ value: 'Threshold', fill: '#ff6b6b', position: 'right' }} />
        )}

        {type === 'context' && (
          <>
            <ReferenceLine y={50} stroke="#ff6b6b" strokeWidth={2} strokeDasharray="5 5" />
            <ReferenceArea x1="May" x2="Jul" fill="#ff6b6b" fillOpacity={0.1} label={{ value: 'Sustained Pressure', position: 'top' }} />
          </>
        )}

        {type === 'events' && (
          <>
            <ReferenceLine y={50} stroke="#ff6b6b" strokeWidth={2} strokeDasharray="5 5" />
            {events.map((event, i) => (
              <ReferenceLine key={i} x={event.month} stroke="#51cf66" strokeWidth={2} label={{ value: event.label, fill: '#51cf66', position: 'top' }} />
            ))}
          </>
        )}

        <Line type="monotone" dataKey="yield" stroke="#4dabf7" strokeWidth={3} name="Yield Index" dot={{ r: 4 }} />
        <Line type="monotone" dataKey="rainfall" stroke="#51cf66" strokeWidth={3} name="Rainfall" dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
