import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Finding } from '../../types';
import { Badge } from '../ui/Badge';
import { formatEffectSize, formatConfidenceInterval } from '../../services/metrics/formatters';

export interface FindingCardProps {
  finding: Finding;
  rank: number;
}

export const FindingCard: React.FC<FindingCardProps> = ({ finding, rank }) => {
  const navigate = useNavigate();

  // Representative creative image if available
  const sampleImage = finding.imageExamples?.[0]?.imageUrl || null;

  return (
    <div
      onClick={() => navigate(`/results/${finding.id}`)}
      className="bg-white rounded-2xl border border-app-border p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:shadow-card-hover hover:border-brand-100 transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-3.5 sm:gap-4 md:gap-5 flex-1 min-w-0 w-full md:w-auto">
        {/* Rank Number */}
        <div className="text-xl sm:text-2xl font-bold text-app-muted/60 w-6 text-center shrink-0">
          {rank}
        </div>

        {/* Thumbnail Preview */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-lavender-100 shrink-0 border border-app-border flex items-center justify-center">
          {sampleImage ? (
            <img src={sampleImage} alt={finding.attributeLabel} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white font-bold text-xs">
              {finding.metric.toUpperCase()}
            </div>
          )}
        </div>

        {/* Title and Summary */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-base font-bold text-app-text group-hover:text-brand-700 transition-colors truncate">
              {finding.attributeLabel} vs {finding.metric.toUpperCase()}
            </h4>
          </div>
          <p className="text-xs text-app-muted mt-0.5 line-clamp-2 leading-relaxed">{finding.summary}</p>
        </div>
      </div>

      {/* Metrics & Status */}
      <div className="flex items-center justify-between md:justify-end gap-3.5 sm:gap-4 lg:gap-6 w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-app-border/60 flex-wrap sm:flex-nowrap">
        {/* Effect Size */}
        <div className="flex flex-col text-left md:text-right shrink-0 whitespace-nowrap">
          <span className="text-[10px] uppercase font-bold text-app-muted tracking-wider">Effect Size</span>
          <span className="text-sm font-bold text-app-text">
            {formatEffectSize(finding.effectSize, finding.metric)}
          </span>
        </div>

        {/* Confidence Interval */}
        <div className="flex flex-col text-left md:text-right shrink-0 whitespace-nowrap">
          <span className="text-[10px] uppercase font-bold text-app-muted tracking-wider">95% CI</span>
          <span className="text-sm font-semibold text-app-text">
            {formatConfidenceInterval(finding.confidenceInterval, finding.metric)}
          </span>
        </div>

        {/* Sample Size */}
        <div className="flex flex-col text-left md:text-right shrink-0 whitespace-nowrap">
          <span className="text-[10px] uppercase font-bold text-app-muted tracking-wider">Sample Size</span>
          <span className="text-sm font-semibold text-app-muted">n = {finding.sampleSize}</span>
        </div>

        {/* Status Pill */}
        <div className="shrink-0">
          <Badge status={finding.status} />
        </div>

        {/* Chevron */}
        <div className="text-app-muted group-hover:text-brand-700 group-hover:translate-x-1 transition-all shrink-0">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
