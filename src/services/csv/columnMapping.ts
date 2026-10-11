import { ColumnMapping } from '../../types';

export const CANONICAL_FIELDS: { key: keyof ColumnMapping; label: string; required: boolean; description: string }[] = [
  { key: 'creativeId', label: 'Creative / Ad ID', required: true, description: 'Unique identifier for the ad creative' },
  { key: 'impressions', label: 'Impressions', required: true, description: 'Number of times the ad was displayed' },
  { key: 'clicks', label: 'Clicks', required: true, description: 'Number of user clicks on the ad' },
  { key: 'conversions', label: 'Conversions', required: false, description: 'Number of conversions or key actions' },
  { key: 'spend', label: 'Spend ($)', required: false, description: 'Advertising expenditure' },
  { key: 'revenue', label: 'Revenue ($)', required: false, description: 'Gross revenue generated' },
  { key: 'name', label: 'Creative Name / Headline', required: false, description: 'Display name or title of the ad' },
  { key: 'filename', label: 'Image Filename', required: false, description: 'Filename of the image asset (e.g. ad_001.png)' },
  { key: 'campaignId', label: 'Campaign ID / Name', required: false, description: 'Associated advertising campaign' },
  { key: 'date', label: 'Date', required: false, description: 'Record date for trend calculation' },
];

const AUTO_DETECT_PATTERNS: Record<keyof ColumnMapping, RegExp[]> = {
  creativeId: [/^(ad_id|creative_id|creativeid|adid|ad|id|asset_id)$/i, /creative/i, /ad.*id/i],
  impressions: [/^(impressions|imps|views|impression)$/i, /impress/i],
  clicks: [/^(clicks|clks|click)$/i, /click/i],
  conversions: [/^(conversions|conv|purchases|leads|actions|results)$/i, /conv/i, /purchase/i],
  spend: [/^(spend|cost|amount_spent|budget|expenditure)$/i, /spend/i, /cost/i],
  revenue: [/^(revenue|total_revenue|sales|conversion_value|value)$/i, /rev/i, /sales/i],
  name: [/^(ad_name|creative_name|name|headline|title)$/i, /name/i, /title/i],
  filename: [/^(filename|file_name|image_file|image_filename|file|asset_name|image)$/i, /filename/i],
  campaignId: [/^(campaign_id|campaign|campaign_name|utm_campaign)$/i, /camp/i],
  date: [/^(date|day|time|timestamp|period)$/i, /date/i],
};

/**
 * Automatically suggests best-matching column headers based on regex heuristics.
 */
export function autoDetectColumnMapping(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {
    creativeId: '',
    impressions: '',
    clicks: '',
  };

  const usedHeaders = new Set<string>();

  for (const field of CANONICAL_FIELDS) {
    const patterns = AUTO_DETECT_PATTERNS[field.key] || [];
    let matchedHeader = '';

    // First try exact / high-confidence match
    for (const pattern of patterns) {
      const match = headers.find((h) => !usedHeaders.has(h) && pattern.test(h.trim()));
      if (match) {
        matchedHeader = match;
        break;
      }
    }

    if (matchedHeader) {
      mapping[field.key] = matchedHeader;
      usedHeaders.add(matchedHeader);
    }
  }

  return mapping;
}

/**
 * Validates that all required columns are mapped.
 */
export function validateColumnMapping(mapping: ColumnMapping): { isValid: boolean; missingFields: string[] } {
  const missingFields: string[] = [];
  if (!mapping.creativeId || mapping.creativeId.trim() === '') {
    missingFields.push('Creative / Ad ID');
  }
  if (!mapping.impressions || mapping.impressions.trim() === '') {
    missingFields.push('Impressions');
  }
  if (!mapping.clicks || mapping.clicks.trim() === '') {
    missingFields.push('Clicks');
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}
