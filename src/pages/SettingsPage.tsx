import React from 'react';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAnalysis } from '../context/AnalysisContext';
import { downloadCsvFile } from '../services/export/exportCsv';
import {
  Sparkles,
  Download,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Database,
  Layers,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    session,
    isDemoMode,
    loadRealDataset,
    loadDemoData,
    resetSession,
    creatives,
    performanceRecords,
    datasetName,
  } = useAnalysis();

  const handleDownloadOriginalCsv = () => {
    // Read the static dataset file from public
    fetch('/dataset/creative_performance.csv')
      .then((res) => res.text())
      .then((csvText) => {
        downloadCsvFile('halcyon_creative_performance.csv', csvText);
      })
      .catch(() => {
        alert('Could not download original CSV file.');
      });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Header
        title="Settings &amp; Dataset Management"
        subtitle="Manage your active dataset, inspect inference thresholds, and download hackathon source files."
      />

      {/* Current Session Status Card */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-bold text-app-text">Active Analysis Dataset</h3>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-700">
            {isDemoMode ? 'Synthetic Demo Mode' : 'Original Hackathon Dataset'}
          </span>
        </div>
        <p className="text-xs text-app-muted mb-4">
          Source: <strong className="text-app-text">{datasetName}</strong> • Session ID:{' '}
          <code className="bg-lavender-100 px-1.5 py-0.5 rounded text-brand-700">{session.id}</code>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-xs">
          <div className="p-3 bg-lavender-50 rounded-xl border border-app-border">
            <span className="text-app-muted block">Brand &amp; Category</span>
            <span className="font-bold text-app-text">Halcyon (Water Bottles)</span>
          </div>
          <div className="p-3 bg-lavender-50 rounded-xl border border-app-border">
            <span className="text-app-muted block">Active Creatives</span>
            <span className="font-bold text-app-text">{creatives.length} PNG Assets (800x800)</span>
          </div>
          <div className="p-3 bg-lavender-50 rounded-xl border border-app-border">
            <span className="text-app-muted block">Performance Rows</span>
            <span className="font-bold text-app-text">{performanceRecords.length} Records</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-app-border">
          <Button
            variant="primary"
            size="sm"
            icon={<Database className="w-4 h-4" />}
            onClick={loadRealDataset}
          >
            Load Hackathon Dataset (150)
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<Sparkles className="w-4 h-4 text-brand-700" />}
            onClick={loadDemoData}
          >
            Load Demo Dataset (60)
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={handleDownloadOriginalCsv}
          >
            Download creative_performance.csv
          </Button>

          <Button
            variant="danger"
            size="sm"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={resetSession}
          >
            Clear Session
          </Button>
        </div>
      </Card>

      {/* Dataset Provenance & Integrity Card */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-2 text-brand-700">
          <Layers className="w-5 h-5" />
          <h3 className="text-base font-bold text-app-text">Original Dataset Provenance</h3>
        </div>
        <p className="text-xs text-app-muted leading-relaxed mb-4">
          Provided in folder <code>PS-02_ad_creative_intelligence</code> for Halcyon insulated water bottle ads on Meta. All 150 ad images (<code>ad_001.png</code> through <code>ad_150.png</code>) match 1-to-1 with rows in <code>creative_performance.csv</code>.
        </p>

        <div className="p-3.5 bg-lavender-50 rounded-xl text-xs space-y-1.5 border border-app-border">
          <div className="flex justify-between">
            <span className="text-app-muted">Date Coverage:</span>
            <span className="font-semibold text-app-text">April 2, 2026 – June 29, 2026</span>
          </div>
          <div className="flex justify-between">
            <span className="text-app-muted">Total Impressions:</span>
            <span className="font-semibold text-app-text">20,408,659</span>
          </div>
          <div className="flex justify-between">
            <span className="text-app-muted">Total Spend:</span>
            <span className="font-semibold text-app-text">$185,741.35</span>
          </div>
          <div className="flex justify-between">
            <span className="text-app-muted">Total Attributed Revenue:</span>
            <span className="font-semibold text-app-text">$336,657.59</span>
          </div>
        </div>
      </Card>

      {/* Statistical Configuration */}
      <Card className="p-6">
        <h3 className="text-base font-bold text-app-text mb-1">Statistical Inference Parameters</h3>
        <p className="text-xs text-app-muted mb-4">
          Auditable methodology rules governing evidence classification.
        </p>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 bg-lavender-50 rounded-xl">
            <div>
              <span className="font-bold text-app-text block">Confidence Level</span>
              <span className="text-app-muted text-[11px]">Two-tailed normal distribution critical z-value</span>
            </div>
            <span className="font-bold text-brand-700 bg-brand-100 px-2 py-1 rounded">95% (z = 1.96)</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-lavender-50 rounded-xl">
            <div>
              <span className="font-bold text-app-text block">Significance Threshold (α)</span>
              <span className="text-app-muted text-[11px]">Type I error rate tolerance</span>
            </div>
            <span className="font-bold text-brand-700 bg-brand-100 px-2 py-1 rounded">0.05</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-lavender-50 rounded-xl">
            <div>
              <span className="font-bold text-app-text block">Minimum Sample Size for Significance</span>
              <span className="text-app-muted text-[11px]">Cohorts below this threshold are labeled Underpowered</span>
            </div>
            <span className="font-bold text-brand-700 bg-brand-100 px-2 py-1 rounded">n ≥ 20 creatives</span>
          </div>
        </div>
      </Card>

      {/* Security & Data Privacy Notice */}
      <Card className="p-6">
        <div className="flex items-center gap-2 text-status-success mb-2">
          <ShieldCheck className="w-5 h-5" />
          <h3 className="text-base font-bold text-app-text">Client-Side Privacy Guarantee</h3>
        </div>
        <p className="text-xs text-app-muted leading-relaxed mb-4">
          All image rendering, CSV parsing, metric aggregation, and hypothesis testing execute locally in your web browser. No creative images, conversion numbers, or proprietary ad performance data are transmitted to third-party cloud servers or AI foundation models without explicit consent.
        </p>
        <div className="flex items-center gap-2 text-xs font-semibold text-status-success">
          <CheckCircle2 className="w-4 h-4" />
          <span>Local In-Memory Architecture Active</span>
        </div>
      </Card>
    </div>
  );
};
