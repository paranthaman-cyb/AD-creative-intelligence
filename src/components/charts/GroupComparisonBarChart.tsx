import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { formatPercent, getMetricShortLabel } from '../../services/metrics/formatters';
import { MetricKey } from '../../types';

export interface GroupComparisonBarChartProps {
  groupLabels: string[];
  groupValues: number[];
  metric: MetricKey;
}

export const GroupComparisonBarChart: React.FC<GroupComparisonBarChartProps> = ({
  groupLabels,
  groupValues,
  metric,
}) => {
  const data = groupLabels.map((label, idx) => ({
    name: label,
    value: groupValues[idx] || 0,
  }));

  const colors = ['#D4CBEE', '#7C3AED'];

  return (
    <div className="w-full">
      <h4 className="text-sm font-semibold text-app-text mb-3">Group Comparison</h4>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
            <XAxis
              dataKey="name"
              stroke="#6B6478"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#E7E2EF' }}
            />
            <YAxis
              stroke="#6B6478"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatPercent(v, 0)}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-sidebar text-white text-xs px-3 py-2 rounded-lg shadow-lg">
                      <p className="font-semibold text-brand-100">{item.name}</p>
                      <p className="font-bold text-white">
                        {getMetricShortLabel(metric)}: {formatPercent(item.value, 1)}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={60}>
              {data.map((_, index) => (
                <Cell key={`bar-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
