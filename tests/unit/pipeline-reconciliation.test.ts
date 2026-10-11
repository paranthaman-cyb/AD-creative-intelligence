import { describe, it, expect } from 'vitest';
import {
  normalizeIdentifier,
  reconcileCreativesAndImages,
} from '../../src/services/analysis/featureExtraction';
import { exportImageLevelCsv, exportFindingsToCsv } from '../../src/services/export/exportCsv';
import {
  REAL_CREATIVES,
  REAL_PERFORMANCE_RECORDS,
  REAL_FINDINGS,
} from '../../src/data/realDataset';
import { PerformanceRecord } from '../../src/types';

describe('Pipeline Ingestion, Reconciliation & Export Validation', () => {
  describe('Identifier & Filename Normalization', () => {
    it('normalizes filenames and creative IDs for resilient bidirectional matching', () => {
      expect(normalizeIdentifier('ad_001.png')).toBe('ad001');
      expect(normalizeIdentifier('AD001')).toBe('ad001');
      expect(normalizeIdentifier('AD-001.jpg')).toBe('ad001');
      expect(normalizeIdentifier('ad_150.webp')).toBe('ad150');
      expect(normalizeIdentifier('AD150')).toBe('ad150');
      expect(normalizeIdentifier('creative_42')).toBe('creative42');
      expect(normalizeIdentifier('AD_024.PNG')).toBe('ad024');
    });
  });

  describe('Fewer Than 24 Images Dataset (< 24)', () => {
    it('discovers and reconciles all 10 images without dropping any record', () => {
      const mockFiles: File[] = Array.from({ length: 10 }, (_, i) => {
        const numStr = String(i + 1).padStart(3, '0');
        return new File(['fake-png-data'], `ad_${numStr}.png`, { type: 'image/png' });
      });

      const mockRecords: PerformanceRecord[] = Array.from({ length: 10 }, (_, i) => {
        const numStr = String(i + 1).padStart(3, '0');
        return {
          id: `p_${i + 1}`,
          analysisSessionId: 'test_session',
          creativeId: `AD${numStr}`,
          sourceRowNumber: i + 1,
          campaignId: 'camp1',
          date: '2026-06-01',
          impressions: 10000,
          clicks: 150,
          conversions: 10,
          spend: 100,
          revenue: 200,
          rawFields: {
            creative_id: `AD${numStr}`,
            filename: `ad_${numStr}.png`,
          },
        };
      });

      const { items, diagnostics } = reconcileCreativesAndImages(mockFiles, mockRecords);

      expect(diagnostics.imagesDiscovered).toBe(10);
      expect(diagnostics.imagesMatchedToCsv).toBe(10);
      expect(diagnostics.imagesUnmatched).toBe(0);
      expect(items).toHaveLength(10);

      // Verify Output A has exactly 10 data rows (+ 1 header = 11 lines)
      const creatives = items.map((it) => it.creative);
      const csvOutputA = exportImageLevelCsv(creatives, mockRecords);
      const lines = csvOutputA.split('\r\n');
      expect(lines).toHaveLength(11);
    });
  });

  describe('Exactly 24 Images Dataset (= 24)', () => {
    it('processes exactly 24 images with full match and produces exactly 24 Output A rows', () => {
      const count = 24;
      const mockFiles: File[] = Array.from({ length: count }, (_, i) => {
        const numStr = String(i + 1).padStart(3, '0');
        return new File(['dummy'], `ad_${numStr}.png`, { type: 'image/png' });
      });

      const mockRecords: PerformanceRecord[] = Array.from({ length: count }, (_, i) => {
        const numStr = String(i + 1).padStart(3, '0');
        return {
          id: `p_${i + 1}`,
          analysisSessionId: 'test_24',
          creativeId: `AD${numStr}`,
          sourceRowNumber: i + 1,
          campaignId: 'camp1',
          date: '2026-06-01',
          impressions: 10000,
          clicks: 200,
          conversions: 12,
          spend: 150,
          revenue: 300,
          rawFields: {
            creative_id: `AD${numStr}`,
            filename: `ad_${numStr}.png`,
          },
        };
      });

      const { items, diagnostics } = reconcileCreativesAndImages(mockFiles, mockRecords);

      expect(diagnostics.imagesDiscovered).toBe(24);
      expect(diagnostics.imagesMatchedToCsv).toBe(24);
      expect(items).toHaveLength(24);

      const creatives = items.map((it) => it.creative);
      const csvOutputA = exportImageLevelCsv(creatives, mockRecords);
      const linesA = csvOutputA.split('\r\n');
      expect(linesA).toHaveLength(25); // 1 header + 24 rows
    });
  });

  describe('More Than 24 Images Dataset (> 24, e.g. 60 Images)', () => {
    it('processes all 60 images without any arbitrary 24-row truncation', () => {
      const count = 60;
      const mockFiles: File[] = Array.from({ length: count }, (_, i) => {
        const numStr = String(i + 1).padStart(3, '0');
        return new File(['dummy'], `ad_${numStr}.png`, { type: 'image/png' });
      });

      const mockRecords: PerformanceRecord[] = Array.from({ length: count }, (_, i) => {
        const numStr = String(i + 1).padStart(3, '0');
        return {
          id: `p_${i + 1}`,
          analysisSessionId: 'test_60',
          creativeId: `AD${numStr}`,
          sourceRowNumber: i + 1,
          campaignId: 'camp1',
          date: '2026-06-01',
          impressions: 10000,
          clicks: 200,
          conversions: 12,
          spend: 150,
          revenue: 300,
          rawFields: {
            creative_id: `AD${numStr}`,
            filename: `ad_${numStr}.png`,
          },
        };
      });

      const { items, diagnostics } = reconcileCreativesAndImages(mockFiles, mockRecords);

      expect(diagnostics.imagesDiscovered).toBe(60);
      expect(diagnostics.imagesMatchedToCsv).toBe(60);
      expect(items).toHaveLength(60);

      const creatives = items.map((it) => it.creative);
      const csvOutputA = exportImageLevelCsv(creatives, mockRecords);
      const linesA = csvOutputA.split('\r\n');
      expect(linesA).toHaveLength(61); // 1 header + 60 rows
    });
  });

  describe('Full 150-Image Dataset (Halcyon Benchmark PS-02)', () => {
    it('reconciles all 150 images and separates Output A (150 rows) from Output B (24 rows)', () => {
      // 1. Verify 150 raw creatives and records
      expect(REAL_CREATIVES).toHaveLength(150);
      expect(REAL_PERFORMANCE_RECORDS).toHaveLength(150);

      // 2. Mock 150 File objects corresponding to real images
      const realFiles: File[] = REAL_CREATIVES.map((c) => {
        return new File(['real-image-bytes'], c.imageFileName || `${c.id}.png`, { type: 'image/png' });
      });

      // 3. Run bidirectional reconciliation
      const { items, diagnostics } = reconcileCreativesAndImages(realFiles, REAL_PERFORMANCE_RECORDS);

      expect(diagnostics.imagesDiscovered).toBe(150);
      expect(diagnostics.imagesMatchedToCsv).toBe(150);
      expect(diagnostics.imagesUnmatched).toBe(0);
      expect(diagnostics.csvRecordsWithoutImage).toBe(0);
      expect(items).toHaveLength(150);

      // Verify each item is matched
      for (const it of items) {
        expect(it.creative.matchStatus).toBe('matched');
        expect(it.performanceRecord).toBeDefined();
      }

      // 4. Output A: Image-Level Analysis Export
      const csvOutputA = exportImageLevelCsv(REAL_CREATIVES, REAL_PERFORMANCE_RECORDS);
      const linesOutputA = csvOutputA.split('\r\n');

      // Exactly 1 header + 150 data rows = 151 lines
      expect(linesOutputA).toHaveLength(151);
      expect(linesOutputA[0]).toContain('Creative ID,Image Filename,Processing Status');

      // Check first and last rows
      expect(linesOutputA[1]).toContain('"AD001"');
      expect(linesOutputA[1]).toContain('"ad_001.png"');
      expect(linesOutputA[150]).toContain('"AD150"');
      expect(linesOutputA[150]).toContain('"ad_150.png"');

      // Verify no invalid infinities or NaNs in Output A
      expect(csvOutputA).not.toContain('NaN');
      expect(csvOutputA).not.toContain('Infinity');

      // 5. Output B: Aggregate Rankings Export
      // Notice: Exactly 24 aggregate ranking rows (6 attribute pairs * 4 metrics = 24 findings)
      expect(REAL_FINDINGS).toHaveLength(24);

      const csvOutputB = exportFindingsToCsv(REAL_FINDINGS);
      const linesOutputB = csvOutputB.split('\r\n');

      // Exactly 1 header + 24 findings = 25 lines
      expect(linesOutputB).toHaveLength(25);
      expect(linesOutputB[0]).toContain('Rank,Attribute,Metric,Status,Effect Size');

      // Confirm CPA effect sizes and values do NOT have erroneous '%' attached
      const cpaRows = linesOutputB.filter((l) => l.includes('"CPA"'));
      expect(cpaRows.length).toBeGreaterThan(0);
      for (const row of cpaRows) {
        // Group values for CPA should contain $ and not have % at the end of the dollar amount
        expect(row).toContain('$');
        expect(row).not.toMatch(/\$\d+\.\d+%/);
      }
    });

    it('handles unmatched images and missing image records explicitly without dropping them', () => {
      // 2 uploaded files: 1 matches CSV, 1 does not exist in CSV
      const files: File[] = [
        new File(['a'], 'ad_001.png', { type: 'image/png' }),
        new File(['b'], 'mystery_ad.png', { type: 'image/png' }),
      ];

      // 2 CSV records: AD001 (matches) and AD002 (no file uploaded)
      const records: PerformanceRecord[] = [
        REAL_PERFORMANCE_RECORDS[0], // AD001
        REAL_PERFORMANCE_RECORDS[1], // AD002
      ];

      const { items, diagnostics } = reconcileCreativesAndImages(files, records);

      expect(diagnostics.imagesDiscovered).toBe(2);
      expect(diagnostics.imagesMatchedToCsv).toBe(1);
      expect(diagnostics.imagesUnmatched).toBe(1);
      expect(diagnostics.csvRecordsWithoutImage).toBe(1);

      // Total reconciled items = 1 matched + 1 unmatched image + 1 CSV record without image = 3
      expect(items).toHaveLength(3);

      const matchedItem = items.find((it) => it.creative.sourceCreativeId === 'AD001');
      expect(matchedItem?.creative.matchStatus).toBe('matched');

      const unmatchedItem = items.find((it) => it.creative.imageFileName === 'mystery_ad.png');
      expect(unmatchedItem?.creative.matchStatus).toBe('unmatched');

      const missingImgItem = items.find((it) => it.creative.sourceCreativeId === 'AD002');
      expect(missingImgItem?.creative.matchStatus).toBe('image_missing');

      // Output A export contains all 3 items with proper statuses
      const csv = exportImageLevelCsv(items.map((it) => it.creative), records);
      const lines = csv.split('\r\n');
      expect(lines).toHaveLength(4); // 1 header + 3 items
      expect(csv).toContain('"MATCHED"');
      expect(csv).toContain('"UNMATCHED"');
      expect(csv).toContain('"IMAGE_MISSING"');
    });
  });
});
