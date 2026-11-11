import React, { useState } from 'react';
import { ShieldCheck, Check } from 'lucide-react';
import { AMC_PLANS } from '../../data/mockData';

export const SubscriptionsView: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState('amc-2');

  return (
    <div className="space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-1">
        <span className="text-xs font-bold text-blue-600 uppercase">Annual Maintenance Contracts (AMC)</span>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">HomeEase Shield Plans</h2>
        <p className="text-xs text-slate-500">Free preventive tune-ups, zero visiting fees, and express priority.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {AMC_PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          return (
            <div
              key={plan.id}
              className={`p-6 rounded-3xl border bg-white dark:bg-slate-900 space-y-4 ${
                isSelected ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">₹{plan.pricePerYear}</span>
                <span className="text-xs text-slate-400"> / year</span>
              </div>

              <div className="space-y-2 text-xs">
                {plan.benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full py-2.5 rounded-xl font-semibold text-xs ${
                  isSelected ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                }`}
              >
                {isSelected ? 'Active Plan ✓' : 'Select Plan'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
