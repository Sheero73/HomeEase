import React, { useState } from 'react';
import { FileText, RotateCcw, Star, ChevronRight, Printer } from 'lucide-react';
import { Booking, ServiceCategory } from '../../types';

interface BookingHistoryViewProps {
  bookings: Booking[];
  categories: ServiceCategory[];
  onTrackBooking: (booking: Booking) => void;
  onRebook: (category: ServiceCategory) => void;
}

export const BookingHistoryView: React.FC<BookingHistoryViewProps> = ({
  bookings,
  categories,
  onTrackBooking,
  onRebook,
}) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Booking | null>(null);

  return (
    <div className="space-y-6">
      <h2 className="text-base font-bold text-slate-900 dark:text-white">Service Bookings ({bookings.length})</h2>
      <div className="space-y-3">
        {bookings.map((b) => (
          <div key={b.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">{b.serviceCategoryName}</span>
                <span className="text-slate-400">#{b.id}</span>
              </div>
              <p className="text-slate-500 mt-0.5">{b.scheduledTime} · Tech: {b.provider?.name || 'Assigned Pro'}</p>
              <span className="font-bold text-slate-900 dark:text-white mt-1 block">Total: ₹{b.priceBreakdown.total}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedInvoice(b)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Invoice</span>
              </button>
              <button
                onClick={() => onTrackBooking(b)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold flex items-center gap-1"
              >
                <span>Track</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-sm w-full space-y-4 border border-slate-200 dark:border-slate-800 text-xs">
            <h3 className="text-sm font-bold text-blue-600">HomeEase GST Invoice #{selectedInvoice.id}</h3>
            <p>Customer: {selectedInvoice.customerName}</p>
            <p>Service: {selectedInvoice.serviceCategoryName}</p>
            <p className="font-bold">Total Paid: ₹{selectedInvoice.priceBreakdown.total}</p>
            <div className="flex gap-2">
              <button onClick={() => setSelectedInvoice(null)} className="flex-1 py-1.5 border rounded-lg">Close</button>
              <button onClick={() => window.print()} className="flex-1 py-1.5 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-1">
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
