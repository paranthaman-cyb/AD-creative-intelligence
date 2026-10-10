import { describe, it, expect } from 'vitest';
import { parseCsvString } from '../../src/services/csv/parseCsv';
import { autoDetectColumnMapping, validateColumnMapping } from '../../src/services/csv/columnMapping';
import { validateAndNormalizeCsv } from '../../src/services/csv/validateCsv';

describe('CSV Parsing & Validation', () => {
  it('parses valid CSV string and extracts headers and rows', async () => {
    const csv = `ad_id,impressions,clicks,conversions\nad_1,1000,50,5\nad_2,2000,100,10`;
    const res = await parseCsvString(csv);

    expect(res.headers).toEqual(['ad_id', 'impressions', 'clicks', 'conversions']);
    expect(res.rows).toHaveLength(2);
    expect(res.rows[0].ad_id).toBe('ad_1');
    expect(res.rows[0].impressions).toBe('1000');
  });

  it('handles quoted commas and spaces correctly', async () => {
    const csv = `creative_id,ad_name,impressions,clicks\n"c_1","Summer Sale, 20% off",5000,250`;
    const res = await parseCsvString(csv);

    expect(res.rows[0].ad_name).toBe('Summer Sale, 20% off');
    expect(res.rows[0].clicks).toBe('250');
  });

  it('auto-detects common column headers', () => {
    const headers = ['ad_id', 'views', 'clicks', 'conv', 'cost', 'sales'];
    const mapping = autoDetectColumnMapping(headers);

    expect(mapping.creativeId).toBe('ad_id');
    expect(mapping.impressions).toBe('views');
    expect(mapping.clicks).toBe('clicks');
    expect(mapping.conversions).toBe('conv');
    expect(mapping.spend).toBe('cost');
    expect(mapping.revenue).toBe('sales');

    const check = validateColumnMapping(mapping);
    expect(check.isValid).toBe(true);
  });

  it('reports missing required fields when validation fails', () => {
    const check = validateColumnMapping({ creativeId: 'id', impressions: '', clicks: '' });
    expect(check.isValid).toBe(false);
    expect(check.missingFields).toContain('Impressions');
    expect(check.missingFields).toContain('Clicks');
  });

  it('validates and normalizes rows with error reporting for negative numbers', () => {
    const rows = [
      { ad_id: 'c1', impressions: '1000', clicks: '50' },
      { ad_id: 'c2', impressions: '-500', clicks: '20' }, // negative impressions
      { ad_id: '', impressions: '500', clicks: '10' },    // missing id
    ];

    const mapping = { creativeId: 'ad_id', impressions: 'impressions', clicks: 'clicks' };
    const result = validateAndNormalizeCsv(rows, mapping);

    expect(result.isValid).toBe(false);
    expect(result.errorCount).toBe(2);
    expect(result.issues.some((i) => i.message.includes('negative'))).toBe(true);
    expect(result.issues.some((i) => i.message.includes('Missing creative'))).toBe(true);
  });

  it('warns when clicks exceed impressions', () => {
    const rows = [{ ad_id: 'c1', impressions: '100', clicks: '150' }];
    const mapping = { creativeId: 'ad_id', impressions: 'impressions', clicks: 'clicks' };
    const result = validateAndNormalizeCsv(rows, mapping);

    expect(result.isValid).toBe(true); // Valid to proceed but flagged
    expect(result.warningCount).toBe(1);
    expect(result.issues[0].severity).toBe('warning');
    expect(result.issues[0].message).toContain('Clicks (150) exceed impressions');
  });
});
