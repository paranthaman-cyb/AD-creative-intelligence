import { describe, it, expect } from 'vitest';
import { exportFindingsToCsv, exportImageLevelCsv } from '../../src/services/export/exportCsv';
import { Finding, Creative, PerformanceRecord } from '../../src/types';

describe('CSV Exports (Output A & Output B)', () => {
  describe('Output A: Image-Level Analysis Export', () => {
    it('serializes image-level creatives with exact row count and correctly linked metrics', () => {
      const creatives: Creative[] = [
        {
          id: 'c1',
          analysisSessionId: 's1',
          sourceCreativeId: 'AD001',
          name: 'Halcyon Bottle (AD001)',
          imageUrl: '/creatives/ad_001.png',
          imageFileName: 'ad_001.png',
          matchStatus: 'matched',
          processingStatus: 'success',
          dominantColor: '#eac4a1',
          attributes: [
            { key: 'contrast', name: 'Contrast', value: 'High Contrast', source: 'heuristic', confidence: null, reviewed: false },
            { key: 'palette', name: 'Palette', value: 'Warm (Orange/Red/Brown)', source: 'heuristic', confidence: null, reviewed: false },
          ],
        },
        {
          id: 'c2',
          analysisSessionId: 's1',
          sourceCreativeId: 'AD002',
          name: 'Halcyon Bottle (AD002)',
          imageUrl: null,
          imageFileName: 'ad_unmatched.png',
          matchStatus: 'unmatched',
          processingStatus: 'failed',
          extractionError: 'Corrupted image header',
          attributes: [],
        },
      ];

      const records: PerformanceRecord[] = [
        {
          id: 'p1',
          analysisSessionId: 's1',
          creativeId: 'AD001',
          sourceRowNumber: 1,
          campaignId: 'camp1',
          date: '2026-06-13',
          impressions: 25804,
          clicks: 284,
          conversions: 5,
          spend: 276.38,
          revenue: 186.02,
          rawFields: {},
        },
      ];

      const csv = exportImageLevelCsv(creatives, records);
      const lines = csv.split('\r\n');

      // 1 header + 2 creative data rows
      expect(lines).toHaveLength(3);
      expect(lines[0]).toContain('Creative ID,Image Filename,Processing Status,CSV Match Status');

      // Row 1 (matched)
      expect(lines[1]).toContain('"AD001"');
      expect(lines[1]).toContain('"ad_001.png"');
      expect(lines[1]).toContain('"SUCCESS"');
      expect(lines[1]).toContain('"MATCHED"');
      expect(lines[1]).toContain('1.10%'); // CTR = 284 / 25804 = 1.10%
      expect(lines[1]).toContain('$55.28'); // CPA = 276.38 / 5 = $55.28
      expect(lines[1]).toContain('0.67x'); // ROAS = 186.02 / 276.38 = 0.67x
      expect(lines[1]).toContain('"None"'); // No error

      // Row 2 (unmatched/failed)
      expect(lines[2]).toContain('"AD002"');
      expect(lines[2]).toContain('"ad_unmatched.png"');
      expect(lines[2]).toContain('"FAILED"');
      expect(lines[2]).toContain('"UNMATCHED"');
      expect(lines[2]).toContain('"Corrupted image header"');
      expect(lines[2]).toContain('"—"'); // Missing CTR should be dash, never fabricated
    });
  });

  describe('Output B: Aggregate Findings Export', () => {
    it('serializes findings with proper formatting for rates, currency, and multipliers', () => {
      const findings: Finding[] = [
        {
          id: 'f1',
          analysisSessionId: 's1',
          attributeKey: 'contrast',
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
          limitations: ['Observational correlation only'],
          summary: 'Higher contrast is associated with higher CTR.',
        },
        {
          id: 'f2',
          analysisSessionId: 's1',
          attributeKey: 'contrast',
          attributeLabel: 'Color Contrast',
          metric: 'cpa',
          groupLabels: ['Low Contrast', 'High Contrast'],
          groupValues: [22.5, 18.2],
          groupCounts: [28, 32],
          effectSize: -4.3,
          confidenceInterval: [-6.8, -1.8],
          sampleSize: 60,
          status: 'supported',
          method: "Welch's t-test",
          limitations: ['Observational correlation only'],
          summary: 'High Contrast is associated with $4.30 lower CPA.',
        },
        {
          id: 'f3',
          analysisSessionId: 's1',
          attributeKey: 'palette',
          attributeLabel: 'Color Palette',
          metric: 'roas',
          groupLabels: ['Warm', 'Cool'],
          groupValues: [1.65, 1.95],
          groupCounts: [30, 30],
          effectSize: 0.3,
          confidenceInterval: [0.08, 0.52],
          sampleSize: 60,
          status: 'supported',
          method: "Welch's t-test",
          limitations: ['Observational correlation only'],
          summary: 'Cool palette is associated with 0.30x higher ROAS.',
        },
      ];

      const csv = exportFindingsToCsv(findings);
      const lines = csv.split('\r\n');

      expect(lines).toHaveLength(4); // 1 header + 3 findings
      expect(lines[0]).toContain('Rank,Attribute,Metric,Status,Effect Size');

      // CTR finding
      expect(lines[1]).toContain('"CTR"');
      expect(lines[1]).toContain('"+2.8%"');
      expect(lines[1]).toContain('"[1.2%, 4.4%]"');
      expect(lines[1]).toContain('"2.4%"');

      // CPA finding (must be formatted as currency, NOT multiplied by 100 with %)
      expect(lines[2]).toContain('"CPA"');
      expect(lines[2]).toContain('"-$4.30"');
      expect(lines[2]).toContain('"[-$6.80, -$1.80]"');
      expect(lines[2]).toContain('"$22.50"');
      expect(lines[2]).not.toContain('2250.00%');

      // ROAS finding (must be formatted as multiplier, NOT multiplied by 100 with %)
      expect(lines[3]).toContain('"ROAS"');
      expect(lines[3]).toContain('"+0.30x"');
      expect(lines[3]).toContain('"[0.08x, 0.52x]"');
      expect(lines[3]).toContain('"1.65x"');
      expect(lines[3]).not.toContain('165.00%');
    });

    it('handles empty findings gracefully', () => {
      const csv = exportFindingsToCsv([]);
      expect(csv).toContain('Rank,Attribute,Metric,Status');
      const lines = csv.split('\r\n');
      expect(lines).toHaveLength(1);
    });
  });
});
