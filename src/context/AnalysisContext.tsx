import React, { createContext, useState, useMemo, useCallback } from 'react';
import {
  AnalysisSession,
  Creative,
  PerformanceRecord,
  Finding,
  AggregateMetrics,
  TrendDataPoint,
  MetricKey,
  ProcessingDiagnostics,
} from '../types';
import {
  REAL_CREATIVES,
  REAL_PERFORMANCE_RECORDS,
  REAL_AGGREGATES,
  REAL_TRENDS,
  REAL_FINDINGS,
} from '../data/realDataset';
import {
  DEMO_CREATIVES,
  DEMO_PERFORMANCE_RECORDS,
  DEMO_FINDINGS,
  DEMO_AGGREGATES,
  DEMO_TRENDS,
} from '../data/demo/demoData';
import { calculateAggregates } from '../services/metrics/calculateMetrics';
import { generateFindings } from '../services/analysis/evidenceClassifier';

export interface AnalysisContextType {
  session: AnalysisSession;
  creatives: Creative[];
  performanceRecords: PerformanceRecord[];
  findings: Finding[];
  aggregates: AggregateMetrics;
  trends: TrendDataPoint[];
  selectedMetric: MetricKey;
  setSelectedMetric: (metric: MetricKey) => void;
  isDemoMode: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  datasetName: string;
  diagnostics: ProcessingDiagnostics | null;
  setDiagnostics: (diag: ProcessingDiagnostics | null) => void;
  loadRealDataset: () => void;
  loadDemoData: () => void;
  setUploadedDataset: (
    creatives: Creative[],
    records: PerformanceRecord[],
    sessionName?: string,
    diagnostics?: ProcessingDiagnostics
  ) => void;
  updateCreativeAttribute: (creativeId: string, attrKey: string, newValue: string) => void;
  resetSession: () => void;
  getFindingById: (id: string) => Finding | undefined;
}

const realDiagnostics: ProcessingDiagnostics = {
  imagesUploaded: 150,
  imagesDiscovered: 150,
  imagesProcessedSuccessfully: 150,
  imagesFailed: 0,
  csvRecordsLoaded: 150,
  imagesMatchedToCsv: 150,
  imagesUnmatched: 0,
  csvRecordsWithoutImage: 0,
  aggregateComparisonsGenerated: 24,
  errors: [],
};

const demoDiagnostics: ProcessingDiagnostics = {
  imagesUploaded: 60,
  imagesDiscovered: 60,
  imagesProcessedSuccessfully: 60,
  imagesFailed: 0,
  csvRecordsLoaded: 60,
  imagesMatchedToCsv: 60,
  imagesUnmatched: 0,
  csvRecordsWithoutImage: 0,
  aggregateComparisonsGenerated: 24,
  errors: [],
};

const realSession: AnalysisSession = {
  id: 'halcyon_meta_2026',
  name: 'Halcyon Meta Ads (Original Hackathon Dataset)',
  source: 'upload',
  createdAt: '2026-06-30T00:00:00.000Z',
  status: 'complete',
  metricSelection: 'ctr',
  recordCount: 150,
  warnings: [],
};

