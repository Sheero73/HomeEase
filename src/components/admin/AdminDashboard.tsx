import React, { useState } from 'react';
import { ServiceCategory, ServiceProvider, Booking, KYCDocument, SupportTicket } from '../../types';

interface AdminDashboardProps {
  categories: ServiceCategory[];
  providers: ServiceProvider[];
  bookings: Booking[];
  kycDocuments: KYCDocument[];
  tickets: SupportTicket[];
  onUpdateCategoryPrice: (categoryId: string, newBasePrice: number) => void;
  onApproveKYC: (docId: string) => void;
  onRejectKYC: (docId: string, reason: string) => void;
  onResolveTicket: (ticketId: string, resolution: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  categories,
  providers,
  bookings,
  kycDocuments,
  onApproveKYC,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Admin Command Center</h1>
          <p className="text-xs text-slate-500">Fleet telemetry, rate cards & provider KYC review</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 block">Gross Revenue</span>
          <span className="text-xl font-extrabold font-mono text-slate-900 dark:text-white mt-1 block">₹14,20,500</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 block">Platform 15% Take</span>
          <span className="text-xl font-extrabold font-mono text-blue-600 mt-1 block">₹2,13,075</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 block">Active Pros</span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white mt-1 block">{providers.length}</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-slate-400 block">Completed Orders</span>
          <span className="text-xl font-extrabold text-emerald-600 mt-1 block">198,420</span>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">Provider KYC Queue</h3>
        {kycDocuments.map((doc) => (
          <div key={doc.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border flex justify-between items-center">
            <div>
              <span className="font-bold block">{doc.providerName}</span>
              <span className="text-slate-500">{doc.documentTitle} ({doc.status})</span>
            </div>
            {doc.status === 'pending' && (
              <button
                onClick={() => onApproveKYC(doc.id)}
                className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-semibold"
              >
                Approve KYC
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
