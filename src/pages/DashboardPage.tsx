import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PerformanceLineChart } from '../components/charts/PerformanceLineChart';
import { EvidenceDonutChart } from '../components/charts/EvidenceDonutChart';
import { useAnalysis } from '../context/AnalysisContext';
import { formatNumber, formatCurrency, formatPercent } from '../services/metrics/formatters';
import {
  Layers,
  Eye,
  MousePointerClick,
  CheckCircle,
  ArrowRight,
  Info,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { aggregates, trends, findings, creatives, performanceRecords, isDemoMode } = useAnalysis();

  // Find top-performing creative by conversions/purchases
  const topCreative = React.useMemo(() => {
    if (creatives.length === 0) return null;
    let best = creatives[0];
    let maxPurchases = -1;

    for (const c of creatives) {
      const p = performanceRecords.find((r) => r.creativeId === (c.sourceCreativeId || c.id));
      if (p && (p.conversions ?? 0) > maxPurchases) {
        maxPurchases = p.conversions ?? 0;
        best = c;
      }
    }
    const bestPerf = performanceRecords.find((r) => r.creativeId === (best.sourceCreativeId || best.id));
    return { creative: best, performance: bestPerf };
  }, [creatives, performanceRecords]);

  return (
    <div className="space-y-8">
      <Header
        title="Dashboard"
        subtitle={
          isDemoMode
            ? 'Overview of synthetic ad creative analysis.'
            : 'Performance overview for Halcyon Meta Ads (150 creatives, Meta platform).'
        }
      />

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="flex items-center gap-3.5 sm:gap-4 p-4 sm:p-5 hover:shadow-card-hover transition-all min-w-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-app-muted block truncate">Creatives Analyzed</span>
            <span className="text-xl sm:text-2xl font-extrabold text-app-text tracking-tight block my-0.5">
              {aggregates.totalCreatives}
            </span>
            <span className="text-[11px] font-semibold text-app-muted block">
              {isDemoMode ? 'Synthetic Cohort' : 'Meta Feed (800×800)'}
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5 sm:gap-4 p-4 sm:p-5 hover:shadow-card-hover transition-all min-w-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-lavender-100 text-brand-600 flex items-center justify-center shrink-0">
            <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-app-muted block truncate">Total Impressions</span>
            <span className="text-xl sm:text-2xl font-extrabold text-app-text tracking-tight block my-0.5">
              {formatNumber(aggregates.totalImpressions)}
            </span>
            <span className="text-[11px] font-semibold text-app-muted block">
              All ad placements
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5 sm:gap-4 p-4 sm:p-5 hover:shadow-card-hover transition-all min-w-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
            <MousePointerClick className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-app-muted block truncate">Total Clicks</span>
            <div className="flex items-baseline gap-1.5 flex-wrap my-0.5">
              <span className="text-xl sm:text-2xl font-extrabold text-app-text tracking-tight">
                {formatNumber(aggregates.totalClicks)}
              </span>
              <span className="text-xs font-bold text-brand-700 shrink-0">
                ({formatPercent(aggregates.ctr)})
              </span>
            </div>
            <span className="text-[11px] font-semibold text-app-muted block">
              CPC: {formatCurrency(aggregates.cpc)}
            </span>
          </div>
        </Card>

        <Card className="flex items-center gap-3.5 sm:gap-4 p-4 sm:p-5 hover:shadow-card-hover transition-all min-w-0">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-status-successBg text-status-success flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-app-muted block truncate">Total Purchases</span>
            <div className="flex items-baseline gap-1.5 flex-wrap my-0.5">
              <span className="text-xl sm:text-2xl font-extrabold text-app-text tracking-tight">
                {aggregates.totalConversions !== null ? formatNumber(aggregates.totalConversions) : 'N/A'}
              </span>
              {aggregates.cvr !== null && (
                <span className="text-xs font-bold text-status-success shrink-0">
                  ({formatPercent(aggregates.cvr)})
                </span>
              )}
            </div>
            <span className="text-[11px] font-semibold text-app-muted block">
              CPA: {formatCurrency(aggregates.cpa)}
            </span>
          </div>
        </Card>
      </div>

      {/* Secondary Financial KPI Strip */}
      {aggregates.totalSpend !== null && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-app-border p-4 flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-lavender-100 text-brand-700 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] text-app-muted uppercase font-bold tracking-wider block truncate">
                Total Ad Spend
              </span>
              <span className="text-base sm:text-lg font-bold text-app-text block truncate">
                {formatCurrency(aggregates.totalSpend)}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-app-border p-4 flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-status-successBg text-status-success flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] text-app-muted uppercase font-bold tracking-wider block truncate">
                Total Attributed Revenue
              </span>
              <span className="text-base sm:text-lg font-bold text-app-text block truncate">
                {formatCurrency(aggregates.totalRevenue)}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-app-border p-4 flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm shrink-0">
              ROAS
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] text-app-muted uppercase font-bold tracking-wider block truncate">
                Return on Ad Spend
              </span>
              <span className="text-base sm:text-lg font-bold text-brand-700 block truncate">
                {aggregates.roas !== null ? `${aggregates.roas.toFixed(2)}x` : '—'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Middle Section: Performance Trend Line Chart & Evidence Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <Card className="p-6 h-full">
            <PerformanceLineChart data={trends} initialMetric="ctr" />
          </Card>
        </div>

        <div className="lg:col-span-5">
          <Card className="p-6 h-full flex flex-col justify-between">
            <EvidenceDonutChart findings={findings} />
            <div className="pt-4 border-t border-app-border mt-4 flex items-center justify-between">
              <span className="text-xs text-app-muted font-medium">Ranked insights ready</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/results')}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Inspect All Findings
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Section: Top Performing Creative & Observational Caveat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Top Performing Creative Card */}
        <div className="lg:col-span-6">
          <Card className="p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-app-text">Top Performing Creative</h4>
              <span className="text-xs font-semibold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full">
                Highest Volume
              </span>
            </div>

            {topCreative?.creative && topCreative.performance ? (
              <div className="flex items-center gap-4 bg-lavender-50 p-4 rounded-xl border border-app-border">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-app-border bg-white">
                  <img
                    src={topCreative.creative.imageUrl || undefined}
                    alt={topCreative.creative.name || 'Top Ad'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/vite.svg';
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h5 className="text-sm font-bold text-app-text truncate">
                    {topCreative.creative.name}
                  </h5>
                  <p className="text-xs text-app-muted mb-2">
                    {topCreative.creative.attributes.map((a) => a.value).filter(Boolean).slice(0, 2).join(' • ')}
                  </p>

                  <div className="flex items-center gap-4 text-xs flex-wrap">
                    <div>
                      <span className="text-app-muted block text-[10px] uppercase font-bold">CTR</span>
                      <span className="font-bold text-brand-700">
                        {topCreative.performance.impressions
                          ? formatPercent((topCreative.performance.clicks || 0) / topCreative.performance.impressions)
                          : '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-app-muted block text-[10px] uppercase font-bold">Purchases</span>
                      <span className="font-bold text-app-text">
                        {topCreative.performance.conversions}
                      </span>
                    </div>
                    <div>
                      <span className="text-app-muted block text-[10px] uppercase font-bold">Spend</span>
                      <span className="font-bold text-app-text">
                        {formatCurrency(topCreative.performance.spend)}
                      </span>
                    </div>
                    <div>
                      <span className="text-app-muted block text-[10px] uppercase font-bold">ROAS</span>
                      <span className="font-bold text-status-success">
                        {topCreative.performance.spend && topCreative.performance.revenue
                          ? `${(topCreative.performance.revenue / topCreative.performance.spend).toFixed(2)}x`
                          : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-app-muted">No creative records loaded.</div>
            )}
          </Card>
        </div>

        {/* Association vs Causation Notice */}
        <div className="lg:col-span-6">
          <div className="bg-lavender-100/70 border border-brand-100 rounded-2xl p-6 h-full flex flex-col justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Info className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-brand-700">Important Methodological Note</h4>
                <p className="text-xs text-app-muted leading-relaxed">
                  These results report observational <strong>associations</strong>, not causal proofs. In advertising campaigns, Meta's algorithm allocates budgets non-randomly to early winners. We compare <strong>rates</strong> (clicks ÷ impressions, purchases ÷ clicks) rather than unnormalized totals to guard against budget bias.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-brand-100/80 flex items-center justify-between">
              <span className="text-xs text-app-muted">Audited with 95% confidence intervals</span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/results')}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Inspect Ranked Findings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
