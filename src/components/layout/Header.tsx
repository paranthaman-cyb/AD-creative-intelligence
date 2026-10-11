import { ChevronDown, Database } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, actions }) => {
  const { isDemoMode, loadRealDataset, session } = useAnalysis();

  return (
    <header className="min-h-16 h-auto py-3 px-4 sm:px-6 lg:px-8 border-b border-app-border bg-white/70 backdrop-blur-md rounded-2xl flex flex-col gap-3 sticky top-0 z-20 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          {title && <h1 className="text-xl sm:text-2xl font-bold text-app-text leading-tight truncate">{title}</h1>}
          {subtitle && <p className="text-xs text-app-muted mt-0.5 leading-normal max-w-2xl">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-wrap sm:flex-nowrap">
          {/* Dataset Switcher Pill */}
          {isDemoMode ? (
            <button
              type="button"
              onClick={loadRealDataset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-700 text-white hover:bg-brand-600 transition-colors shadow-sm shrink-0 whitespace-nowrap"
            >
              <Database className="w-3.5 h-3.5 shrink-0" />
              <span>Load Real Dataset (150)</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-100 text-brand-700 border border-brand-200 shrink-0 whitespace-nowrap shadow-xs">
              <span className="w-2 h-2 rounded-full bg-status-success animate-pulse shrink-0" />
              <span className="hidden md:inline">{session.id === 'halcyon_meta_2026' ? 'Halcyon Meta Dataset (150)' : 'Active Dataset'}</span>
              <span className="md:hidden">{session.id === 'halcyon_meta_2026' ? 'Halcyon Meta (150)' : 'Active Dataset'}</span>
            </div>
          )}

          {/* User Profile matching UI Reference (PC Param v) */}
          <div className="flex items-center gap-2 pl-2.5 sm:pl-3 border-l border-app-border select-none shrink-0 whitespace-nowrap">
            <div className="w-8 h-8 rounded-full bg-brand-700 text-white font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
              PC
            </div>
            <span className="text-xs font-semibold text-app-text hidden sm:inline-block">Param</span>
            <ChevronDown className="w-3.5 h-3.5 text-app-muted shrink-0" />
          </div>
        </div>
      </div>

      {actions && (
        <div className="w-full pt-2.5 border-t border-app-border/70 flex flex-wrap items-center justify-between gap-3">
          {actions}
        </div>
      )}
    </header>
  );
};
