import { Creative, CreativeAttribute } from '../../types';

export interface ImageExtractionResult {
  width: number;
  height: number;
  aspectRatio: number;
  aspectRatioLabel: string;
  dominantColor: string;
  brightness: 'light' | 'dark' | 'neutral';
}

/**
 * Categorizes numerical aspect ratio into standard social ad format labels.
 */
export function categorizeAspectRatio(ratio: number): string {
  if (Math.abs(ratio - 1.0) < 0.08) return '1:1 Square';
  if (Math.abs(ratio - 0.5625) < 0.1 || Math.abs(ratio - (9 / 16)) < 0.1) return '9:16 Vertical Story';
  if (Math.abs(ratio - 0.8) < 0.08 || Math.abs(ratio - (4 / 5)) < 0.08) return '4:5 Feed Portrait';
  if (Math.abs(ratio - 1.777) < 0.15 || Math.abs(ratio - (16 / 9)) < 0.15) return '16:9 Landscape';
  return `${ratio.toFixed(2)}:1 Custom`;
}

/**
 * Extracts basic dimensions and color heuristics from an image File.
 * Runs entirely client-side using browser HTML Image and Canvas.
 */
export function extractImageFeatures(file: File): Promise<ImageExtractionResult> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      const aspectRatio = height > 0 ? width / height : 1;
      const aspectRatioLabel = categorizeAspectRatio(aspectRatio);

      // Create temporary canvas to sample dominant color
      let dominantColor = '#7C3AED';
      let brightness: 'light' | 'dark' | 'neutral' = 'neutral';

      try {
        const canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 16, 16);
          const imageData = ctx.getImageData(0, 0, 16, 16).data;
          let r = 0, g = 0, b = 0;
          const pixelCount = imageData.length / 4;
          for (let i = 0; i < imageData.length; i += 4) {
            r += imageData[i];
            g += imageData[i + 1];
            b += imageData[i + 2];
          }
          r = Math.round(r / pixelCount);
          g = Math.round(g / pixelCount);
          b = Math.round(b / pixelCount);
          dominantColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
          const avgLuma = 0.299 * r + 0.587 * g + 0.114 * b;
          brightness = avgLuma > 170 ? 'light' : avgLuma < 85 ? 'dark' : 'neutral';
        }
      } catch {
        // Fallback gracefully if canvas extraction encounters an issue
      } finally {
        URL.revokeObjectURL(objectUrl);
      }

      resolve({
        width,
        height,
        aspectRatio,
        aspectRatioLabel,
        dominantColor,
        brightness,
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load image: ${file.name}`));
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
  imageFileName?: string
): Creative {
  const attributes: CreativeAttribute[] = [];

  if (extracted) {
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
    if (extracted.brightness) {
      attributes.push({
        key: 'brightness',
        name: 'Visual Brightness',
        value: extracted.brightness === 'light' ? 'High Brightness' : 'Standard Brightness',
        source: 'heuristic',
        confidence: null,
        reviewed: false,
      });
    }
  }

  if (importedAttributes) {
    for (const [key, val] of Object.entries(importedAttributes)) {
      if (val !== undefined && val !== null && String(val).trim() !== '') {
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
    matchStatus: imageUrl ? 'matched' : 'image_missing',
  };
}
