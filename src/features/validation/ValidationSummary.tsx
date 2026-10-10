import React from 'react';
import { ValidationIssue } from '../../types';
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export interface ValidationSummaryProps {
  isValid: boolean;
  totalRows: number;
  errorCount: number;
  warningCount: number;
  issues: ValidationIssue[];
}

export const ValidationSummary: React.FC<ValidationSummaryProps> = ({
  isValid,
  totalRows,
  errorCount,
  warningCount,
  issues,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-app-border p-6 shadow-card space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          {isValid ? (
            <div className="w-10 h-10 rounded-full bg-status-successBg text-status-success flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-status-errorBg text-status-error flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
          )}
          <div>
            <h4 className="text-sm font-bold text-app-text">
              {isValid ? 'Dataset Validated Successfully' : 'Validation Issues Detected'}
            </h4>
            <p className="text-xs text-app-muted">
              {totalRows} records parsed • {errorCount} errors • {warningCount} warnings
            </p>
          </div>
        </div>
      </div>

      {issues.length > 0 && (
        <div className="mt-4 pt-4 border-t border-app-border space-y-2 max-h-56 overflow-y-auto">
          {issues.map((issue, idx) => {
            const isError = issue.severity === 'error';
            const isWarn = issue.severity === 'warning';

            return (
              <div
                key={idx}
                className={`flex items-start gap-2.5 p-2.5 rounded-lg text-xs ${
                  isError
                    ? 'bg-status-errorBg/60 text-status-error'
                    : isWarn
                    ? 'bg-status-warningBg/60 text-status-warning'
                    : 'bg-lavender-100 text-brand-700'
                }`}
              >
                {isError ? (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                ) : isWarn ? (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <span>{issue.message}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
