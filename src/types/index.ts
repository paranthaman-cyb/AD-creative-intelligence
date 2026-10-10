export type MetricKey = 'ctr' | 'cvr' | 'cpc' | 'cpa' | 'roas';

export type EvidenceStatus = 'supported' | 'inconclusive' | 'underpowered' | 'not_available';

export type AttributeSource = 'heuristic' | 'imported' | 'manual';

export type MatchStatus = 'matched' | 'image_missing' | 'performance_missing' | 'unmatched';

export type SessionStatus = 'draft' | 'validating' | 'ready' | 'analyzing' | 'complete' | 'error';

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface ValidationIssue {
  field?: string;
  rowNumber?: number;
  message: string;
  severity: ValidationSeverity;
}

export interface CreativeAttribute {
  key: string;
  name: string;
  value: string | number | boolean | null;
  source: AttributeSource;
  confidence: number | null;
  reviewed: boolean;
}

export interface Creative {
  id: string;
  analysisSessionId: string;
  sourceCreativeId: string | null;
  name: string | null;
  headline?: string | null;
  imageUrl?: string | null;
  imageObjectUrl?: string | null;
  imageFileName?: string | null;
  imageWidth?: number | null;
  imageHeight?: number | null;
  aspectRatio?: number | null;
  dominantColor?: string | null;
  attributes: CreativeAttribute[];
  matchStatus: MatchStatus;
}

export interface PerformanceRecord {
  id: string;
  analysisSessionId: string;
  creativeId: string | null;
  sourceRowNumber: number;
  campaignId: string | null;
  date: string | null;
  impressions: number | null;
  clicks: number | null;
  conversions: number | null;
  spend: number | null;
  revenue: number | null;
  rawFields: Record<string, string | number | null>;
}

export interface ExampleCreativeDisplay {
  label: string;
  imageUrl?: string;
  metricValue: number | null;
  creativeId?: string;
  name?: string;
}

export interface Finding {
  id: string;
  analysisSessionId: string;
  attributeKey: string;
  attributeLabel: string;
  metric: MetricKey;
  groupLabels: string[];
  groupValues: number[];
  groupCounts: number[];
  groupRawNumerators?: number[];
  groupRawDenominators?: number[];
  effectSize: number | null;
  confidenceInterval: [number, number] | null;
  sampleSize: number;
  status: EvidenceStatus;
  method: string;
  limitations: string[];
  summary: string;
  imageExamples?: ExampleCreativeDisplay[];
  relatedFindingIds?: string[];
}

export interface ColumnMapping {
  creativeId: string;
  impressions: string;
  clicks: string;
  conversions?: string;
  spend?: string;
  revenue?: string;
  campaignId?: string;
  date?: string;
  name?: string;
  [key: string]: string | undefined;
}

export interface AnalysisSession {
  id: string;
  name: string;
  source: 'upload' | 'demo';
  createdAt: string;
  status: SessionStatus;
  metricSelection: MetricKey;
  recordCount: number;
  warnings: ValidationIssue[];
}

export interface AggregateMetrics {
  totalCreatives: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number | null;
  totalSpend: number | null;
  totalRevenue: number | null;
  ctr: number | null; // clicks / impressions
  cvr: number | null; // conversions / clicks
  cpc: number | null; // spend / clicks
  cpa: number | null; // spend / conversions
  roas: number | null; // revenue / spend
}

export interface TrendDataPoint {
  dateOrIndex: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number | null;
  cvr: number | null;
  cpc: number | null;
  cpa: number | null;
  roas?: number | null;
}
