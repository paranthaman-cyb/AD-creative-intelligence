import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendDataPoint } from '../../types';
import { formatMetricValue, getMetricShortLabel } from '../../services/metrics/formatters';

type ChartMetric = 'ctr' | 'cvr' | 'cpc' | 'cpa';

export interface PerformanceLineChartProps {
  data: TrendDataPoint[];
  initialMetric?: ChartMetric;
}

export const PerformanceLineChart: React.FC<PerformanceLineChartProps> = ({
  data,
  initialMetric = 'ctr',
}) => {
  const [activeMetric, setActiveMetric] = useState<ChartMetric>(initialMetric);

  const metrics: { key: ChartMetric; label: string }[] = [
    { key: 'ctr', label: 'CTR' },
    { key: 'cvr', label: 'CVR' },
    { key: 'cpc', label: 'CPC' },
    { key: 'cpa', label: 'CPA' },
  ];

  const chartData = data.map((d) => ({
    name: d.dateOrIndex,
    value: d[activeMetric] !== null && d[activeMetric] !== undefined ? d[activeMetric] : 0,
    rawVal: d[activeMetric],
  }));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h4 className="text-sm font-semibold text-app-text">Performance Metrics</h4>
        <div className="flex items-center gap-1 bg-lavender-100 p-1 rounded-lg">
          {metrics.map((m) => (
            <button
              key={m.key}
              type="button"
              onClick={() => setActiveMetric(m.key)}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all select-none ${
                activeMetric === m.key
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'text-app-muted hover:text-app-text'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stop-color="#7C3AED" stop-opacity={0.3} />
                <stop offset="95%" stop-color="#7C3AED" stop-opacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0ECFC" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#6B6478"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#E7E2EF' }}
            />
            <YAxis
              stroke="#6B6478"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatMetricValue(v, activeMetric)}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-sidebar text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-white/10">
                      <p className="font-bold text-gray-300 mb-0.5">{item.name}</p>
                      <p className="font-semibold text-brand-100">
                        {getMetricShortLabel(activeMetric)}: {formatMetricValue(item.rawVal, activeMetric)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#6D28D9"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#purpleGradient)"
              activeDot={{ r: 6, fill: '#5B21B6', stroke: '#FFFFFF', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
