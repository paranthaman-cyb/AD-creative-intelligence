import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Home, UploadCloud, FileSpreadsheet, LayoutDashboard, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

export const AppShell: React.FC = () => {
  const location = useLocation();

  // If on landing page, let the LandingPage control its own full-bleed layout
  const isLandingPage = location.pathname === '/';

  if (isLandingPage) {
    return (
      <div className="min-h-screen bg-lavender-50 text-app-text flex flex-col">
        <Outlet />
      </div>
    );
  }

  const mobileNavItems = [
    { to: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { to: '/analyze', label: 'Analyze', icon: <UploadCloud className="w-5 h-5" /> },
    { to: '/results', label: 'Results', icon: <FileSpreadsheet className="w-5 h-5" /> },
    { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { to: '/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-lavender-50 text-app-text flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation matching reference */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-app-border z-40 px-2 py-2 flex items-center justify-around shadow-lg">
        {mobileNavItems.map((item) => {
          const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                'flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-semibold transition-colors',
                isActive ? 'text-brand-700 font-bold' : 'text-app-muted hover:text-app-text'
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
