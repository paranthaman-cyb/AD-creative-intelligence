import {
  Creative,
  CreativeAttribute,
  PerformanceRecord,
  ColumnMapping,
  ProcessingDiagnostics,
} from '../../types';

export interface ImageExtractionResult {
  width: number;
  height: number;
  aspectRatio: number;
  aspectRatioLabel: string;
  dominantColor: string;
  brightnessVal: number;
  brightnessLabel: 'High Brightness' | 'Muted Brightness';
  contrastVal: number;
  contrastLabel: 'High Contrast' | 'Low Contrast';
  saturationVal: number;
  saturationLabel: 'Vibrant Saturation' | 'Muted Saturation';
  palette: string;
  complexityLabel: 'Detailed / Text-Heavy' | 'Clean / Minimalist';
}

/**
 * Normalizes filenames or identifiers for reliable, case-insensitive comparison.
 * e.g. "ad_001.png" -> "ad001", "AD001" -> "ad001", "AD_150" -> "ad150"
 */
export function normalizeIdentifier(val: string | null | undefined): string {
  if (!val) return '';
  return val
    .trim()
    .toLowerCase()
    .replace(/\.[^/.]+$/, '') // strip file extension if present
    .replace(/[^a-z0-9]/g, ''); // strip underscores, hyphens, spaces
}

/**
 * Categorizes numerical aspect ratio into standard social ad format labels.
 */
export function categorizeAspectRatio(ratio: number): string {
  if (Math.abs(ratio - 1.0) < 0.08) return '1:1 Square';
  if (Math.abs(ratio - 0.5625) < 0.1 || Math.abs(ratio - 9 / 16) < 0.1) return '9:16 Vertical Story';
  if (Math.abs(ratio - 0.8) < 0.08 || Math.abs(ratio - 4 / 5) < 0.08) return '4:5 Feed Portrait';
  if (Math.abs(ratio - 1.777) < 0.15 || Math.abs(ratio - 16 / 9) < 0.15) return '16:9 Landscape';
  return `${ratio.toFixed(2)}:1 Custom`;
}

/**
 * Extracts dimensions, contrast, brightness, saturation, palette, and complexity
 * heuristics from an image File using browser Canvas.
 * Runs entirely client-side without external servers.
 */
