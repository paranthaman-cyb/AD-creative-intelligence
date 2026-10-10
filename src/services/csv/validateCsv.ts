import { ColumnMapping, PerformanceRecord, ValidationIssue } from '../../types';

export interface CsvValidationResult {
  isValid: boolean;
  records: PerformanceRecord[];
  issues: ValidationIssue[];
  errorCount: number;
  warningCount: number;
  totalParsedRows: number;
}

/**
 * Normalizes a numeric value from string/number. Returns null if empty/invalid.
 */
function parseNumericField(val: unknown): number | null {
  if (val === null || val === undefined || val === '') return null;
  const str = String(val).replace(/[$,% ]/g, '').trim();
  if (str === '') return null;
  const num = Number(str);
  return isNaN(num) ? null : num;
}

/**
 * Validates parsed CSV rows against the active column mapping.
 * Normalizes rows into typed PerformanceRecord objects.
 */
export function validateAndNormalizeCsv(
  rows: Record<string, string>[],
  mapping: ColumnMapping,
  sessionId = 'current'
): CsvValidationResult {
  const issues: ValidationIssue[] = [];
  const records: PerformanceRecord[] = [];
  const creativeIdCounts = new Map<string, number>();

  if (rows.length === 0) {
    issues.push({
      message: 'The uploaded CSV contains no data rows.',
      severity: 'error',
    });
    return {
      isValid: false,
      records: [],
      issues,
      errorCount: 1,
      warningCount: 0,
      totalParsedRows: 0,
    };
  }

  let errorCount = 0;
  let warningCount = 0;

  rows.forEach((row, idx) => {
    const rowNum = idx + 1;
    const rawCreativeId = mapping.creativeId ? row[mapping.creativeId]?.trim() : '';
    const rawImpressions = mapping.impressions ? row[mapping.impressions] : null;
    const rawClicks = mapping.clicks ? row[mapping.clicks] : null;

    if (!rawCreativeId) {
      issues.push({
        rowNumber: rowNum,
        field: mapping.creativeId || 'creativeId',
        message: `Row ${rowNum}: Missing creative/ad identifier.`,
        severity: 'error',
      });
      errorCount++;
      return;
    }

    // Count occurrences of creativeId
    creativeIdCounts.set(rawCreativeId, (creativeIdCounts.get(rawCreativeId) || 0) + 1);

    // Validate impressions
    const impressions = parseNumericField(rawImpressions);
    if (impressions === null) {
      issues.push({
        rowNumber: rowNum,
        field: mapping.impressions,
        message: `Row ${rowNum}: Impressions must be a valid number. Found: "${rawImpressions ?? ''}".`,
        severity: 'error',
      });
      errorCount++;
      return;
    }
    if (impressions < 0) {
      issues.push({
        rowNumber: rowNum,
        field: mapping.impressions,
        message: `Row ${rowNum}: Impressions cannot be negative (${impressions}).`,
        severity: 'error',
      });
      errorCount++;
      return;
    }

    // Validate clicks
    const clicks = parseNumericField(rawClicks);
    if (clicks === null) {
      issues.push({
        rowNumber: rowNum,
        field: mapping.clicks,
        message: `Row ${rowNum}: Clicks must be a valid number. Found: "${rawClicks ?? ''}".`,
        severity: 'error',
      });
      errorCount++;
      return;
    }
    if (clicks < 0) {
      issues.push({
        rowNumber: rowNum,
        field: mapping.clicks,
        message: `Row ${rowNum}: Clicks cannot be negative (${clicks}).`,
        severity: 'error',
      });
      errorCount++;
      return;
    }

    // Logical check: clicks should not exceed impressions
    if (clicks > impressions && impressions > 0) {
      issues.push({
        rowNumber: rowNum,
        field: 'clicks',
        message: `Row ${rowNum}: Clicks (${clicks}) exceed impressions (${impressions}). Flagged for attribution check.`,
        severity: 'warning',
      });
      warningCount++;
    }

    // Optional fields
    let conversions: number | null = null;
    if (mapping.conversions && row[mapping.conversions] !== undefined) {
      conversions = parseNumericField(row[mapping.conversions]);
      if (conversions !== null && conversions < 0) {
        issues.push({
          rowNumber: rowNum,
          field: mapping.conversions,
          message: `Row ${rowNum}: Conversions cannot be negative (${conversions}).`,
          severity: 'error',
        });
        errorCount++;
        return;
      }
      if (conversions !== null && clicks > 0 && conversions > clicks) {
        issues.push({
          rowNumber: rowNum,
          field: mapping.conversions,
          message: `Row ${rowNum}: Conversions (${conversions}) exceed clicks (${clicks}). Flagged for attribution check.`,
          severity: 'warning',
        });
        warningCount++;
      }
    }

    let spend: number | null = null;
    if (mapping.spend && row[mapping.spend] !== undefined) {
      spend = parseNumericField(row[mapping.spend]);
      if (spend !== null && spend < 0) {
        issues.push({
          rowNumber: rowNum,
          field: mapping.spend,
          message: `Row ${rowNum}: Spend cannot be negative (${spend}).`,
          severity: 'error',
        });
        errorCount++;
        return;
      }
    }

    let revenue: number | null = null;
    if (mapping.revenue && row[mapping.revenue] !== undefined) {
      revenue = parseNumericField(row[mapping.revenue]);
      if (revenue !== null && revenue < 0) {
        issues.push({
          rowNumber: rowNum,
          field: mapping.revenue,
          message: `Row ${rowNum}: Revenue cannot be negative (${revenue}).`,
          severity: 'error',
        });
        errorCount++;
        return;
      }
    }

    const campaignId = mapping.campaignId ? row[mapping.campaignId] || null : null;
    const date = mapping.date ? row[mapping.date] || null : null;

    // Collect raw fields
    const rawFields: Record<string, string | number | null> = {};
    for (const [key, value] of Object.entries(row)) {
      rawFields[key] = value;
    }

    records.push({
      id: `perf_${idx}_${Date.now()}`,
      analysisSessionId: sessionId,
      creativeId: rawCreativeId,
      sourceRowNumber: rowNum,
      campaignId,
      date,
      impressions,
      clicks,
      conversions,
      spend,
      revenue,
      rawFields,
    });
  });

  // Check for repeated creative IDs
  let duplicateCount = 0;
  creativeIdCounts.forEach((count, id) => {
    if (count > 1) {
      duplicateCount += count - 1;
      if (duplicateCount <= 3) {
        issues.push({
          message: `Creative ID "${id}" appears ${count} times (likely multi-day or multi-campaign records; will be aggregated).`,
          severity: 'info',
        });
      }
    }
  });

  if (duplicateCount > 3) {
    issues.push({
      message: `${duplicateCount} total multi-record entries detected across creatives; performance will be appropriately aggregated.`,
      severity: 'info',
    });
  }

  return {
    isValid: errorCount === 0 && records.length > 0,
    records,
    issues,
    errorCount,
    warningCount,
    totalParsedRows: rows.length,
  };
}
