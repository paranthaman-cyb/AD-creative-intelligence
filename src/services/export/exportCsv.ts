import { Finding, Creative, PerformanceRecord } from '../../types';
import { formatEffectSize, formatConfidenceInterval, formatMetricValue } from '../metrics/formatters';

function escapeCsvCell(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Output A — Image-Level Analysis
 * Generates an auditable row for every single uploaded/registered ad creative image.
 * Includes all 150 creatives, with extracted attributes, matched performance, and error states.
 */
export function exportImageLevelCsv(
  creatives: Creative[],
  performanceRecords: PerformanceRecord[]
): string {
  const headers = [
    'Creative ID',
    'Image Filename',
    'Processing Status',
    'CSV Match Status',
    'Extracted Color Palette',
    'Color Saturation',
    'Brightness',
    'Visual Contrast',
    'Composition Complexity',
    'Aspect Ratio / Format',
    'Dominant Color (HEX)',
    'Spend ($)',
    'Impressions',
    'Clicks',
    'Purchases / Conversions',
    'Revenue ($)',
    'CTR (%)',
    'CVR (%)',
    'CPC ($)',
    'CPA ($)',
    'ROAS (x)',
    'Extraction Errors',
  ];

  // Index performance records by creativeId for fast lookup
  const perfMap = new Map<string, PerformanceRecord>();
  for (const p of performanceRecords) {
    if (p.creativeId) {
      perfMap.set(p.creativeId.toLowerCase(), p);
    }
  }

  const rows = creatives.map((c) => {
    const cid = c.sourceCreativeId || c.id;
    const p = perfMap.get(cid.toLowerCase());

    const getAttr = (key: string) => {
      const a = c.attributes.find((attr) => attr.key === key);
      return a ? String(a.value) : '—';
    };

    const impressions = p?.impressions ?? null;
    const clicks = p?.clicks ?? null;
    const conversions = p?.conversions ?? null;
    const spend = p?.spend ?? null;
    const revenue = p?.revenue ?? null;

    const ctrStr =
      impressions && impressions > 0 && clicks !== null
        ? `${((clicks / impressions) * 100).toFixed(2)}%`
        : '—';

    const cvrStr =
      clicks && clicks > 0 && conversions !== null
        ? `${((conversions / clicks) * 100).toFixed(2)}%`
        : '—';

    const cpcStr =
      clicks && clicks > 0 && spend !== null
        ? `$${(spend / clicks).toFixed(2)}`
        : '—';

    const cpaStr =
      conversions && conversions > 0 && spend !== null
        ? `$${(spend / conversions).toFixed(2)}`
        : '—';

    const roasStr =
      spend && spend > 0 && revenue !== null
        ? `${(revenue / spend).toFixed(2)}x`
        : '—';

    return [
      escapeCsvCell(c.sourceCreativeId || c.id),
      escapeCsvCell(c.imageFileName || '—'),
      escapeCsvCell((c.processingStatus || 'success').toUpperCase()),
      escapeCsvCell(c.matchStatus.toUpperCase()),
      escapeCsvCell(getAttr('palette')),
      escapeCsvCell(getAttr('saturation')),
      escapeCsvCell(getAttr('brightness')),
      escapeCsvCell(getAttr('contrast')),
      escapeCsvCell(getAttr('complexity')),
      escapeCsvCell(getAttr('aspect_ratio')),
      escapeCsvCell(c.dominantColor || '—'),
      escapeCsvCell(spend !== null ? spend.toFixed(2) : '—'),
      escapeCsvCell(impressions !== null ? impressions : '—'),
      escapeCsvCell(clicks !== null ? clicks : '—'),
      escapeCsvCell(conversions !== null ? conversions : '—'),
      escapeCsvCell(revenue !== null ? revenue.toFixed(2) : '—'),
      escapeCsvCell(ctrStr),
      escapeCsvCell(cvrStr),
      escapeCsvCell(cpcStr),
      escapeCsvCell(cpaStr),
      escapeCsvCell(roasStr),
      escapeCsvCell(c.extractionError || 'None'),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
}

/**
 * Output B — Aggregate Creative Intelligence Rankings
 * Serializes findings to a clean, downloadable CSV string.
 * Formats effect sizes and group values appropriately for rates, currency, and multipliers.
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
    'Group A Value',
    'Comparison Group B',
    'Group B Value',
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
      escapeCsvCell(formatMetricValue(f.groupValues[0], f.metric)),
      escapeCsvCell(f.groupLabels[1] || 'Group B'),
      escapeCsvCell(formatMetricValue(f.groupValues[1], f.metric)),
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
