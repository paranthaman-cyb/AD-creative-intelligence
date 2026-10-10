import { PerformanceRecord, AggregateMetrics, MetricKey } from '../../types';

/**
 * Calculates Click-Through Rate (CTR) = clicks / impressions.
 * Returns null if denominator is missing, zero, or negative.
 */
export function calculateCtr(clicks: number | null | undefined, impressions: number | null | undefined): number | null {
  if (clicks === null || clicks === undefined || impressions === null || impressions === undefined) {
    return null;
  }
  if (impressions <= 0 || clicks < 0) {
    return null;
  }
  return clicks / impressions;
}

/**
 * Calculates Conversion Rate (CVR) = conversions / clicks.
 * Returns null if clicks is zero or either value is missing.
 */
export function calculateCvr(conversions: number | null | undefined, clicks: number | null | undefined): number | null {
  if (conversions === null || conversions === undefined || clicks === null || clicks === undefined) {
    return null;
  }
  if (clicks <= 0 || conversions < 0) {
    return null;
  }
  return conversions / clicks;
}

/**
 * Calculates Cost Per Click (CPC) = spend / clicks.
 * Returns null if clicks is zero or either value is missing.
 */
export function calculateCpc(spend: number | null | undefined, clicks: number | null | undefined): number | null {
  if (spend === null || spend === undefined || clicks === null || clicks === undefined) {
    return null;
  }
  if (clicks <= 0 || spend < 0) {
    return null;
  }
  return spend / clicks;
}

/**
 * Calculates Cost Per Acquisition (CPA) = spend / conversions.
 * Returns null if conversions is zero or either value is missing.
 */
export function calculateCpa(spend: number | null | undefined, conversions: number | null | undefined): number | null {
  if (spend === null || spend === undefined || conversions === null || conversions === undefined) {
    return null;
  }
  if (conversions <= 0 || spend < 0) {
    return null;
  }
  return spend / conversions;
}

/**
 * Calculates Return on Ad Spend (ROAS) = revenue / spend.
 * Returns null if spend is zero or either value is missing.
 */
export function calculateRoas(revenue: number | null | undefined, spend: number | null | undefined): number | null {
  if (revenue === null || revenue === undefined || spend === null || spend === undefined) {
    return null;
  }
  if (spend <= 0 || revenue < 0) {
    return null;
  }
  return revenue / spend;
}

/**
 * Calculates metric value for a specific MetricKey given raw components.
 */
export function calculateMetricValue(
  metric: MetricKey,
  data: {
    impressions?: number | null;
    clicks?: number | null;
    conversions?: number | null;
    spend?: number | null;
    revenue?: number | null;
  }
): number | null {
  switch (metric) {
    case 'ctr':
      return calculateCtr(data.clicks, data.impressions);
    case 'cvr':
      return calculateCvr(data.conversions, data.clicks);
    case 'cpc':
      return calculateCpc(data.spend, data.clicks);
    case 'cpa':
      return calculateCpa(data.spend, data.conversions);
    case 'roas':
      return calculateRoas(data.revenue, data.spend);
    default:
      return null;
  }
}

/**
 * Aggregates a list of performance records using true aggregated sums of
 * numerators and denominators, rather than averaging row-level ratios.
 */
export function calculateAggregates(
  records: PerformanceRecord[],
  uniqueCreativeCount?: number
): AggregateMetrics {
  let totalImpressions = 0;
  let totalClicks = 0;
  let totalConversions: number | null = null;
  let totalSpend: number | null = null;
  let totalRevenue: number | null = null;

  let hasConversions = false;
  let hasSpend = false;
  let hasRevenue = false;

  const creativeSet = new Set<string>();

  for (const record of records) {
    if (record.creativeId) {
      creativeSet.add(record.creativeId);
    }
    if (typeof record.impressions === 'number' && !isNaN(record.impressions)) {
      totalImpressions += record.impressions;
    }
    if (typeof record.clicks === 'number' && !isNaN(record.clicks)) {
      totalClicks += record.clicks;
    }
    if (typeof record.conversions === 'number' && !isNaN(record.conversions)) {
      hasConversions = true;
      totalConversions = (totalConversions ?? 0) + record.conversions;
    }
    if (typeof record.spend === 'number' && !isNaN(record.spend)) {
      hasSpend = true;
      totalSpend = (totalSpend ?? 0) + record.spend;
    }
    if (typeof record.revenue === 'number' && !isNaN(record.revenue)) {
      hasRevenue = true;
      totalRevenue = (totalRevenue ?? 0) + record.revenue;
    }
  }

  return {
    totalCreatives: uniqueCreativeCount ?? creativeSet.size,
    totalImpressions,
    totalClicks,
    totalConversions: hasConversions ? totalConversions : null,
    totalSpend: hasSpend ? totalSpend : null,
    totalRevenue: hasRevenue ? totalRevenue : null,
    ctr: calculateCtr(totalClicks, totalImpressions),
    cvr: hasConversions ? calculateCvr(totalConversions, totalClicks) : null,
    cpc: hasSpend ? calculateCpc(totalSpend, totalClicks) : null,
    cpa: hasSpend && hasConversions ? calculateCpa(totalSpend, totalConversions) : null,
    roas: hasRevenue && hasSpend ? calculateRoas(totalRevenue, totalSpend) : null,
  };
}
