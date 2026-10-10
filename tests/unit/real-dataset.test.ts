import { describe, it, expect } from 'vitest';
import {
  REAL_CREATIVES,
  REAL_PERFORMANCE_RECORDS,
  REAL_AGGREGATES,
  REAL_FINDINGS,
  REAL_DATASET_SUMMARY,
} from '../../src/data/realDataset';

describe('Real Hackathon Dataset Integration (Halcyon)', () => {
  it('loads exactly 150 creatives with valid image paths and metadata', () => {
    expect(REAL_CREATIVES).toHaveLength(150);
    expect(REAL_DATASET_SUMMARY.totalCreatives).toBe(150);

    // Verify first and last creative
    const first = REAL_CREATIVES[0];
    expect(first.sourceCreativeId).toBe('AD001');
    expect(first.imageFileName).toBe('ad_001.png');
    expect(first.imageUrl).toBe('/creatives/ad_001.png');
    expect(first.aspectRatio).toBe(1.0);
    expect(first.attributes.length).toBeGreaterThanOrEqual(4);

    const last = REAL_CREATIVES[149];
    expect(last.sourceCreativeId).toBe('AD150');
    expect(last.imageFileName).toBe('ad_150.png');
    expect(last.imageUrl).toBe('/creatives/ad_150.png');
  });

  it('contains exactly 150 performance records matching source totals', () => {
    expect(REAL_PERFORMANCE_RECORDS).toHaveLength(150);

    expect(REAL_AGGREGATES.totalCreatives).toBe(150);
    expect(REAL_AGGREGATES.totalImpressions).toBe(20408659);
    expect(REAL_AGGREGATES.totalClicks).toBe(308003);
    expect(REAL_AGGREGATES.totalConversions).toBe(9427);
    expect(REAL_AGGREGATES.totalSpend).toBeCloseTo(185741.35, 1);
    expect(REAL_AGGREGATES.totalRevenue).toBeCloseTo(336657.59, 1);

    // Rates
    expect(REAL_AGGREGATES.ctr).toBeCloseTo(308003 / 20408659, 4); // ~1.51%
    expect(REAL_AGGREGATES.cvr).toBeCloseTo(9427 / 308003, 4); // ~3.06%
    expect(REAL_AGGREGATES.cpc).toBeCloseTo(185741.35 / 308003, 2); // ~$0.60
    expect(REAL_AGGREGATES.cpa).toBeCloseTo(185741.35 / 9427, 2); // ~$19.70
    expect(REAL_AGGREGATES.roas).toBeCloseTo(336657.59 / 185741.35, 2); // ~1.81x
  });

  it('generates statistically auditable findings with Supported, Inconclusive, and Underpowered statuses', () => {
    expect(REAL_FINDINGS.length).toBeGreaterThan(0);

    const statuses = new Set(REAL_FINDINGS.map((f) => f.status));
    expect(statuses.has('supported')).toBe(true);
    expect(statuses.has('inconclusive')).toBe(true);

    // Each finding must have method, limitations, and sample size >= 1
    for (const f of REAL_FINDINGS) {
      expect(f.method).toBeTruthy();
      expect(f.limitations.length).toBeGreaterThan(0);
      expect(f.sampleSize).toBeGreaterThan(0);
      expect(f.summary).toBeTruthy();
    }
  });
});