const demoSession: AnalysisSession = {
  id: 'demo_session',
  name: 'Demo Synthetic Ad Campaign',
  source: 'demo',
  createdAt: new Date().toISOString(),
  status: 'complete',
  metricSelection: 'ctr',
  recordCount: 60,
  warnings: [],
};

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default source of truth: Original Hackathon Dataset (150 Halcyon Meta ads)
  const [session, setSession] = useState<AnalysisSession>(realSession);
  const [creatives, setCreatives] = useState<Creative[]>(REAL_CREATIVES);
  const [performanceRecords, setPerformanceRecords] = useState<PerformanceRecord[]>(REAL_PERFORMANCE_RECORDS);
  const [customFindings, setCustomFindings] = useState<Finding[] | null>(REAL_FINDINGS);
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>('ctr');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [diagnostics, setDiagnostics] = useState<ProcessingDiagnostics | null>(realDiagnostics);

  const datasetName = useMemo(() => {
    if (isDemoMode) return 'Synthetic Demo Dataset (60 Creatives)';
    if (session.id === 'halcyon_meta_2026') return 'Halcyon Meta Ads — Hackathon Dataset (150 Creatives)';
    return session.name || 'Custom Uploaded Dataset';
  }, [isDemoMode, session]);

  const findings = useMemo(() => {
    if (customFindings) return customFindings;
    if (isDemoMode) return DEMO_FINDINGS;
    return generateFindings(creatives, performanceRecords, session.id);
  }, [customFindings, isDemoMode, creatives, performanceRecords, session.id]);

  const aggregates = useMemo(() => {
    if (!isDemoMode && session.id === 'halcyon_meta_2026') {
      return REAL_AGGREGATES;
    }
    if (isDemoMode) {
      return DEMO_AGGREGATES;
    }
    return calculateAggregates(performanceRecords, creatives.length);
  }, [isDemoMode, session.id, performanceRecords, creatives.length]);

  const trends = useMemo(() => {
    if (!isDemoMode && session.id === 'halcyon_meta_2026') {
      return REAL_TRENDS;
    }
    if (isDemoMode) {
      return DEMO_TRENDS;
    }
    const dateMap = new Map<string, { imps: number; clicks: number; convs: number }>();
    performanceRecords.forEach((r, idx) => {
      const key = r.date || `Batch ${Math.floor(idx / 10) + 1}`;
      const curr = dateMap.get(key) || { imps: 0, clicks: 0, convs: 0 };
      curr.imps += r.impressions || 0;
      curr.clicks += r.clicks || 0;
      curr.convs += r.conversions || 0;
      dateMap.set(key, curr);
    });

    return Array.from(dateMap.entries()).map(([k, v]) => ({
      dateOrIndex: k,
      impressions: v.imps,
      clicks: v.clicks,
      conversions: v.convs,
      ctr: v.imps > 0 ? v.clicks / v.imps : null,
      cvr: v.clicks > 0 ? v.convs / v.clicks : null,
      cpc: null,
      cpa: null,
    }));
  }, [isDemoMode, session.id, performanceRecords]);

  const loadRealDataset = useCallback(() => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      setSession(realSession);
      setCreatives(REAL_CREATIVES);
      setPerformanceRecords(REAL_PERFORMANCE_RECORDS);
      setCustomFindings(REAL_FINDINGS);
      setDiagnostics(realDiagnostics);
      setIsDemoMode(false);
      setSelectedMetric('ctr');
      setIsLoading(false);
    }, 150);
  }, []);

  const loadDemoData = useCallback(() => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      setSession(demoSession);
      setCreatives(DEMO_CREATIVES);
      setPerformanceRecords(DEMO_PERFORMANCE_RECORDS);
      setCustomFindings(DEMO_FINDINGS);
      setDiagnostics(demoDiagnostics);
      setIsDemoMode(true);
      setSelectedMetric('ctr');
      setIsLoading(false);
    }, 150);
  }, []);

  const setUploadedDataset = useCallback(
    (
      newCreatives: Creative[],
      newRecords: PerformanceRecord[],
      sessionName = 'Uploaded Analysis',
      customDiagnostics?: ProcessingDiagnostics
    ) => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const newSessionId = `session_${Date.now()}`;
        const newFindings = generateFindings(newCreatives, newRecords, newSessionId);

        const diag: ProcessingDiagnostics = customDiagnostics || {
          imagesUploaded: newCreatives.filter((c) => c.imageFileName).length,
          imagesDiscovered: newCreatives.filter((c) => c.imageFileName).length,
          imagesProcessedSuccessfully: newCreatives.filter((c) => c.processingStatus === 'success').length,
          imagesFailed: newCreatives.filter((c) => c.processingStatus === 'failed').length,
          csvRecordsLoaded: newRecords.length,
          imagesMatchedToCsv: newCreatives.filter((c) => c.matchStatus === 'matched').length,
          imagesUnmatched: newCreatives.filter((c) => c.matchStatus === 'unmatched').length,
          csvRecordsWithoutImage: newCreatives.filter((c) => c.matchStatus === 'image_missing').length,
          aggregateComparisonsGenerated: newFindings.length,
          errors: [],
        };
        diag.aggregateComparisonsGenerated = newFindings.length;
        setDiagnostics(diag);

        setSession({
          id: newSessionId,
          name: sessionName,
          source: 'upload',
          createdAt: new Date().toISOString(),
          status: 'complete',
          metricSelection: 'ctr',
          recordCount: newRecords.length,
          warnings: [],
        });
        setCreatives(newCreatives);
        setPerformanceRecords(newRecords);
        setCustomFindings(newFindings);
        setIsDemoMode(false);
        setSelectedMetric('ctr');
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'Analysis calculation failed.');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateCreativeAttribute = useCallback(
    (creativeId: string, attrKey: string, newValue: string) => {
      setCreatives((prev) =>
        prev.map((c) => {
          if (c.id !== creativeId) return c;
          const attrIndex = c.attributes.findIndex((a) => a.key === attrKey);
          const updatedAttrs = [...c.attributes];
          if (attrIndex >= 0) {
            updatedAttrs[attrIndex] = {
              ...updatedAttrs[attrIndex],
              value: newValue,
              source: 'manual',
              reviewed: true,
            };
          } else {
            updatedAttrs.push({
              key: attrKey,
              name: attrKey.replace(/_/g, ' '),
              value: newValue,
              source: 'manual',
              confidence: null,
              reviewed: true,
            });
          }
          return { ...c, attributes: updatedAttrs };
        })
      );
      setCustomFindings(null);
    },
    []
  );

  const resetSession = useCallback(() => {
    setSession({
      id: `empty_${Date.now()}`,
      name: 'New Session',
      source: 'upload',
      createdAt: new Date().toISOString(),
      status: 'draft',
      metricSelection: 'ctr',
      recordCount: 0,
      warnings: [],
    });
    setCreatives([]);
    setPerformanceRecords([]);
    setCustomFindings([]);
    setIsDemoMode(false);
  }, []);

  const getFindingById = useCallback(
    (id: string) => {
      return findings.find((f) => f.id === id);
    },
    [findings]
  );

  return (
    <AnalysisContext.Provider
      value={{
        session,
        creatives,
        performanceRecords,
        findings,
        aggregates,
        trends,
        selectedMetric,
        setSelectedMetric,
        isDemoMode,
        isLoading,
        errorMessage,
        datasetName,
        diagnostics,
        setDiagnostics,
        loadRealDataset,
        loadDemoData,
        setUploadedDataset,
        updateCreativeAttribute,
        resetSession,
        getFindingById,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export { AnalysisContext };
// eslint-disable-next-line react-refresh/only-export-components
export { useAnalysis } from '../hooks/useAnalysis';
