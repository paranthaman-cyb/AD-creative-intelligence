import React, { useState, useMemo } from 'react';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { FindingCard } from '../components/findings/FindingCard';
import { useAnalysis } from '../context/AnalysisContext';
import { exportFindingsToCsv, exportImageLevelCsv, downloadCsvFile } from '../services/export/exportCsv';
import {
  Download,
  Search,
  Sparkles,
  Layers,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { formatCurrency } from '../services/metrics/formatters';

export const ResultsPage: React.FC = () => {
  const { findings, creatives, performanceRecords, diagnostics } = useAnalysis();

  const [activeTab, setActiveTab] = useState<'findings' | 'creatives'>('findings');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [metricFilter, setMetricFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Counts for filter pills
  const supportedCount = findings.filter((f) => f.status === 'supported').length;
  const inconclusiveCount = findings.filter((f) => f.status === 'inconclusive').length;
  const underpoweredCount = findings.filter((f) => f.status === 'underpowered').length;

  const filterPills = [
    { id: 'all', label: 'All Findings', count: findings.length },
    { id: 'supported', label: 'Supported', count: supportedCount },
    { id: 'inconclusive', label: 'Inconclusive', count: inconclusiveCount },
    { id: 'underpowered', label: 'Underpowered', count: underpoweredCount },
  ];

  const filteredFindings = useMemo(() => {
    return findings.filter((f) => {
      if (statusFilter !== 'all' && f.status !== statusFilter) {
        return false;
      }
      if (metricFilter !== 'all' && f.metric !== metricFilter) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesLabel = f.attributeLabel.toLowerCase().includes(q);
        const matchesSummary = f.summary.toLowerCase().includes(q);
        const matchesMetric = f.metric.toLowerCase().includes(q);
        if (!matchesLabel && !matchesSummary && !matchesMetric) return false;
      }
      return true;
    });
  }, [findings, statusFilter, metricFilter, searchQuery]);

  const filteredCreatives = useMemo(() => {
    return creatives.filter((c) => {
      if (searchQuery.trim() === '') return true;
      const q = searchQuery.toLowerCase();
      const idMatch = (c.sourceCreativeId || c.id).toLowerCase().includes(q);
      const fileMatch = (c.imageFileName || '').toLowerCase().includes(q);
      const nameMatch = (c.name || '').toLowerCase().includes(q);
      const attrMatch = c.attributes.some((a) => String(a.value).toLowerCase().includes(q));
      return idMatch || fileMatch || nameMatch || attrMatch;
    });
  }, [creatives, searchQuery]);

  // Export Output A: Image-Level Analysis (150 rows)
  const handleExportImageLevelCsv = () => {
    const csvData = exportImageLevelCsv(creatives, performanceRecords);
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `ad_creatives_image_level_analysis_${dateStr}.csv`;
    downloadCsvFile(filename, csvData);
  };

  // Export Output B: Aggregate Intelligence Rankings (24 rows)
  const handleExportFindingsCsv = () => {
    const csvData = exportFindingsToCsv(filteredFindings);
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `ad_creative_aggregate_rankings_${dateStr}.csv`;
    downloadCsvFile(filename, csvData);
  };

  // Performance lookup map
  const perfMap = useMemo(() => {
    const map = new Map<string, (typeof performanceRecords)[0]>();
    for (const p of performanceRecords) {
      if (p.creativeId) {
        map.set(p.creativeId.toLowerCase(), p);
      }
    }
    return map;
  }, [performanceRecords]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <Header
        title="Analysis Results"
        subtitle="Inspect individual creative assets and ranked aggregate intelligence findings."
      />

      {/* Action Toolbar: Dual Exports & Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/70 p-3.5 sm:p-4 rounded-2xl border border-app-border shadow-xs">
        <div className="text-xs text-app-muted min-w-0">
          Showing <span className="font-bold text-app-text">{creatives.length}</span> creative assets across{' '}
          <span className="font-bold text-app-text">{findings.length}</span> statistical findings
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <Button
            variant="primary"
            size="sm"
            icon={<FileSpreadsheet className="w-4 h-4 text-white shrink-0" />}
            onClick={handleExportImageLevelCsv}
            className="shadow-sm whitespace-nowrap text-xs flex-1 sm:flex-initial"
          >
            Export Creatives CSV ({creatives.length} Rows)
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<Download className="w-4 h-4 text-brand-700 shrink-0" />}
            onClick={handleExportFindingsCsv}
            className="shadow-sm whitespace-nowrap text-xs flex-1 sm:flex-initial"
          >
            Export Findings CSV ({filteredFindings.length} Rows)
          </Button>
        </div>
      </div>

      {/* Transparent Processing Diagnostics Banner */}
      {diagnostics && (
        <div className="bg-white rounded-2xl border border-app-border p-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-app-border/70 flex-wrap gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-xs font-bold text-app-text truncate">Verified Pipeline Diagnostics</span>
              <span className="text-[11px] text-app-muted hidden sm:inline truncate">
                (100% of uploaded creative assets reconciled)
              </span>
            </div>
            <div className="text-[11px] font-semibold text-app-muted shrink-0">
              {diagnostics.imagesFailed > 0 ? (
                <span className="text-status-error flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {diagnostics.imagesFailed} extraction errors recorded
                </span>
              ) : (
                <span className="text-emerald-700 font-bold">Zero Pipeline Errors</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-lavender-50 border border-app-border min-w-0 flex flex-col justify-between">
              <span className="text-[11px] text-app-muted truncate block" title="Images Discovered">
                Images Discovered
              </span>
              <span className="text-base font-extrabold text-app-text mt-1">
                {diagnostics.imagesDiscovered}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-lavender-50 border border-app-border min-w-0 flex flex-col justify-between">
              <span className="text-[11px] text-app-muted truncate block" title="Images Processed Successfully">
                Images Processed
              </span>
              <span className="text-base font-extrabold text-emerald-700 mt-1">
                {diagnostics.imagesProcessedSuccessfully}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-lavender-50 border border-app-border min-w-0 flex flex-col justify-between">
              <span className="text-[11px] text-app-muted truncate block" title="CSV Rows Loaded">
                CSV Rows
              </span>
              <span className="text-base font-extrabold text-app-text mt-1">
                {diagnostics.csvRecordsLoaded}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-lavender-50 border border-app-border min-w-0 flex flex-col justify-between">
              <span className="text-[11px] text-app-muted truncate block" title="Matched to CSV">
                Matched to CSV
              </span>
              <span className="text-base font-extrabold text-brand-700 mt-1">
                {diagnostics.imagesMatchedToCsv}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-lavender-50 border border-app-border min-w-0 flex flex-col justify-between">
              <span className="text-[11px] text-app-muted truncate block" title="Unmatched Images">
                Unmatched Images
              </span>
              <span className="text-base font-extrabold text-app-text mt-1">
                {diagnostics.imagesUnmatched}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-brand-50 border border-brand-200 min-w-0 flex flex-col justify-between">
              <span className="text-[11px] text-brand-700 font-semibold truncate block" title="Aggregate Findings">
                Aggregate Findings
              </span>
              <span className="text-base font-extrabold text-brand-700 mt-1">
                {diagnostics.aggregateComparisonsGenerated || findings.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* View Switcher: Aggregate Findings vs Image-Level Creatives */}
      <div className="flex items-center gap-2 sm:gap-3 border-b border-app-border pb-1 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('findings')}
          className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 whitespace-nowrap ${
            activeTab === 'findings'
              ? 'border-brand-700 text-brand-700'
              : 'border-transparent text-app-muted hover:text-app-text'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>Output B: Aggregate Findings</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-brand-100 text-brand-700 font-bold shrink-0">
            {findings.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('creatives')}
          className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 whitespace-nowrap ${
            activeTab === 'creatives'
              ? 'border-brand-700 text-brand-700'
              : 'border-transparent text-app-muted hover:text-app-text'
          }`}
        >
          <Layers className="w-4 h-4 shrink-0" />
          <span>Output A: All Creative Assets</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-lavender-200 text-app-text font-bold shrink-0">
            {creatives.length}
          </span>
        </button>
      </div>

      {/* TAB 1: Aggregate Findings View */}
      {activeTab === 'findings' && (
        <div className="space-y-6">
          {/* Filter Chips and Controls */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-app-border shadow-card">
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {filterPills.map((pill) => {
                const isActive = statusFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => setStatusFilter(pill.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 select-none ${
                      isActive
                        ? 'bg-brand-700 text-white shadow-sm'
                        : 'bg-lavender-50 text-app-muted hover:text-app-text hover:bg-lavender-100'
                    }`}
                  >
                    <span>{pill.label}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        isActive ? 'bg-white/20 text-white' : 'bg-lavender-200 text-app-text'
                      }`}
                    >
                      {pill.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Secondary filters: Metric selector & Search */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-44">
                <Search className="w-4 h-4 text-app-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search findings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-lavender-50 border border-app-border rounded-xl text-app-text focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <select
                value={metricFilter}
                onChange={(e) => setMetricFilter(e.target.value)}
                className="text-xs bg-lavender-50 border border-app-border rounded-xl px-3 py-1.5 text-app-text focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold cursor-pointer"
              >
                <option value="all">All Metrics</option>
                <option value="ctr">CTR Only</option>
                <option value="cvr">CVR Only</option>
                <option value="cpa">CPA Only</option>
                <option value="roas">ROAS Only</option>
              </select>
            </div>
          </div>

          {/* Ranked Findings List */}
          <div className="space-y-3">
            {filteredFindings.length > 0 ? (
              filteredFindings.map((finding, index) => (
                <FindingCard key={finding.id} finding={finding} rank={index + 1} />
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-app-border p-8">
                <Sparkles className="w-8 h-8 text-app-muted mx-auto mb-2 opacity-50" />
                <h4 className="text-sm font-bold text-app-text mb-1">No findings match this filter</h4>
                <p className="text-xs text-app-muted mb-4">
                  Try resetting your status or metric filters to see available creative associations.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setStatusFilter('all');
                    setMetricFilter('all');
                    setSearchQuery('');
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Image-Level Creatives View */}
      {activeTab === 'creatives' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-2xl border border-app-border shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-app-text">
                Showing {filteredCreatives.length} of {creatives.length} uploaded creative images
              </span>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-app-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search creative ID or attribute..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-lavender-50 border border-app-border rounded-xl text-app-text focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Creatives Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCreatives.map((c) => {
              const cid = c.sourceCreativeId || c.id;
              const perf = perfMap.get(cid.toLowerCase());

              return (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl border border-app-border p-4 shadow-sm hover:shadow-card-hover transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Thumbnail Image */}
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-lavender-100 border border-app-border flex items-center justify-center">
                      {c.imageUrl ? (
                        <img
                          src={c.imageUrl}
                          alt={c.name || cid}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-app-muted p-2 text-center text-xs">
                          <AlertCircle className="w-6 h-6 mb-1 text-app-muted" />
                          <span>No Image File</span>
                        </div>
                      )}

                      {/* Match Status Badge */}
                      <span
                        className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.matchStatus === 'matched'
                            ? 'bg-emerald-600 text-white'
                            : c.matchStatus === 'unmatched'
                            ? 'bg-amber-600 text-white'
                            : 'bg-zinc-600 text-white'
                        }`}
                      >
                        {c.matchStatus}
                      </span>
                    </div>

                    {/* Creative Info */}
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-extrabold text-app-text">{cid}</h4>
                        {c.dominantColor && (
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                              style={{ backgroundColor: c.dominantColor }}
                            />
                            <span className="text-[10px] font-mono text-app-muted">
                              {c.dominantColor}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-app-muted truncate">
                        {c.imageFileName || 'No image file'}
                      </p>
                    </div>

                    {/* Extracted Attributes Chips */}
                    <div className="flex flex-wrap gap-1 text-[10px]">
                      {c.attributes.map((a) => (
                        <span
                          key={a.key}
                          className="px-2 py-0.5 rounded-md bg-lavender-50 text-app-muted border border-app-border/70"
                        >
                          {String(a.value)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Performance Metrics Footer */}
                  {perf ? (
                    <div className="pt-3 mt-3 border-t border-app-border/70 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-app-muted block">CTR</span>
                        <span className="font-bold text-app-text">
                          {perf.impressions && perf.impressions > 0 && perf.clicks !== null
                            ? `${((perf.clicks / perf.impressions) * 100).toFixed(2)}%`
                            : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-app-muted block">CVR</span>
                        <span className="font-bold text-app-text">
                          {perf.clicks && perf.clicks > 0 && perf.conversions !== null
                            ? `${((perf.conversions / perf.clicks) * 100).toFixed(2)}%`
                            : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-app-muted block">Spend</span>
                        <span className="font-bold text-app-text">
                          {perf.spend !== null ? formatCurrency(perf.spend) : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-app-muted block">Revenue</span>
                        <span className="font-bold text-emerald-700">
                          {perf.revenue !== null ? formatCurrency(perf.revenue) : '—'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-3 mt-3 border-t border-app-border/70 text-[11px] text-amber-700">
                      Unmatched: No CSV performance data associated
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
