import { describe, it, expect } from 'vitest';
import {
  calculateCtr,
  calculateCvr,
  calculateCpc,
  calculateCpa,
  calculateRoas,
  calculateAggregates,
} from '../../src/services/metrics/calculateMetrics';
import { PerformanceRecord } from '../../src/types';

describe('Metric Calculations', () => {
  describe('calculateCtr', () => {
    it('calculates CTR correctly for valid inputs', () => {
      expect(calculateCtr(500, 10000)).toBe(0.05);
      expect(calculateCtr(28460, 543210)).toBeCloseTo(0.0524, 3);
    });

    it('returns null when denominator is zero', () => {
      expect(calculateCtr(10, 0)).toBeNull();
    });

    it('returns null when values are null or undefined', () => {
      expect(calculateCtr(null, 1000)).toBeNull();
      expect(calculateCtr(100, undefined)).toBeNull();
      expect(calculateCtr(null, null)).toBeNull();
    });

    it('returns null when impressions or clicks are negative', () => {
      expect(calculateCtr(-5, 100)).toBeNull();
      expect(calculateCtr(5, -100)).toBeNull();
    });
  });

  describe('calculateCvr', () => {
    it('calculates CVR correctly', () => {
      expect(calculateCvr(100, 1000)).toBe(0.1);
      expect(calculateCvr(2843, 28460)).toBeCloseTo(0.0999, 3);
    });

    it('returns null when clicks is zero or negative', () => {
      expect(calculateCvr(10, 0)).toBeNull();
      expect(calculateCvr(10, -50)).toBeNull();
    });

    it('returns null when conversions is null or negative', () => {
      expect(calculateCvr(null, 100)).toBeNull();
      expect(calculateCvr(-1, 100)).toBeNull();
    });
  });

  describe('calculateCpc', () => {
    it('calculates CPC correctly', () => {
      expect(calculateCpc(2600, 1000)).toBe(2.6);
    });

    it('returns null on zero clicks or negative values', () => {
      expect(calculateCpc(500, 0)).toBeNull();
      expect(calculateCpc(-100, 50)).toBeNull();
    });
  });

  describe('calculateCpa', () => {
    it('calculates CPA correctly', () => {
      expect(calculateCpa(2600, 100)).toBe(26.0);
    });

    it('returns null on zero conversions', () => {
      expect(calculateCpa(500, 0)).toBeNull();
    });
  });

  describe('calculateRoas', () => {
    it('calculates ROAS correctly', () => {
      expect(calculateRoas(3000, 1000)).toBe(3.0);
    });

    it('returns null on zero spend', () => {
      expect(calculateRoas(500, 0)).toBeNull();
    });
  });

  describe('calculateAggregates', () => {
    it('aggregates true sums of numerators and denominators instead of averaging ratios', () => {
      const records: PerformanceRecord[] = [
        {
          id: '1',
          analysisSessionId: 's',
          creativeId: 'c1',
          sourceRowNumber: 1,
          campaignId: null,
          date: null,
          impressions: 10000,
          clicks: 100, // CTR = 1%
          conversions: 10,
          spend: 200,
          revenue: 600,
          rawFields: {},
        },
        {
          id: '2',
          analysisSessionId: 's',
          creativeId: 'c2',
          sourceRowNumber: 2,
          campaignId: null,
          date: null,
          impressions: 1000,
          clicks: 100, // CTR = 10%
          conversions: 20,
          spend: 300,
          revenue: 900,
          rawFields: {},
        },
      ];

      const agg = calculateAggregates(records, 2);

      expect(agg.totalImpressions).toBe(11000);
      expect(agg.totalClicks).toBe(200);
      expect(agg.totalConversions).toBe(30);
      expect(agg.totalSpend).toBe(500);
      expect(agg.totalRevenue).toBe(1500);

      // True aggregate CTR = 200 / 11000 = ~0.01818 (1.82%), NOT the average of (1% + 10%) / 2 = 5.5%
      expect(agg.ctr).toBeCloseTo(200 / 11000, 4);
      expect(agg.cvr).toBeCloseTo(30 / 200, 4);
      expect(agg.cpc).toBe(2.5);
      expect(agg.cpa).toBeCloseTo(500 / 30, 2);
      expect(agg.roas).toBe(3.0);
    });
  });
});
