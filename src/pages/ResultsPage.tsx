import React, { useState, useMemo } from 'react';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { FindingCard } from '../components/findings/FindingCard';
import { useAnalysis } from '../context/AnalysisContext';
import { exportFindingsToCsv, downloadCsvFile } from '../services/export/exportCsv';
import { Download, Search, Sparkles } from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const { findings } = useAnalysis();

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
      // Status filter
      if (statusFilter !== 'all' && f.status !== statusFilter) {
        return false;
      }
      // Metric filter
      if (metricFilter !== 'all' && f.metric !== metricFilter) {
        return false;
      }
      // Search filter
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

  const handleExportCsv = () => {
    const csvData = exportFindingsToCsv(filteredFindings);
    const filename = `ad_creative_findings_${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCsvFile(filename, csvData);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Header
          title="Analysis Results"
          subtitle="Ranked creative attributes and their association with performance."
        />
        <Button
          variant="secondary"
          size="md"
          icon={<Download className="w-4 h-4 text-brand-700" />}
          onClick={handleExportCsv}
          className="shrink-0 shadow-sm"
        >
          Export CSV
        </Button>
      </div>

      {/* Filter Chips and Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-app-border shadow-card">
        {/* Status Filter Chips matching mockup */}
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
  );
};
