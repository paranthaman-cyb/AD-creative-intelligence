import { ChevronDown, Database } from 'lucide-react';
import { useAnalysis } from '../../context/AnalysisContext';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { isDemoMode, loadRealDataset, session } = useAnalysis();

  return (
    <header className="h-16 px-6 sm:px-8 border-b border-app-border bg-white/70 backdrop-blur-md flex items-center justify-between sticky top-0 z-20">
      <div>
        {title && <h1 className="text-xl font-bold text-app-text leading-tight">{title}</h1>}
        {subtitle && <p className="text-xs text-app-muted">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Dataset Switcher Pill */}
        {isDemoMode ? (
          <button
            type="button"
            onClick={loadRealDataset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-700 text-white hover:bg-brand-600 transition-colors shadow-sm"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Load Real Dataset (150)</span>
          </button>
        ) : (
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-100 text-brand-700 border border-brand-200">
            <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
            <span>{session.id === 'halcyon_meta_2026' ? 'Halcyon Meta Dataset (150)' : 'Active Dataset'}</span>
          </div>
        )}

        {/* User Profile matching UI Reference (PC Param v) */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-app-border select-none">
          <div className="w-8 h-8 rounded-full bg-brand-700 text-white font-bold text-xs flex items-center justify-center shadow-sm">
            PC
          </div>
          <span className="text-xs font-semibold text-app-text hidden sm:inline-block">Param</span>
          <ChevronDown className="w-3.5 h-3.5 text-app-muted" />
        </div>
      </div>
    </header>
  );
};