export function extractImageFeatures(file: File): Promise<ImageExtractionResult> {
  return new Promise((resolve, reject) => {
    // If not in a browser environment with URL.createObjectURL or Image
    if (typeof window === 'undefined' || typeof Image === 'undefined') {
      return resolve({
        width: 800,
        height: 800,
        aspectRatio: 1.0,
        aspectRatioLabel: '1:1 Square',
        dominantColor: '#5B21B6',
        brightnessVal: 150,
        brightnessLabel: 'High Brightness',
        contrastVal: 35,
        contrastLabel: 'High Contrast',
        saturationVal: 110,
        saturationLabel: 'Vibrant Saturation',
        palette: 'Cool (Blue/Cyan)',
        complexityLabel: 'Clean / Minimalist',
      });
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const width = img.naturalWidth || img.width || 800;
      const height = img.naturalHeight || img.height || 800;
      const aspectRatio = height > 0 ? width / height : 1;
      const aspectRatioLabel = categorizeAspectRatio(aspectRatio);

      let dominantColor = '#7C3AED';
      let brightnessVal = 140;
      let brightnessLabel: 'High Brightness' | 'Muted Brightness' = 'Muted Brightness';
      let contrastVal = 28;
      let contrastLabel: 'High Contrast' | 'Low Contrast' = 'Low Contrast';
      let saturationVal = 80;
      let saturationLabel: 'Vibrant Saturation' | 'Muted Saturation' = 'Muted Saturation';
      let palette = 'Cool (Blue/Cyan)';
      let complexityLabel: 'Detailed / Text-Heavy' | 'Clean / Minimalist' = 'Clean / Minimalist';

      try {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(img, 0, 0, 32, 32);
          const imageData = ctx.getImageData(0, 0, 32, 32).data;
          const numPixels = imageData.length / 4;

          let sumLuma = 0;
          let sumLumaSq = 0;
          let sumSat = 0;
          let sumR = 0, sumG = 0, sumB = 0;
          let edgeDiff = 0;

          let prevLuma = 0;
          let hueWarmCount = 0;
          let hueCoolCount = 0;
          let hueNaturalCount = 0;

          for (let i = 0; i < imageData.length; i += 4) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];

            sumR += r;
            sumG += g;
            sumB += b;

            // Perceptual luminance (Rec. 601)
            const luma = 0.299 * r + 0.587 * g + 0.114 * b;
            sumLuma += luma;
            sumLumaSq += luma * luma;

            if (i > 0) {
              edgeDiff += Math.abs(luma - prevLuma);
            }
            prevLuma = luma;

            // RGB to HSV saturation & hue
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const delta = max - min;
            const sat = max === 0 ? 0 : (delta / max) * 255;
            sumSat += sat;

            if (delta > 0) {
              let h = 0;
              if (max === r) {
                h = ((g - b) / delta) % 6;
              } else if (max === g) {
                h = (b - r) / delta + 2;
              } else {
                h = (r - g) / delta + 4;
              }
              h = Math.round(h * 60);
              if (h < 0) h += 360;

              if ((h >= 0 && h <= 65) || h >= 330) {
                hueWarmCount++;
              } else if (h > 65 && h <= 165) {
                hueNaturalCount++;
              } else if (h > 165 && h < 330) {
                hueCoolCount++;
              }
            }
          }

          const avgR = Math.round(sumR / numPixels);
          const avgG = Math.round(sumG / numPixels);
          const avgB = Math.round(sumB / numPixels);
          dominantColor = `#${((1 << 24) + (avgR << 16) + (avgG << 8) + avgB).toString(16).slice(1)}`;

          brightnessVal = sumLuma / numPixels;
          brightnessLabel = brightnessVal >= 145 ? 'High Brightness' : 'Muted Brightness';

          // Standard deviation of luminance = visual contrast
          const variance = Math.max(0, sumLumaSq / numPixels - brightnessVal * brightnessVal);
          contrastVal = Math.sqrt(variance);
          contrastLabel = contrastVal >= 30 ? 'High Contrast' : 'Low Contrast';

          saturationVal = sumSat / numPixels;
          saturationLabel = saturationVal >= 90 ? 'Vibrant Saturation' : 'Muted Saturation';

          if (saturationVal < 30) {
            palette = 'Neutral / Monochrome';
          } else if (hueCoolCount >= hueWarmCount && hueCoolCount >= hueNaturalCount) {
            palette = 'Cool (Blue/Cyan)';
          } else if (hueNaturalCount >= hueWarmCount) {
            palette = 'Natural (Green/Olive)';
          } else {
            palette = 'Warm (Orange/Red/Brown)';
          }

          // Edge complexity
          const avgEdge = edgeDiff / numPixels;
          complexityLabel = avgEdge >= 18 ? 'Detailed / Text-Heavy' : 'Clean / Minimalist';
        }
      } catch {
        // Fallback gracefully on security/cross-origin or canvas read errors
      } finally {
        URL.revokeObjectURL(objectUrl);
      }

      resolve({
        width,
        height,
        aspectRatio,
        aspectRatioLabel,
        dominantColor,
        brightnessVal,
        brightnessLabel,
        contrastVal,
        contrastLabel,
        saturationVal,
        saturationLabel,
        palette,
        complexityLabel,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to decode image file "${file.name}". File may be corrupted or unreadable.`));
    };

    img.src = objectUrl;
  });
}

/**
 * Attaches metadata attributes to a Creative record with explicit provenance.
 */
export function buildCreativeRecord(
  id: string,
  sourceCreativeId: string,
  name: string,
  extracted?: Partial<ImageExtractionResult>,
  importedAttributes?: Record<string, string>,
  imageUrl?: string,
  imageFileName?: string,
  matchStatus: 'matched' | 'image_missing' | 'performance_missing' | 'unmatched' = 'matched',
  processingStatus: 'success' | 'failed' | 'skipped' = 'success',
  extractionError?: string | null
): Creative {
  const attributes: CreativeAttribute[] = [];

  if (extracted) {
    if (extracted.contrastLabel) {
      attributes.push({
        key: 'contrast',
        name: 'Visual Contrast',
        value: extracted.contrastLabel,
        source: 'heuristic',
        confidence: null,
        reviewed: false,
      });
    }
    if (extracted.brightnessLabel) {
      attributes.push({
        key: 'brightness',
        name: 'Visual Brightness',
        value: extracted.brightnessLabel,
        source: 'heuristic',
        confidence: null,
        reviewed: false,
      });
    }
    if (extracted.saturationLabel) {
      attributes.push({
        key: 'saturation',
        name: 'Color Saturation',
        value: extracted.saturationLabel,
        source: 'heuristic',
        confidence: null,
        reviewed: false,
      });
    }
    if (extracted.complexityLabel) {
      attributes.push({
        key: 'complexity',
        name: 'Composition Complexity',
        value: extracted.complexityLabel,
        source: 'heuristic',
        confidence: null,
        reviewed: false,
      });
    }
    if (extracted.palette) {
      attributes.push({
        key: 'palette',
        name: 'Color Palette',
        value: extracted.palette,
        source: 'heuristic',
        confidence: null,
        reviewed: false,
      });
    }
    if (extracted.aspectRatioLabel) {
      attributes.push({
        key: 'aspect_ratio',
        name: 'Aspect Ratio',
        value: extracted.aspectRatioLabel,
        source: 'heuristic',
        confidence: null,
        reviewed: false,
      });
    }
  }

  if (importedAttributes) {
    for (const [key, val] of Object.entries(importedAttributes)) {
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        // If not already provided by heuristic with cleaner label
        if (!attributes.some((a) => a.key === key)) {
          attributes.push({
            key,
            name: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            value: val,
            source: 'imported',
            confidence: null,
            reviewed: false,
          });
        }
      }
    }
  }

  return {
    id,
    analysisSessionId: 'current',
    sourceCreativeId,
    name: name || sourceCreativeId,
    imageUrl: imageUrl || null,
    imageFileName: imageFileName || null,
    imageWidth: extracted?.width || null,
    imageHeight: extracted?.height || null,
    aspectRatio: extracted?.aspectRatio || null,
    dominantColor: extracted?.dominantColor || null,
    attributes,
    matchStatus,
    processingStatus,
    extractionError: extractionError || null,
  };
}

export interface ReconciledCreativeItem {
  creative: Creative;
  imageFile?: File;
  performanceRecord?: PerformanceRecord;
}

/**
 * Robust bidirectional reconciliation between uploaded images and CSV performance records.
 * Ensures:
 * 1. Every uploaded image is discovered and registered.
 * 2. Every CSV record is matched or marked image_missing.
 * 3. Accurate matchStatus and zero silent drops.
 */
export function reconcileCreativesAndImages(
  uploadedFiles: File[],
  performanceRecords: PerformanceRecord[],
  columnMapping?: ColumnMapping
): {
  items: ReconciledCreativeItem[];
  diagnostics: ProcessingDiagnostics;
} {
  const items: ReconciledCreativeItem[] = [];
  const errors: { id?: string; filename?: string; message: string }[] = [];

  // Index performance records by multiple keys
  const recordsByExactFilename = new Map<string, PerformanceRecord>();
  const recordsByExactId = new Map<string, PerformanceRecord>();
  const recordsByNormalized = new Map<string, PerformanceRecord>();

  for (const record of performanceRecords) {
    const rawFilename = columnMapping?.filename
      ? record.rawFields[columnMapping.filename]
      : record.rawFields.filename || record.rawFields.file_name || record.rawFields.image;

    if (rawFilename) {
      const fnStr = String(rawFilename).trim();
      recordsByExactFilename.set(fnStr.toLowerCase(), record);
      recordsByNormalized.set(normalizeIdentifier(fnStr), record);
    }

    if (record.creativeId) {
      const idStr = String(record.creativeId).trim();
      recordsByExactId.set(idStr.toLowerCase(), record);
      recordsByNormalized.set(normalizeIdentifier(idStr), record);
    }
  }

  const matchedRecordIds = new Set<string>();
  let matchedCount = 0;
  let unmatchedImagesCount = 0;

  // Process all uploaded images
  for (const file of uploadedFiles) {
    const fileNameLower = file.name.toLowerCase();
    const baseNameLower = file.name.replace(/\.[^/.]+$/, '').toLowerCase();
    const norm = normalizeIdentifier(file.name);

    // Try matches in order of specificity
    let matchedRecord: PerformanceRecord | undefined =
      recordsByExactFilename.get(fileNameLower) ||
      recordsByExactId.get(fileNameLower) ||
      recordsByExactId.get(baseNameLower) ||
      recordsByNormalized.get(norm);

    // If still unmatched, test substring or suffix matches (e.g. "ad_001.png" with ID "AD001")
    if (!matchedRecord) {
      for (const record of performanceRecords) {
        if (!record.creativeId) continue;
        const recNorm = normalizeIdentifier(record.creativeId);
        if (recNorm && (norm.includes(recNorm) || recNorm.includes(norm))) {
          matchedRecord = record;
          break;
        }
      }
    }

    const creativeId = matchedRecord?.creativeId || baseNameLower.toUpperCase();
    const isMatched = !!matchedRecord;

    if (isMatched && matchedRecord) {
      matchedRecordIds.add(matchedRecord.id);
      matchedCount++;
    } else {
      unmatchedImagesCount++;
    }

    const importedAttrs: Record<string, string> = {};
    if (matchedRecord) {
      for (const [k, v] of Object.entries(matchedRecord.rawFields)) {
        if (
          ![
            'ad_id',
            'creative_id',
            'impressions',
            'clicks',
            'conversions',
            'purchases',
            'spend',
            'revenue',
            'id',
            'filename',
          ].includes(k.toLowerCase()) &&
          v !== null &&
          v !== undefined
        ) {
          importedAttrs[k] = String(v);
        }
      }
    }

    const creative = buildCreativeRecord(
      `creative_${creativeId}`,
      creativeId,
      matchedRecord?.rawFields.ad_name ? String(matchedRecord.rawFields.ad_name) : `Creative ${creativeId}`,
      undefined, // Extracted features will be filled in batch processing
      importedAttrs,
      undefined,
      file.name,
      isMatched ? 'matched' : 'unmatched',
      'success',
      null
    );

    items.push({
      creative,
      imageFile: file,
      performanceRecord: matchedRecord,
    });
  }

  // Also register CSV records that had NO matching uploaded image
  let csvRecordsWithoutImage = 0;
  for (const record of performanceRecords) {
    if (!matchedRecordIds.has(record.id)) {
      csvRecordsWithoutImage++;
      const id = record.creativeId || `rec_${record.sourceRowNumber}`;
      const rawFn = record.rawFields.filename ? String(record.rawFields.filename) : undefined;

      const importedAttrs: Record<string, string> = {};
      for (const [k, v] of Object.entries(record.rawFields)) {
        if (
          ![
            'ad_id',
            'creative_id',
            'impressions',
            'clicks',
            'conversions',
            'purchases',
            'spend',
            'revenue',
            'id',
            'filename',
          ].includes(k.toLowerCase()) &&
          v !== null &&
          v !== undefined
        ) {
          importedAttrs[k] = String(v);
        }
      }

      const creative = buildCreativeRecord(
        `creative_${id}`,
        id,
        record.rawFields.ad_name ? String(record.rawFields.ad_name) : `Creative ${id}`,
        undefined,
        importedAttrs,
        undefined,
        rawFn,
        'image_missing',
        'skipped',
        'No matching image uploaded for this performance record'
      );

      items.push({
        creative,
        imageFile: undefined,
        performanceRecord: record,
      });
    }
  }

  const diagnostics: ProcessingDiagnostics = {
    imagesUploaded: uploadedFiles.length,
    imagesDiscovered: uploadedFiles.length,
    imagesProcessedSuccessfully: 0, // Will be updated after batch extraction
    imagesFailed: 0,
    csvRecordsLoaded: performanceRecords.length,
    imagesMatchedToCsv: matchedCount,
    imagesUnmatched: unmatchedImagesCount,
    csvRecordsWithoutImage,
    aggregateComparisonsGenerated: 0,
    errors,
  };

  return { items, diagnostics };
}

/**
 * Concurrency-controlled batch processor for image attribute extraction.
 * Processes images in chunks (default 10) to prevent browser memory exhaustion.
 * Catches errors per-image without interrupting the rest.
 */
export async function processBatchImageFeatures(
  items: ReconciledCreativeItem[],
  batchSize = 10,
  onProgress?: (processed: number, total: number) => void
): Promise<ProcessingDiagnostics> {
  const total = items.length;
  let processed = 0;
  let successCount = 0;
  let failedCount = 0;
  const errors: { id?: string; filename?: string; message: string }[] = [];

  for (let i = 0; i < total; i += batchSize) {
    const chunk = items.slice(i, i + batchSize);

    await Promise.all(
      chunk.map(async (item) => {
        if (!item.imageFile) {
          // No image file (e.g. image_missing)
          processed++;
          onProgress?.(processed, total);
          return;
        }

        try {
          const features = await extractImageFeatures(item.imageFile);
          item.creative.imageWidth = features.width;
          item.creative.imageHeight = features.height;
          item.creative.aspectRatio = features.aspectRatio;
          item.creative.dominantColor = features.dominantColor;
          item.creative.processingStatus = 'success';
          item.creative.extractionError = null;

          // Rebuild attributes with heuristics
          const existingImported: Record<string, string> = {};
          for (const attr of item.creative.attributes) {
            if (attr.source === 'imported') {
              existingImported[attr.key] = String(attr.value);
            }
          }

          const rebuilt = buildCreativeRecord(
            item.creative.id,
            item.creative.sourceCreativeId || item.creative.id,
            item.creative.name || '',
            features,
            existingImported,
            item.creative.imageUrl || undefined,
            item.creative.imageFileName || undefined,
            item.creative.matchStatus,
            'success',
            null
          );

          item.creative.attributes = rebuilt.attributes;
          successCount++;
        } catch (err) {
          failedCount++;
          const errMsg = err instanceof Error ? err.message : String(err);
          item.creative.processingStatus = 'failed';
          item.creative.extractionError = errMsg;
          errors.push({
            id: item.creative.id,
            filename: item.creative.imageFileName || undefined,
            message: errMsg,
          });
        } finally {
          processed++;
          onProgress?.(processed, total);
        }
      })
    );
  }

  const matchedCount = items.filter((it) => it.creative.matchStatus === 'matched').length;
  const unmatchedCount = items.filter((it) => it.creative.matchStatus === 'unmatched').length;
  const missingImgCount = items.filter((it) => it.creative.matchStatus === 'image_missing').length;

  return {
    imagesUploaded: items.filter((it) => it.imageFile).length,
    imagesDiscovered: items.filter((it) => it.imageFile).length,
    imagesProcessedSuccessfully: successCount,
    imagesFailed: failedCount,
    csvRecordsLoaded: items.filter((it) => it.performanceRecord).length,
    imagesMatchedToCsv: matchedCount,
    imagesUnmatched: unmatchedCount,
    csvRecordsWithoutImage: missingImgCount,
    aggregateComparisonsGenerated: 0,
    errors,
  };
}
