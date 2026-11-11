import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Compass,
  Layers,
  Flame,
  ZoomIn,
  ZoomOut,
  Zap,
  Wrench,
  Wind,
  Sparkles,
  Clock,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { LocationCoords, ServiceProvider, Booking } from '../../types';

interface LiveMapVisualizerProps {
  customerLocation: LocationCoords;
  providers: ServiceProvider[];
  activeBooking?: Booking | null;
  selectedProvider?: ServiceProvider | null;
  onSelectProvider?: (provider: ServiceProvider) => void;
  heightClass?: string;
}

export const LiveMapVisualizer: React.FC<LiveMapVisualizerProps> = ({
  customerLocation,
  providers,
  activeBooking,
  selectedProvider,
  onSelectProvider,
  heightClass = 'h-72 md:h-96',
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
  const [techProgress, setTechProgress] = useState<number>(0.35);

  useEffect(() => {
    if (activeBooking?.status === 'en_route') {
      const interval = setInterval(() => {
        setTechProgress((prev) => (prev >= 0.95 ? 0.2 : prev + 0.04));
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [activeBooking?.status]);

  const centerLat = customerLocation.lat;
  const centerLng = customerLocation.lng;
  const scale = 14000 * zoomLevel;

  const projectToSvg = (lat: number, lng: number) => {
    const x = 400 + (lng - centerLng) * scale;
    const y = 250 - (lat - centerLat) * scale;
    return { x, y };
  };

  const customerSvg = projectToSvg(customerLocation.lat, customerLocation.lng);
  const assignedPro = activeBooking?.provider || providers.find((p) => p.id === activeBooking?.providerId);
  const assignedProSvg = assignedPro ? projectToSvg(assignedPro.coords.lat, assignedPro.coords.lng) : null;

  const currentTechSvg =
    assignedProSvg && activeBooking?.status === 'en_route'
      ? {
          x: assignedProSvg.x + (customerSvg.x - assignedProSvg.x) * techProgress,
          y: assignedProSvg.y + (customerSvg.y - assignedProSvg.y) * techProgress,
        }
      : assignedProSvg;

  return (
    <div className={`relative w-full ${heightClass} bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner select-none`}>
      <svg
        viewBox="0 0 800 500"
        className="w-full h-full object-cover transition-transform duration-300"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <defs>
          <pattern id="streetGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#1e293b" strokeWidth="1" strokeOpacity="0.4" />
          </pattern>
          <radialGradient id="pulseGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="800" height="500" fill="#090d16" />
        <rect width="800" height="500" fill="url(#streetGrid)" />

        {/* Roads */}
        <path d="M 0 250 C 250 240, 500 270, 800 250" fill="none" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
        <path d="M 400 0 C 380 200, 420 350, 400 500" fill="none" stroke="#334155" strokeWidth="6" strokeLinecap="round" />

        {/* Route Line */}
        {customerSvg && currentTechSvg && activeBooking && (
          <path
            d={`M ${currentTechSvg.x} ${currentTechSvg.y} L ${customerSvg.x} ${customerSvg.y}`}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeDasharray="6 6"
            className="animate-pulse"
          />
        )}

        {/* Customer Pin */}
        <g transform={`translate(${customerSvg.x}, ${customerSvg.y})`}>
          <circle cx="0" cy="0" r="18" fill="url(#pulseGlow)" />
          <circle cx="0" cy="0" r="8" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
        </g>

        {/* Providers */}
        {providers.map((pro) => {
          const proSvg = projectToSvg(pro.coords.lat, pro.coords.lng);
          return (
            <g
              key={pro.id}
              transform={`translate(${proSvg.x}, ${proSvg.y})`}
              className="cursor-pointer"
              onClick={() => onSelectProvider && onSelectProvider(pro)}
            >
              <circle cx="0" cy="0" r="12" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="3" fill="#10b981" />
            </g>
          );
        })}

        {/* Moving Tech */}
        {currentTechSvg && activeBooking && (
          <g transform={`translate(${currentTechSvg.x}, ${currentTechSvg.y})`}>
            <circle cx="0" cy="0" r="14" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
            <text x="0" y="4" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
              ⚡
            </text>
          </g>
        )}
      </svg>

      <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 text-xs text-slate-300">
        <MapPin className="w-3.5 h-3.5 text-blue-400" />
        <span>{customerLocation.address}</span>
      </div>
    </div>
  );
};
