import React from 'react';
import { Smartphone, Monitor, Shield, User, Wrench, Sparkles } from 'lucide-react';
import { UserRole } from '../../types';

interface DeviceFrameToggleProps {
  isMobileFrame: boolean;
  onToggleMobileFrame: (val: boolean) => void;
  activeRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onQuickSimulateDispatch: () => void;
  onOpenAIChat: () => void;
  onOpenArchitecture?: () => void;
}

export const DeviceFrameToggle: React.FC<DeviceFrameToggleProps> = ({
  isMobileFrame,
  onToggleMobileFrame,
  activeRole,
  onSelectRole,
  onQuickSimulateDispatch,
  onOpenAIChat,
  onOpenArchitecture,
}) => {
  return (
    <div className="bg-slate-900 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
      <div className="flex items-center gap-2">
        <span className="text-slate-400 font-medium hidden sm:inline">Preview Mode:</span>
        <div className="flex items-center p-0.5 bg-slate-800 rounded-lg">
          <button
            onClick={() => onToggleMobileFrame(false)}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
              !isMobileFrame ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Responsive Web</span>
          </button>
          <button
            onClick={() => onToggleMobileFrame(true)}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
              isMobileFrame ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Device (iOS/Android)</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-slate-400 font-medium hidden md:inline">Active Role:</span>
        <div className="flex items-center p-0.5 bg-slate-800 rounded-lg">
          <button
            onClick={() => onSelectRole('customer')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
              activeRole === 'customer' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3 h-3" />
            <span>Customer</span>
          </button>
          <button
            onClick={() => onSelectRole('provider')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
              activeRole === 'provider' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wrench className="w-3 h-3" />
            <span>Partner Pro</span>
          </button>
          <button
            onClick={() => onSelectRole('admin')}
            className={`px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
              activeRole === 'admin' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-3 h-3" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onQuickSimulateDispatch}
          className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-semibold text-[11px] transition-colors"
        >
          ⚡ Simulate Dispatch
        </button>
        <button
          onClick={onOpenAIChat}
          className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 font-semibold text-[11px] flex items-center gap-1 transition-colors"
        >
          <Sparkles className="w-3 h-3" />
          <span>AI Concierge</span>
        </button>
        {onOpenArchitecture && (
          <button
            onClick={onOpenArchitecture}
            className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 font-semibold text-[11px] flex items-center gap-1 transition-colors"
          >
            <span>📡 API Architecture</span>
          </button>
        )}
      </div>
    </div>
  );
};
