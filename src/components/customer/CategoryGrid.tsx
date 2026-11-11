import React, { useState } from 'react';
import {
  Zap,
  Wrench,
  Wind,
  ThermometerSnowflake,
  RotateCcw,
  Refrigerator,
  Droplets,
  Camera,
  Hammer,
  Paintbrush,
  Sparkles,
  UtensilsCrossed,
  Armchair,
  ShieldAlert,
  SprayCan,
  Cpu,
  Waves,
  BatteryCharging,
  Sun,
  Search,
  Star,
} from 'lucide-react';
import { ServiceCategory } from '../../types';

interface CategoryGridProps {
  categories: ServiceCategory[];
  onSelectCategory: (category: ServiceCategory) => void;
  onInstantEmergencyBook: (category: ServiceCategory) => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  onSelectCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const getIcon = (name: string) => {
    switch (name) {
      case 'Zap': return <Zap className="w-6 h-6 text-amber-500" />;
      case 'Wrench': return <Wrench className="w-6 h-6 text-blue-500" />;
      case 'Wind': return <Wind className="w-6 h-6 text-cyan-500" />;
      case 'ThermometerSnowflake': return <ThermometerSnowflake className="w-6 h-6 text-sky-500" />;
      case 'RotateCcw': return <RotateCcw className="w-6 h-6 text-indigo-500" />;
      case 'Refrigerator': return <Refrigerator className="w-6 h-6 text-teal-500" />;
      case 'Droplets': return <Droplets className="w-6 h-6 text-blue-400" />;
      case 'Camera': return <Camera className="w-6 h-6 text-slate-500" />;
      case 'Hammer': return <Hammer className="w-6 h-6 text-orange-500" />;
      case 'Paintbrush': return <Paintbrush className="w-6 h-6 text-rose-500" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-emerald-500" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-6 h-6 text-amber-600" />;
      case 'Armchair': return <Armchair className="w-6 h-6 text-purple-500" />;
      case 'ShieldAlert': return <ShieldAlert className="w-6 h-6 text-red-500" />;
      case 'SprayCan': return <SprayCan className="w-6 h-6 text-teal-600" />;
      case 'Cpu': return <Cpu className="w-6 h-6 text-violet-500" />;
      case 'Waves': return <Waves className="w-6 h-6 text-cyan-600" />;
      case 'BatteryCharging': return <BatteryCharging className="w-6 h-6 text-yellow-500" />;
      case 'Sun': return <Sun className="w-6 h-6 text-amber-500" />;
      default: return <Wrench className="w-6 h-6 text-blue-500" />;
    }
  };

  const filtered = categories.filter((cat) =>
    searchQuery ? cat.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
  );

  return (
    <div className="space-y-6">
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search 'Electrician', 'Plumber', 'AC Repair'..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat)}
            className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center mb-3">
                {getIcon(cat.iconName)}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {cat.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
              <span className="font-bold">Starts ₹{cat.basePrice}</span>
              <div className="flex items-center gap-1 font-semibold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span>{cat.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
