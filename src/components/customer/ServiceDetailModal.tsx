import React, { useState } from 'react';
import { X, Check, Zap, Calendar, ShieldCheck } from 'lucide-react';
import { ServiceCategory, SubService, PriceBreakdown } from '../../types';

interface ServiceDetailModalProps {
  category: ServiceCategory;
  onClose: () => void;
  onProceedToMatch: (bookingData: {
    selectedSubServices: SubService[];
    scheduledType: 'instant' | 'scheduled';
    scheduledDate: string;
    scheduledTime: string;
    issueDescription: string;
    priceBreakdown: PriceBreakdown;
  }) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  category,
  onClose,
  onProceedToMatch,
}) => {
  const [selectedSubIds, setSelectedSubIds] = useState<string[]>([
    category.subServices[0]?.id || '',
  ]);
  const [bookingType, setBookingType] = useState<'instant' | 'scheduled'>('instant');
  const [issueNotes, setIssueNotes] = useState('');

  const toggleSubService = (id: string) => {
    setSelectedSubIds((prev) =>
      prev.includes(id)
        ? prev.length > 1
          ? prev.filter((item) => item !== id)
          : prev
        : [...prev, id]
    );
  };

  const selectedSubs = category.subServices.filter((s) => selectedSubIds.includes(s.id));
  const subtotal = selectedSubs.reduce((acc, curr) => acc + curr.price, 0);
  const emergencyFee = bookingType === 'instant' ? 49 : 0;
  const taxes = Math.round((subtotal + emergencyFee) * 0.18);
  const total = subtotal + emergencyFee + taxes;

  const priceBreakdown: PriceBreakdown = {
    base: category.basePrice,
    subtotal,
    emergencySurcharge: emergencyFee,
    discount: 0,
    taxes,
    total,
  };

  const handleConfirm = () => {
    onProceedToMatch({
      selectedSubServices: selectedSubs,
      scheduledType: bookingType,
      scheduledDate: bookingType === 'instant' ? 'Today, Immediate' : 'Tomorrow',
      scheduledTime: bookingType === 'instant' ? 'Express (under 30 mins)' : '10:00 AM',
      issueDescription: issueNotes || `Standard ${category.name} repair`,
      priceBreakdown,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {category.name}
            </h2>
            <p className="text-xs text-slate-500">⭐ {category.rating} · 30-Day Guarantee</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setBookingType('instant')}
              className={`p-3 rounded-2xl border text-left ${
                bookingType === 'instant'
                  ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/30'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className="font-bold text-sm block">⚡ Express 30m</span>
              <span className="text-xs text-slate-500">Nearest tech arrives fast</span>
            </button>
            <button
              onClick={() => setBookingType('scheduled')}
              className={`p-3 rounded-2xl border text-left ${
                bookingType === 'scheduled'
                  ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/30'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className="font-bold text-sm block">📅 Schedule Later</span>
              <span className="text-xs text-slate-500">Choose date & slot</span>
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold block text-slate-700 dark:text-slate-300">
              Select Services:
            </label>
            {category.subServices.map((sub) => {
              const isSelected = selectedSubIds.includes(sub.id);
              return (
                <div
                  key={sub.id}
                  onClick={() => toggleSubService(sub.id)}
                  className={`flex justify-between items-center p-3 rounded-xl border cursor-pointer ${
                    isSelected ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20' : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded flex items-center justify-center ${isSelected ? 'bg-blue-600 text-white' : 'border'}`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold block">{sub.name}</span>
                      <span className="text-[11px] text-slate-500">~{sub.durationMinutes} mins</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold">₹{sub.price}</span>
                </div>
              );
            })}
          </div>

          <input
            type="text"
            value={issueNotes}
            onChange={(e) => setIssueNotes(e.target.value)}
            placeholder="Issue notes (e.g. leaking under sink)..."
            className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          />

          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex justify-between text-xs">
            <span>Total Payable:</span>
            <span className="font-bold text-sm text-blue-600 font-mono">₹{total}</span>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleConfirm}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>Confirm & Match Technician · ₹{total}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
