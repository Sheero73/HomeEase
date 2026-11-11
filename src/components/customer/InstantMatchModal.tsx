import React, { useState, useEffect } from 'react';
import { Zap, CheckCircle2, Star, ShieldCheck, X } from 'lucide-react';
import { ServiceProvider, LocationCoords, SubService, PriceBreakdown, Booking } from '../../types';
import { matchNearbyProviders } from '../../services/geoService';

interface InstantMatchModalProps {
  categoryName: string;
  categoryId: string;
  customerLocation: LocationCoords;
  allProviders: ServiceProvider[];
  selectedSubServices: SubService[];
  priceBreakdown: PriceBreakdown;
  scheduledType: 'instant' | 'scheduled';
  scheduledDate: string;
  scheduledTime: string;
  issueDescription: string;
  onCancel: () => void;
  onMatchedAndAssigned: (booking: Booking) => void;
}

export const InstantMatchModal: React.FC<InstantMatchModalProps> = ({
  categoryName,
  categoryId,
  customerLocation,
  allProviders,
  selectedSubServices,
  priceBreakdown,
  scheduledType,
  scheduledDate,
  scheduledTime,
  issueDescription,
  onCancel,
  onMatchedAndAssigned,
}) => {
  const [matchState, setMatchState] = useState<'scanning' | 'candidate_found' | 'assigned'>('scanning');

  useEffect(() => {
    const matches = matchNearbyProviders(customerLocation, allProviders, categoryId, 15);
    const topMatch = matches.length > 0 ? matches[0] : null;

    const t1 = setTimeout(() => {
      setMatchState('candidate_found');
    }, 1800);

    const t2 = setTimeout(() => {
      setMatchState('assigned');
      const newBooking: Booking = {
        id: `HE-${Math.floor(1000 + Math.random() * 9000)}`,
        customerId: 'cust-1',
        customerName: 'Alex Johnson',
        customerPhone: '+91 99001 22441',
        customerAddress: customerLocation.address,
        customerCoords: customerLocation,
        providerId: topMatch?.provider.id || 'pro-1',
        provider: topMatch?.provider || allProviders[0],
        serviceCategoryId: categoryId,
        serviceCategoryName: categoryName,
        selectedSubServices,
        status: 'en_route',
        scheduledType,
        scheduledDate,
        scheduledTime,
        issueDescription,
        priceBreakdown,
        paymentMethod: 'upi',
        paymentStatus: 'pending',
        otpCode: '4829',
        createdAt: new Date().toISOString(),
        etaMinutes: topMatch?.etaMinutes || 6,
      };

      setTimeout(() => {
        onMatchedAndAssigned(newBooking);
      }, 1000);
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [categoryId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 text-center animate-in zoom-in-95">
        <button onClick={onCancel} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>

        <div className="w-20 h-20 mx-auto my-4 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 animate-pulse">
          {matchState === 'assigned' ? <CheckCircle2 className="w-10 h-10" /> : <Zap className="w-10 h-10" />}
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {matchState === 'scanning' && 'Searching 5km Radius...'}
          {matchState === 'candidate_found' && 'Nearest Technician Located!'}
          {matchState === 'assigned' && 'Assigned! Live Tracking Begins'}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {matchState === 'scanning' && `Broadcasting request for ${categoryName}`}
          {matchState === 'candidate_found' && 'Technician accepting booking...'}
          {matchState === 'assigned' && 'Opening live GPS route view...'}
        </p>
      </div>
    </div>
  );
};
