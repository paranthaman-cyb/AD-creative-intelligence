import { Finding } from '../../types';
import { formatEffectSize, formatConfidenceInterval } from '../metrics/formatters';

function escapeCsvCell(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Serializes findings to a clean, downloadable CSV string.
 */
export function exportFindingsToCsv(findings: Finding[]): string {
  const headers = [
    'Rank',
    'Attribute',
    'Metric',
    'Status',
    'Effect Size',
    '95% Confidence Interval',
    'Sample Size (Creatives)',
    'Comparison Group A',
    'Group A Rate',
    'Comparison Group B',
    'Group B Rate',
    'Summary',
    'Method',
    'Limitations',
  ];

  const rows = findings.map((f, index) => {
    return [
      escapeCsvCell(index + 1),
      escapeCsvCell(f.attributeLabel),
      escapeCsvCell(f.metric.toUpperCase()),
      escapeCsvCell(f.status.toUpperCase()),
      escapeCsvCell(formatEffectSize(f.effectSize, f.metric)),
      escapeCsvCell(formatConfidenceInterval(f.confidenceInterval, f.metric)),
      escapeCsvCell(f.sampleSize),
      escapeCsvCell(f.groupLabels[0] || 'Group A'),
      escapeCsvCell(f.groupValues[0] !== undefined ? `${(f.groupValues[0] * 100).toFixed(2)}%` : '—'),
      escapeCsvCell(f.groupLabels[1] || 'Group B'),
      escapeCsvCell(f.groupValues[1] !== undefined ? `${(f.groupValues[1] * 100).toFixed(2)}%` : '—'),
      escapeCsvCell(f.summary),
      escapeCsvCell(f.method),
      escapeCsvCell(f.limitations.join('; ')),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
}

/**
 * Triggers a browser download of the generated CSV file.
 */
export function downloadCsvFile(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
