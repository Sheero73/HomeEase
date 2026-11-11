import React from 'react';
import { Home, Compass, Sparkles, Clock, ShieldCheck, User } from 'lucide-react';

interface MobileTabBarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  activeBookingCount?: number;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  currentTab,
  onSelectTab,
  activeBookingCount = 0,
}) => {
  const tabs = [
    { id: 'home', label: 'Services', icon: Home },
    { id: 'search', label: 'Nearby', icon: Compass },
    { id: 'diagnose', label: 'AI Scan', icon: Sparkles, highlight: true },
    { id: 'activity', label: 'Activity', icon: Clock, badge: activeBookingCount > 0 ? activeBookingCount : undefined },
    { id: 'profile', label: 'Account', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 transition-colors">
      <nav className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center relative py-1 transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.highlight ? (
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center -mt-2 shadow-md shadow-blue-600/30">
                  <Icon className="w-4 h-4" />
                </div>
              ) : (
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {tab.badge !== undefined && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 bg-emerald-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {tab.badge}
                    </span>
                  )}
                </div>
              )}
              <span className="text-[10px] tracking-tight mt-1 whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
