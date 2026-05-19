import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { year: '1950', population: 680 },
  { year: '1970', population: 800 },
  { year: '1990', population: 950 },
  { year: '2010', population: 1100 },
  { year: '2026', population: 1300 },
];

export function PopulationChart() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <defs>
          <linearGradient id="populationGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4dabf7" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#4dabf7" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis dataKey="year" stroke="#fff" />
        <YAxis stroke="#fff" label={{ value: 'Population (millions)', angle: -90, position: 'insideLeft', fill: '#fff' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(0,0,0,0.8)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px'
          }}
          formatter={(value: number) => [`${value}M`, 'Population']}
        />
        <Area type="monotone" dataKey="population" stroke="#4dabf7" strokeWidth={3} fill="url(#populationGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
