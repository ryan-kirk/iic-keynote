import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';

interface SignalChartProps {
  type?: 'simple' | 'threshold' | 'context' | 'events';
}

const data = [
  { year: '2008', foodImport: 12.1, capitalCost: 9.8, threshold: 15.0 },
  { year: '2009', foodImport: 13.2, capitalCost: 10.2, threshold: 15.0 },
  { year: '2010', foodImport: 14.8, capitalCost: 11.5, threshold: 15.0 },
  { year: '2011', foodImport: 16.2, capitalCost: 12.8, threshold: 15.0 },
  { year: '2012', foodImport: 17.1, capitalCost: 13.2, threshold: 15.0 },
  { year: '2013', foodImport: 16.8, capitalCost: 13.5, threshold: 15.0 },
  { year: '2014', foodImport: 15.9, capitalCost: 12.9, threshold: 15.0 },
  { year: '2015', foodImport: 14.2, capitalCost: 11.8, threshold: 15.0 },
  { year: '2016', foodImport: 15.8, capitalCost: 13.6, threshold: 15.0 },
  { year: '2017', foodImport: 16.4, capitalCost: 14.2, threshold: 15.0 },
  { year: '2018', foodImport: 15.6, capitalCost: 13.8, threshold: 15.0 },
  { year: '2019', foodImport: 14.1, capitalCost: 12.5, threshold: 15.0 },
  { year: '2020', foodImport: 13.8, capitalCost: 11.9, threshold: 15.0 },
  { year: '2021', foodImport: 12.9, capitalCost: 11.4, threshold: 15.0 },
  { year: '2022', foodImport: 12.5, capitalCost: 11.2, threshold: 15.0 },
  { year: '2023', foodImport: 13.1, capitalCost: 12.8, threshold: 15.0 },
  { year: '2024', foodImport: 13.9, capitalCost: 14.1, threshold: 15.0 },
];

const events = [
  { year: '2011', label: 'Food Price Spike' },
  { year: '2011', label: 'Horn Drought', offset: 20 },
  { year: '2014', label: 'Commodity Downturn' },
  { year: '2016', label: 'FX Pressure' },
  { year: '2018', label: 'Digital Ag Push' },
];

export function SignalChart({ type = 'simple' }: SignalChartProps) {
  return (
    <ResponsiveContainer width="100%" height={450}>
      <LineChart data={data} margin={{ top: 40, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="1 1" stroke="rgba(0,255,0,0.15)" />
        <XAxis
          dataKey="year"
          stroke="#00ff00"
          style={{ fontFamily: 'monospace', fontSize: '12px' }}
        />
        <YAxis
          stroke="#00ff00"
          style={{ fontFamily: 'monospace', fontSize: '12px' }}
          label={{ value: '% of Total Food Supply', angle: -90, position: 'insideLeft', fill: '#00ff00', style: { fontFamily: 'monospace' } }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#000',
            border: '1px solid #00ff00',
            borderRadius: '0',
            fontFamily: 'monospace',
            fontSize: '12px'
          }}
          labelStyle={{ color: '#00ff00' }}
        />

        {type === 'threshold' && (
          <ReferenceLine
            y={15.0}
            stroke="#ff0000"
            strokeWidth={2}
            strokeDasharray="3 3"
            label={{
              value: 'THRESHOLD: 15.0%',
              fill: '#ff0000',
              position: 'right',
              style: { fontFamily: 'monospace', fontSize: '11px' }
            }}
          />
        )}

        {type === 'context' && (
          <>
            <ReferenceLine y={15.0} stroke="#ff0000" strokeWidth={2} strokeDasharray="3 3" />
            <ReferenceArea x1="2011" x2="2014" fill="#ff0000" fillOpacity={0.1} label={{ value: 'PRESSURE_WINDOW_1', position: 'top', fill: '#ff0000', style: { fontFamily: 'monospace', fontSize: '10px' } }} />
            <ReferenceArea x1="2016" x2="2018" fill="#ff0000" fillOpacity={0.1} label={{ value: 'PRESSURE_WINDOW_2', position: 'bottom', fill: '#ff0000', style: { fontFamily: 'monospace', fontSize: '10px' } }} />
          </>
        )}

        {type === 'events' && (
          <>
            <ReferenceLine y={15.0} stroke="#ff0000" strokeWidth={2} strokeDasharray="3 3" />
            <ReferenceArea x1="2011" x2="2014" fill="#ff0000" fillOpacity={0.08} />
            <ReferenceArea x1="2016" x2="2018" fill="#ff0000" fillOpacity={0.08} />
            {events.map((event, i) => (
              <ReferenceLine
                key={i}
                x={event.year}
                stroke="#ffff00"
                strokeWidth={1}
                strokeDasharray="2 2"
                label={{
                  value: `[${event.label}]`,
                  fill: '#ffff00',
                  position: i % 2 === 0 ? 'top' : 'bottom',
                  style: { fontFamily: 'monospace', fontSize: '9px' }
                }}
              />
            ))}
          </>
        )}

        <Line
          type="monotone"
          dataKey="foodImport"
          stroke="#00ff00"
          strokeWidth={2}
          name="Imported Food Share %"
          dot={{ r: 3, fill: '#00ff00' }}
        />
        <Line
          type="monotone"
          dataKey="capitalCost"
          stroke="#00ffff"
          strokeWidth={2}
          name="Capital Cost Proxy %"
          dot={{ r: 3, fill: '#00ffff' }}
          strokeDasharray="3 3"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
