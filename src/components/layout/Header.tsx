import React from 'react';
import { UserRole } from '../../types';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  activeRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  unreadNotifications?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  activeRole,
  onSelectRole,
  isDarkMode,
  onToggleDarkMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => onSelectTab('home')}
          className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <span className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-base shadow-sm">
            H
          </span>
          <span>HomeEase</span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onSelectTab('home')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 hover:text-slate-900 dark:hover:text-white ${
              currentTab === 'home'
                ? 'text-blue-600 dark:text-blue-400 font-semibold border-b-2 border-blue-600 dark:border-blue-400'
                : ''
            }`}
          >
            Services
          </button>
          <button
            onClick={() => onSelectTab('search')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 hover:text-slate-900 dark:hover:text-white ${
              currentTab === 'search'
                ? 'text-blue-600 dark:text-blue-400 font-semibold border-b-2 border-blue-600 dark:border-blue-400'
                : ''
            }`}
          >
            Nearby Discovery
          </button>
          <button
            onClick={() => onSelectTab('diagnose')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 hover:text-slate-900 dark:hover:text-white ${
              currentTab === 'diagnose'
                ? 'text-blue-600 dark:text-blue-400 font-semibold border-b-2 border-blue-600 dark:border-blue-400'
                : ''
            }`}
          >
            AI Diagnosis
          </button>
          <button
            onClick={() => onSelectTab('activity')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 hover:text-slate-900 dark:hover:text-white ${
              currentTab === 'activity'
                ? 'text-blue-600 dark:text-blue-400 font-semibold border-b-2 border-blue-600 dark:border-blue-400'
                : ''
            }`}
          >
            Bookings
          </button>
          <button
            onClick={() => onSelectTab('api-architecture')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 hover:text-slate-900 dark:hover:text-white ${
              currentTab === 'api-architecture'
                ? 'text-blue-600 dark:text-blue-400 font-semibold border-b-2 border-blue-600 dark:border-blue-400'
                : ''
            }`}
          >
            API Architecture
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium">
            <button
              onClick={() => onSelectRole('customer')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeRole === 'customer'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => onSelectRole('provider')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeRole === 'provider'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Partner
            </button>
            <button
              onClick={() => onSelectRole('admin')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeRole === 'admin'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Admin
            </button>
          </div>

          <button
            onClick={onToggleDarkMode}
            className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-xs"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
};
