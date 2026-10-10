import {
  Creative,
  PerformanceRecord,
  Finding,
  AggregateMetrics,
  TrendDataPoint,
} from '../types';
import rawDataset from './realDataset.json';
import { generateFindings } from '../services/analysis/evidenceClassifier';
import { calculateAggregates } from '../services/metrics/calculateMetrics';

export interface RawCreativeItem {
  id: string;
  sourceCreativeId: string;
  name: string;
  imageFileName: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  aspectRatio: number;
  dominantColor: string;
  brightness: number;
  contrast: number;
  edgeDensity: number;
  saturation: number;
  contrastLabel: string;
  brightnessLabel: string;
  saturationLabel: string;
  complexityLabel: string;
  palette: string;
  performance: {
    spend: number;
    impressions: number;
    clicks: number;
    purchases: number;
    revenue: number;
    launchDate: string;
    platform: string;
  };
}

export const REAL_CREATIVES: Creative[] = (rawDataset.creatives as RawCreativeItem[]).map((item) => ({
  id: item.id,
  analysisSessionId: 'halcyon_real_dataset',
  sourceCreativeId: item.sourceCreativeId,
  name: item.name,
  imageUrl: item.imageUrl,
  imageFileName: item.imageFileName,
  imageWidth: item.imageWidth,
  imageHeight: item.imageHeight,
  aspectRatio: item.aspectRatio,
  dominantColor: item.dominantColor,
  matchStatus: 'matched',
  attributes: [
    {
      key: 'contrast',
      name: 'Visual Contrast',
      value: item.contrastLabel,
      source: 'heuristic',
      confidence: null,
      reviewed: false,
    },
    {
      key: 'brightness',
      name: 'Visual Brightness',
      value: item.brightnessLabel,
      source: 'heuristic',
      confidence: null,
      reviewed: false,
    },
    {
      key: 'saturation',
      name: 'Color Saturation',
      value: item.saturationLabel,
      source: 'heuristic',
      confidence: null,
      reviewed: false,
    },
    {
      key: 'complexity',
      name: 'Composition Complexity',
      value: item.complexityLabel,
      source: 'heuristic',
      confidence: null,
      reviewed: false,
    },
    {
      key: 'palette',
      name: 'Color Palette',
      value: item.palette,
      source: 'heuristic',
      confidence: null,
      reviewed: false,
    },
    {
      key: 'aspect_ratio',
      name: 'Aspect Ratio',
      value: '1:1 Square (800x800)',
      source: 'heuristic',
      confidence: null,
      reviewed: false,
    },
  ],
}));

export const REAL_PERFORMANCE_RECORDS: PerformanceRecord[] = (rawDataset.creatives as RawCreativeItem[]).map(
  (item, idx) => ({
    id: `perf_${item.id}`,
    analysisSessionId: 'halcyon_real_dataset',
    creativeId: item.id,
    sourceRowNumber: idx + 1,
    campaignId: 'halcyon_meta_2026',
    date: item.performance.launchDate,
    impressions: item.performance.impressions,
    clicks: item.performance.clicks,
    conversions: item.performance.purchases,
    spend: item.performance.spend,
    revenue: item.performance.revenue,
    rawFields: {
      creative_id: item.id,
      filename: item.imageFileName,
      platform: item.performance.platform,
      launch_date: item.performance.launchDate,
      spend: item.performance.spend,
      impressions: item.performance.impressions,
      clicks: item.performance.clicks,
      purchases: item.performance.purchases,
      revenue: item.performance.revenue,
      contrast: item.contrastLabel,
      brightness: item.brightnessLabel,
      saturation: item.saturationLabel,
      complexity: item.complexityLabel,
      palette: item.palette,
    },
  })
);

export const REAL_AGGREGATES: AggregateMetrics = calculateAggregates(
  REAL_PERFORMANCE_RECORDS,
  REAL_CREATIVES.length
);

export const REAL_TRENDS: TrendDataPoint[] = rawDataset.trends as TrendDataPoint[];

export const REAL_FINDINGS: Finding[] = generateFindings(
  REAL_CREATIVES,
  REAL_PERFORMANCE_RECORDS,
  'halcyon_real_dataset'
);

export const REAL_DATASET_SUMMARY = {
  brand: rawDataset.summary.brand,
  category: rawDataset.summary.category,
  platform: rawDataset.summary.platform,
  totalCreatives: rawDataset.summary.totalCreatives,
  totalSpend: rawDataset.summary.totalSpend,
  totalImpressions: rawDataset.summary.totalImpressions,
  totalClicks: rawDataset.summary.totalClicks,
  totalPurchases: rawDataset.summary.totalPurchases,
  totalRevenue: rawDataset.summary.totalRevenue,
};
