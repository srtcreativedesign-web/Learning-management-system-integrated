import React from 'react';
import { BarChart3, Construction } from 'lucide-react';

export const AuditAnalytics: React.FC = () => {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2.5">
          <BarChart3 className="w-6 h-6 text-[#419CC3]" /> Laporan Audit & Assessment
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Pantau ringkasan kepatuhan dan temuan inspeksi lapangan.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-16 flex flex-col items-center justify-center text-center shadow-xs">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
          <Construction className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Modul Sedang Dalam Pengembangan</h3>
        <p className="text-sm text-slate-500 max-w-sm mt-1">
          Laporan agregasi skor inspeksi dan breakdown temuan outlet akan tampil di sini.
        </p>
      </div>
    </div>
  );
};
