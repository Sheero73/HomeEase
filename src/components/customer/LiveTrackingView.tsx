import React, { useState } from 'react';
import { Phone, MessageSquare, Shield, Star, CheckCircle2 } from 'lucide-react';
import { Booking, ServiceProvider } from '../../types';
import { LiveMapVisualizer } from '../map/LiveMapVisualizer';

interface LiveTrackingViewProps {
  booking: Booking;
  allProviders: ServiceProvider[];
  onUpdateBookingStatus: (bookingId: string, newStatus: Booking['status']) => void;
  onSubmitReview: (bookingId: string, rating: number, review: string) => void;
  onOpenSupport: () => void;
}

export const LiveTrackingView: React.FC<LiveTrackingViewProps> = ({
  booking,
  allProviders,
  onUpdateBookingStatus,
  onSubmitReview,
  onOpenSupport,
}) => {
  const provider = booking.provider || allProviders.find((p) => p.id === booking.providerId);
  const [chatMessage, setChatMessage] = useState('');
  const [chatList, setChatList] = useState<{ sender: 'user' | 'pro'; text: string }[]>([
    { sender: 'pro', text: "I've accepted your request and am navigating with safety toolkit." },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatList((prev) => [...prev, { sender: 'user', text: chatMessage }]);
    setChatMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {booking.serviceCategoryName} #{booking.id}
            </h2>
            <span className="text-xs font-mono font-bold text-blue-600">
              OTP: {booking.otpCode}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Share OTP with technician at your door to start work safely.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
          <button
            onClick={() => onUpdateBookingStatus(booking.id, 'en_route')}
            className={`px-2.5 py-1 rounded-lg ${booking.status === 'en_route' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
          >
            En Route
          </button>
          <button
            onClick={() => onUpdateBookingStatus(booking.id, 'arrived')}
            className={`px-2.5 py-1 rounded-lg ${booking.status === 'arrived' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Arrived
          </button>
          <button
            onClick={() => onUpdateBookingStatus(booking.id, 'in_progress')}
            className={`px-2.5 py-1 rounded-lg ${booking.status === 'in_progress' ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
          >
            In Progress
          </button>
          <button
            onClick={() => onUpdateBookingStatus(booking.id, 'completed')}
            className={`px-2.5 py-1 rounded-lg ${booking.status === 'completed' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'}`}
          >
            Completed
          </button>
        </div>
      </div>

      <LiveMapVisualizer
        customerLocation={booking.customerCoords}
        providers={allProviders}
        activeBooking={booking}
        heightClass="h-72 md:h-84"
      />

      {provider && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-3">
              <img src={provider.avatar} alt={provider.name} className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{provider.name}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="text-amber-500 font-bold">⭐ {provider.rating}</span>
                  <span>·</span>
                  <span>{provider.completedJobs} jobs done</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between">
              <span>Vehicle: {provider.vehiclePlate}</span>
              <span className="font-bold text-blue-600">Total: ₹{booking.priceBreakdown.total}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-48">
            <span className="text-xs font-bold block mb-1">Technician Direct Chat</span>
            <div className="flex-1 overflow-y-auto space-y-1.5 text-xs">
              {chatList.map((c, i) => (
                <div key={i} className={`p-2 rounded-lg max-w-[85%] ${c.sender === 'user' ? 'bg-blue-600 text-white ml-auto' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'}`}>
                  {c.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleSend} className="flex gap-2 pt-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Message tech..."
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
              <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold">
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
