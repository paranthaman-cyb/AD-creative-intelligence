import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  UploadCloud,
  FileSpreadsheet,
  LayoutDashboard,
  Settings,
  Sparkles,
  Database,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAnalysis } from '../../context/AnalysisContext';

export interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { to: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
  { to: '/analyze', label: 'Analyze', icon: <UploadCloud className="w-5 h-5" /> },
  { to: '/results', label: 'Results', icon: <FileSpreadsheet className="w-5 h-5" /> },
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { to: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

export const Sidebar: React.FC = () => {
  const { isDemoMode } = useAnalysis();
  const location = useLocation();

  return (
    <aside className="w-64 bg-sidebar text-white flex flex-col shrink-0 h-screen sticky top-0 border-r border-sidebar-border z-30 select-none">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center shadow-md shadow-brand-700/50">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm tracking-tight text-white leading-tight">
            Ad Creative
          </span>
          <span className="text-xs font-semibold text-brand-100/80 tracking-wide uppercase">
            Intelligence
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group',
                isActive
                  ? 'bg-sidebar-active text-white font-semibold shadow-sm'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              )}
            >
              <span className={cn('shrink-0 transition-transform group-hover:scale-105', isActive ? 'text-white' : 'text-gray-400 group-hover:text-white')}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Dataset Indicator Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-start gap-2.5">
          <Database className="w-4 h-4 text-brand-100 shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white">
              {isDemoMode ? 'Synthetic Demo Mode' : 'Halcyon Meta Ads'}
            </span>
            <span className="text-[11px] text-gray-400">
              {isDemoMode ? 'Testing fixtures (60)' : 'Hackathon Dataset (150)'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
