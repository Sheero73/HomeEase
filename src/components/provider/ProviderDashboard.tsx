import React, { useState } from 'react';
import { Power, Star, MapPin, CheckCircle2 } from 'lucide-react';
import { ServiceProvider, Booking } from '../../types';

interface ProviderDashboardProps {
  provider: ServiceProvider;
  activeBooking?: Booking | null;
  onUpdateProviderStatus: (isOnline: boolean, vacationMode: boolean) => void;
  onAcceptIncomingJob?: (booking: Booking) => void;
  onUpdateJobStatus: (bookingId: string, status: Booking['status']) => void;
}

export const ProviderDashboard: React.FC<ProviderDashboardProps> = ({
  provider,
  activeBooking,
  onUpdateProviderStatus,
  onUpdateJobStatus,
}) => {
  const [isOnline, setIsOnline] = useState(provider.isOnline);
  const [otp, setOtp] = useState('');

  const toggleOnline = () => {
    const next = !isOnline;
    setIsOnline(next);
    onUpdateProviderStatus(next, false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src={provider.avatar} alt={provider.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500" />
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">{provider.name}</h1>
            <p className="text-xs text-slate-500">⭐ {provider.rating} · {provider.completedJobs} Jobs · {provider.vehiclePlate}</p>
          </div>
        </div>

        <button
          onClick={toggleOnline}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${isOnline ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}
        >
          <Power className="w-4 h-4" />
          <span>{isOnline ? 'ONLINE' : 'GO ONLINE'}</span>
        </button>
      </div>

      {activeBooking && activeBooking.status !== 'completed' && (
        <div className="p-5 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900 space-y-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm text-slate-900 dark:text-white">Active Dispatch: {activeBooking.serviceCategoryName}</span>
            <span className="bg-blue-600 text-white px-2.5 py-0.5 rounded font-bold uppercase">{activeBooking.status}</span>
          </div>

          <p className="text-slate-600 dark:text-slate-300">Customer: {activeBooking.customerName} ({activeBooking.customerAddress})</p>

          <div className="flex gap-2 pt-2">
            {activeBooking.status === 'en_route' && (
              <button
                onClick={() => onUpdateJobStatus(activeBooking.id, 'arrived')}
                className="px-3 py-1.5 bg-blue-600 text-white font-semibold rounded-lg"
              >
                Mark Arrived
              </button>
            )}
            {activeBooking.status === 'arrived' && (
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="OTP code"
                  className="w-24 px-2 py-1 rounded border text-center font-bold"
                />
                <button
                  onClick={() => onUpdateJobStatus(activeBooking.id, 'in_progress')}
                  className="px-3 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg"
                >
                  Verify & Start Work
                </button>
              </div>
            )}
            {activeBooking.status === 'in_progress' && (
              <button
                onClick={() => onUpdateJobStatus(activeBooking.id, 'completed')}
                className="px-3 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg"
              >
                Complete Job & Invoice
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 block">Today's Earnings</span>
          <span className="text-xl font-bold font-mono text-emerald-600 mt-1 block">₹1,850</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 block">Completed</span>
          <span className="text-xl font-bold text-slate-900 dark:text-white mt-1 block">4 Jobs</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 block">Wallet</span>
          <span className="text-xl font-bold font-mono text-blue-600 mt-1 block">₹{provider.walletBalance}</span>
        </div>
      </div>
    </div>
  );
};
