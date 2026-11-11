import React, { useState } from 'react';
import { Compass, Star, ShieldCheck, Zap } from 'lucide-react';
import { ServiceProvider, LocationCoords, ServiceCategory } from '../../types';
import { calculateDistanceKm, estimateEtaMinutes } from '../../services/geoService';
import { LiveMapVisualizer } from '../map/LiveMapVisualizer';

interface NearbyDiscoveryViewProps {
  customerLocation: LocationCoords;
  providers: ServiceProvider[];
  categories: ServiceCategory[];
  onSelectProvider: (provider: ServiceProvider) => void;
  onBookCategory: (category: ServiceCategory) => void;
}

export const NearbyDiscoveryView: React.FC<NearbyDiscoveryViewProps> = ({
  customerLocation,
  providers,
  categories,
  onBookCategory,
}) => {
  const [maxRadius, setMaxRadius] = useState<number>(10);

  const enriched = providers.map((pro) => {
    const dist = calculateDistanceKm(customerLocation.lat, customerLocation.lng, pro.coords.lat, pro.coords.lng);
    const eta = estimateEtaMinutes(dist);
    return { ...pro, distanceKm: dist, etaMinutes: eta };
  }).filter((p) => p.distanceKm <= maxRadius);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-600" />
            <span>Nearby Service Fleet Discovery</span>
          </h2>
          <p className="text-xs text-slate-500">Live GPS tracking around {customerLocation.address}</p>
        </div>
        <select
          value={maxRadius}
          onChange={(e) => setMaxRadius(Number(e.target.value))}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
        >
          <option value={5}>Within 5 km</option>
          <option value={10}>Within 10 km</option>
          <option value={20}>Within 20 km</option>
        </select>
      </div>

      <LiveMapVisualizer customerLocation={customerLocation} providers={enriched} heightClass="h-72 md:h-84" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {enriched.map((pro) => (
          <div key={pro.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={pro.avatar} alt={pro.name} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{pro.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="text-amber-500 font-bold">⭐ {pro.rating}</span>
                    <span>·</span>
                    <span>{pro.completedJobs} jobs</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-600 block">{pro.distanceKm} km</span>
                <span className="text-[11px] text-slate-400">~{pro.etaMinutes} mins</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-500">Visiting Fee: ₹{pro.visitFee}</span>
              <button
                onClick={() => {
                  const cat = categories.find((c) => pro.specialties.includes(c.id)) || categories[0];
                  onBookCategory(cat);
                }}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-semibold flex items-center gap-1"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Book Now</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
