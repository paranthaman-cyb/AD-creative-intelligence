import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Finding } from '../../types';

export interface EvidenceDonutChartProps {
  findings: Finding[];
}

export const EvidenceDonutChart: React.FC<EvidenceDonutChartProps> = ({ findings }) => {
  const supportedCount = findings.filter((f) => f.status === 'supported').length;
  const inconclusiveCount = findings.filter((f) => f.status === 'inconclusive').length;
  const underpoweredCount = findings.filter((f) => f.status === 'underpowered').length;
  const notAvailableCount = findings.filter((f) => f.status === 'not_available').length;
  const total = findings.length || 1;

  const data = [
    { name: 'Supported', value: supportedCount, color: '#16865B', pct: Math.round((supportedCount / total) * 100) },
    { name: 'Inconclusive', value: inconclusiveCount, color: '#A66A00', pct: Math.round((inconclusiveCount / total) * 100) },
    { name: 'Underpowered', value: underpoweredCount, color: '#7C3AED', pct: Math.round((underpoweredCount / total) * 100) },
    ...(notAvailableCount > 0
      ? [{ name: 'Not analyzable', value: notAvailableCount, color: '#9CA3AF', pct: Math.round((notAvailableCount / total) * 100) }]
      : []),
  ];

  return (
    <div className="w-full">
      <h4 className="text-sm font-semibold text-app-text mb-2">Evidence Summary</h4>

      <div className="flex items-center gap-4 flex-col sm:flex-row">
        {/* Donut Chart with Center Text */}
        <div className="relative w-40 h-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-app-text">{findings.length}</span>
            <span className="text-[10px] font-semibold text-app-muted uppercase tracking-wider">Findings</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col space-y-2.5 w-full text-xs">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-medium text-app-text">{item.name}</span>
              </div>
              <span className="font-semibold text-app-muted">
                {item.value} <span className="text-[11px] font-normal text-app-muted/80">({item.pct}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
