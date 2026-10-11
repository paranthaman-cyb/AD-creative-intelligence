import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { GroupComparisonBarChart } from '../components/charts/GroupComparisonBarChart';
import {
  formatEffectSize,
  formatConfidenceInterval,
  formatPercent,
  getMetricShortLabel,
} from '../services/metrics/formatters';
import {
  ArrowLeft,
  Info,
  AlertTriangle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const FindingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getFindingById, findings } = useAnalysis();

  const finding = id ? getFindingById(id) : undefined;

  if (!finding) {
    return (
      <div className="py-20 text-center space-y-4">
        <h3 className="text-xl font-bold text-app-text">Finding not found</h3>
        <p className="text-xs text-app-muted">The requested analysis finding ID does not exist.</p>
        <Button variant="primary" onClick={() => navigate('/results')}>
          Back to Results
        </Button>
      </div>
    );
  }

  // Related findings
  const relatedList = findings
    .filter((f) => f.id !== finding.id && (f.metric === finding.metric || f.attributeKey.includes('contrast') || f.attributeKey.includes('brightness')))
    .slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Back to Results */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/results')}
          className="text-app-muted hover:text-brand-700 font-semibold pl-0"
        >
          Back to Results
        </Button>
      </div>

      {/* Finding Title & Status Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-app-text tracking-tight">
              {finding.attributeLabel} vs {getMetricShortLabel(finding.metric)}
            </h1>
            <Badge status={finding.status} />
          </div>
          <p className="text-sm text-app-muted mt-1 max-w-3xl leading-normal">{finding.summary}</p>
        </div>
      </div>

      {/* 4 Top Metric Cards matching UI Reference */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        <Card className="p-3.5 sm:p-5 min-w-0 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-app-muted tracking-wider block truncate">
            Effect Size
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-brand-700 mt-1 block truncate">
            {formatEffectSize(finding.effectSize, finding.metric)}
          </span>
        </Card>

        <Card className="p-3.5 sm:p-5 min-w-0 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-app-muted tracking-wider block truncate">
            95% Confidence Interval
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-app-text mt-1 block truncate">
            {formatConfidenceInterval(finding.confidenceInterval, finding.metric)}
          </span>
        </Card>

        <Card className="p-3.5 sm:p-5 min-w-0 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-app-muted tracking-wider block truncate">
            Sample Size
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-app-text mt-1 block truncate">
            n = {finding.sampleSize}
          </span>
        </Card>

        <Card className="p-3.5 sm:p-5 min-w-0 flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-app-muted tracking-wider block truncate">
            Metric
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-app-text mt-1 block truncate">
            {getMetricShortLabel(finding.metric)}
          </span>
        </Card>
      </div>

      {/* Middle Section: Group Comparison Bar Chart & Creative Examples */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Bar Chart */}
        <div className="lg:col-span-6">
          <Card className="p-6 h-full flex flex-col justify-between">
            <GroupComparisonBarChart
              groupLabels={finding.groupLabels}
              groupValues={finding.groupValues}
              metric={finding.metric}
            />
            <div className="pt-3 border-t border-app-border text-xs text-app-muted flex items-center justify-between">
              <span>Cohort A: {finding.groupCounts[0] || '—'} creatives</span>
              <span>Cohort B: {finding.groupCounts[1] || '—'} creatives</span>
            </div>
          </Card>
        </div>

        {/* Right: Side-by-Side Image Examples */}
        <div className="lg:col-span-6">
          <Card className="p-6 h-full">
            <h4 className="text-sm font-semibold text-app-text mb-3">Image Examples</h4>

            {finding.imageExamples && finding.imageExamples.length >= 2 ? (
              <div className="grid grid-cols-2 gap-4">
                {finding.imageExamples.slice(0, 2).map((ex, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="rounded-xl overflow-hidden border border-app-border bg-lavender-50 aspect-square shadow-sm">
                      {ex.imageUrl ? (
                        <img src={ex.imageUrl} alt={ex.label} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-app-muted font-bold">
                          {ex.label}
                        </div>
                      )}
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-app-text block truncate">{ex.label}</span>
                      <span className="font-semibold text-brand-700">
                        {getMetricShortLabel(finding.metric)}: {formatPercent(ex.metricValue, 1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-app-muted bg-lavender-50 rounded-xl">
                Creative assets for this cohort comparison are based on tabular metadata.
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Explanations: How this was analyzed & Limitations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* How this was analyzed */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-2 text-brand-700">
              <Info className="w-4 h-4" />
              <h4 className="text-sm font-bold text-app-text">How this was analyzed</h4>
            </div>
            <p className="text-xs text-app-muted leading-relaxed mb-4">
              {finding.method}
            </p>
            <div className="p-3 bg-lavender-50 rounded-xl text-[11px] text-app-muted flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-700 shrink-0 mt-0.5" />
              <span>
                Hypothesis testing calculated at 95% confidence level. An effect is classified as <strong>Supported</strong> only when the confidence interval strictly excludes null divergence.
              </span>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-2 text-status-warning">
              <AlertTriangle className="w-4 h-4" />
              <h4 className="text-sm font-bold text-app-text">Limitations</h4>
            </div>
            <ul className="space-y-1.5 text-xs text-app-muted list-disc list-inside">
              {finding.limitations.map((lim, idx) => (
                <li key={idx} className="leading-relaxed">
                  {lim}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Related Findings Card */}
        <div className="lg:col-span-4">
          <Card className="p-6 h-full flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-app-text mb-3">Related Findings</h4>
              <div className="space-y-2.5">
                {relatedList.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => navigate(`/results/${rel.id}`)}
                    className="p-3 bg-lavender-50 rounded-xl border border-app-border hover:border-brand-100 hover:bg-white transition-all cursor-pointer group flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-app-text group-hover:text-brand-700 block">
                        {rel.attributeLabel} vs {getMetricShortLabel(rel.metric)}
                      </span>
                      <div className="mt-1">
                        <Badge status={rel.status} />
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-app-muted group-hover:text-brand-700" />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-app-border">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate('/results')}
              >
                View All Findings
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
