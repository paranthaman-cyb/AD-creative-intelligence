import { describe, it, expect } from 'vitest';
import { compareProportions } from '../../src/services/analysis/statisticalTests';
import { generateFindings } from '../../src/services/analysis/evidenceClassifier';
import { Creative, PerformanceRecord } from '../../src/types';

describe('Statistical Analysis & Evidence Classification', () => {
  it('calculates two-proportion comparison and 95% confidence interval correctly', () => {
    // Group A: 100 clicks / 5,000 imps (2.0%)
    // Group B: 250 clicks / 5,000 imps (5.0%)
    const res = compareProportions(
      { count: 15, numerator: 100, denominator: 5000 },
      { count: 15, numerator: 250, denominator: 5000 },
      'Low Contrast',
      'High Contrast'
    );

    expect(res.groupA.rate).toBe(0.02);
    expect(res.groupB.rate).toBe(0.05);
    expect(res.effectSize).toBeCloseTo(0.03, 3); // +3.0%
    expect(res.isUnderpowered).toBe(false);
    expect(res.confidenceInterval).not.toBeNull();

    if (res.confidenceInterval) {
      const [low, high] = res.confidenceInterval;
      expect(low).toBeGreaterThan(0.02);
      expect(high).toBeLessThan(0.04);
    }
  });

  it('marks comparison underpowered when sample sizes are inadequate', () => {
    const res = compareProportions(
      { count: 3, numerator: 10, denominator: 100 },
      { count: 2, numerator: 15, denominator: 100 }
    );

    expect(res.isUnderpowered).toBe(true);
    expect(res.confidenceInterval).toBeNull();
  });

  it('generates findings and classifies evidence status properly', () => {
    const creatives: Creative[] = [
      ...Array.from({ length: 15 }, (_, i) => ({
        id: `c_low_${i}`,
        analysisSessionId: 's',
        sourceCreativeId: `ad_low_${i}`,
        name: `Ad Low ${i}`,
        attributes: [{ key: 'contrast', name: 'Contrast', value: 'Low Contrast', source: 'imported' as const, confidence: null, reviewed: true }],
        matchStatus: 'matched' as const,
      })),
      ...Array.from({ length: 15 }, (_, i) => ({
        id: `c_high_${i}`,
        analysisSessionId: 's',
        sourceCreativeId: `ad_high_${i}`,
        name: `Ad High ${i}`,
        attributes: [{ key: 'contrast', name: 'Contrast', value: 'High Contrast', source: 'imported' as const, confidence: null, reviewed: true }],
        matchStatus: 'matched' as const,
      })),
    ];

    const records: PerformanceRecord[] = [
      ...Array.from({ length: 15 }, (_, i) => ({
        id: `p_low_${i}`,
        analysisSessionId: 's',
        creativeId: `ad_low_${i}`,
        sourceRowNumber: i + 1,
        campaignId: 'c1',
        date: '2026-01-01',
        impressions: 1000,
        clicks: 20, // 2%
        conversions: 2,
        spend: 50,
        revenue: 150,
        rawFields: {},
      })),
      ...Array.from({ length: 15 }, (_, i) => ({
        id: `p_high_${i}`,
        analysisSessionId: 's',
        creativeId: `ad_high_${i}`,
        sourceRowNumber: i + 16,
        campaignId: 'c1',
        date: '2026-01-01',
        impressions: 1000,
        clicks: 50, // 5%
        conversions: 5,
        spend: 50,
        revenue: 150,
        rawFields: {},
      })),
    ];

    const findings = generateFindings(creatives, records);

    expect(findings.length).toBeGreaterThan(0);
    const contrastFinding = findings.find((f) => f.attributeKey === 'contrast' && f.metric === 'ctr');
    expect(contrastFinding).toBeDefined();
    expect(contrastFinding?.status).toBe('supported');
    expect(contrastFinding?.sampleSize).toBe(30);
  });
});
