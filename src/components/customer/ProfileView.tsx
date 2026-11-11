import React, { useState } from 'react';
import { Wallet, MapPin, ShieldCheck, Moon, Sun, Smartphone } from 'lucide-react';

interface ProfileViewProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSupport: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [wallet, setWallet] = useState(1450);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center">
            AJ
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Alex Johnson</h2>
            <p className="text-xs text-slate-500">+91 99001 22441 · Bangalore</p>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Plus Customer</span>
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-6 flex justify-between items-center">
        <div>
          <span className="text-xs text-blue-200 flex items-center gap-1"><Wallet className="w-4 h-4" /> HomeEase Pay Wallet</span>
          <span className="text-3xl font-extrabold font-mono block mt-1">₹{wallet}</span>
        </div>
        <button onClick={() => setWallet((w) => w + 500)} className="px-4 py-2 bg-white text-blue-900 font-bold text-xs rounded-xl">
          + Add ₹500
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
        <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
          <span>Appearance Mode</span>
          <button onClick={onToggleDarkMode} className="px-3 py-1 border rounded-lg">
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
        <div className="flex justify-between items-center py-2">
          <span>Saved Address</span>
          <span className="text-slate-500 font-medium">42, Maple Ave, Indiranagar</span>
        </div>
      </div>
    </div>
  );
};
