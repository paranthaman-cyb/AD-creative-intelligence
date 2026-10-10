import { MetricKey } from '../../types';

export function formatNumber(val: number | null | undefined): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return new Intl.NumberFormat('en-US').format(Math.round(val));
}

export function formatCurrency(val: number | null | undefined, decimals = 2): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

export function formatPercent(val: number | null | undefined, decimals = 1): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return `${(val * 100).toFixed(decimals)}%`;
}

export function formatMetricValue(val: number | null | undefined, metric: MetricKey): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  switch (metric) {
    case 'ctr':
    case 'cvr':
      return formatPercent(val, 1);
    case 'cpc':
    case 'cpa':
      return formatCurrency(val, 2);
    case 'roas':
      return `${val.toFixed(2)}x`;
    default:
      return String(val);
  }
}

export function formatEffectSize(val: number | null | undefined, metric?: MetricKey): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  const sign = val > 0 ? '+' : '';
  if (metric === 'cpc' || metric === 'cpa') {
    // Relative percent change or absolute dollar change
    // Using percentage for effect size comparison across groups
    return `${sign}${(val * 100).toFixed(1)}%`;
  }
  // For CTR, CVR, absolute or relative difference in percentage points
  return `${sign}${(val * 100).toFixed(1)}%`;
}

export function formatConfidenceInterval(
  ci: [number, number] | null | undefined,
  _metric?: MetricKey
): string {
  if (!ci || ci.length !== 2 || isNaN(ci[0]) || isNaN(ci[1])) return '—';
  const lower = (ci[0] * 100).toFixed(1);
  const upper = (ci[1] * 100).toFixed(1);
  return `[${lower}%, ${upper}%]`;
}

export function getMetricLabel(metric: MetricKey): string {
  switch (metric) {
    case 'ctr':
      return 'Click-Through Rate (CTR)';
    case 'cvr':
      return 'Conversion Rate (CVR)';
    case 'cpc':
      return 'Cost Per Click (CPC)';
    case 'cpa':
      return 'Cost Per Acquisition (CPA)';
    case 'roas':
      return 'Return on Ad Spend (ROAS)';
    default:
      return metric;
  }
}

export function getMetricShortLabel(metric: MetricKey): string {
  switch (metric) {
    case 'ctr':
      return 'CTR';
    case 'cvr':
      return 'CVR';
    case 'cpc':
      return 'CPC';
    case 'cpa':
      return 'CPA';
    case 'roas':
      return 'ROAS';
    default:
      return metric;
  }
}

export function getMetricDescription(metric: MetricKey): string {
  switch (metric) {
    case 'ctr':
      return 'Clicks divided by Impressions. Measures how effectively the creative attracts clicks.';
    case 'cvr':
      return 'Conversions divided by Clicks. Measures how effectively traffic converts into actions.';
    case 'cpc':
      return 'Spend divided by Clicks. Measures cost efficiency per clicked user.';
    case 'cpa':
      return 'Spend divided by Conversions. Measures cost efficiency per desired action.';
    case 'roas':
      return 'Revenue divided by Spend. Measures gross revenue generated per dollar spent.';
    default:
      return '';
  }
}
