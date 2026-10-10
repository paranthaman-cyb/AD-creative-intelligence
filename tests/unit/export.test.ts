import { describe, it, expect } from 'vitest';
import { exportFindingsToCsv } from '../../src/services/export/exportCsv';
import { Finding } from '../../src/types';

describe('CSV Findings Export', () => {
  it('serializes findings to valid CSV with headers and escaped fields', () => {
    const findings: Finding[] = [
      {
        id: 'f1',
        analysisSessionId: 's1',
        attributeKey: 'color_contrast',
        attributeLabel: 'Color Contrast',
        metric: 'ctr',
        groupLabels: ['Low Contrast', 'High Contrast'],
        groupValues: [0.024, 0.052],
        groupCounts: [28, 32],
        effectSize: 0.028,
        confidenceInterval: [0.012, 0.044],
        sampleSize: 60,
        status: 'supported',
        method: 'Two-sample proportion test',
        limitations: ['Observational only', 'Potential audience confounder'],
        summary: 'Higher contrast is associated with higher CTR.',
      },
    ];

    const csv = exportFindingsToCsv(findings);

    expect(csv).toContain('Rank,Attribute,Metric,Status,Effect Size');
    expect(csv).toContain('"Color Contrast"');
    expect(csv).toContain('"CTR"');
    expect(csv).toContain('"SUPPORTED"');
    expect(csv).toContain('"+2.8%"');
    expect(csv).toContain('"[1.2%, 4.4%]"');
    expect(csv).toContain('"60"');
    expect(csv).toContain('"Two-sample proportion test"');
  });

  it('handles empty findings gracefully', () => {
    const csv = exportFindingsToCsv([]);
    expect(csv).toContain('Rank,Attribute,Metric,Status');
    const lines = csv.split('\r\n');
    expect(lines).toHaveLength(1);
  });
});
