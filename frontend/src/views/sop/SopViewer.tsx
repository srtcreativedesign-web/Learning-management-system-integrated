import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen,
  ArrowLeft,
  FileText,
  Loader2,
  Building,
  Store,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { getApiUrl, API_BASE_URL } from '@/lib/api';

interface SopPoint {
  id: string;
  order_num: number;
  title: string;
  description: string;
}

interface SopDocument {
  id: string;
  title: string;
  category: string;
  source_pdf: string;
  _count: { Points: number };
  Points?: SopPoint[];
}

export const SopViewer: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'HEAD_OFFICE' | 'OPERASIONAL'>(
    'HEAD_OFFICE'
  );
  const [selectedSopId, setSelectedSopId] = useState<string | null>(null);

  // Fetch List
  const { data: sops = [], isLoading } = useQuery<SopDocument[]>({
    queryKey: ['sops'],
    queryFn: async () => {
      const res = await fetch(getApiUrl('/api/sop'));
      if (!res.ok) throw new Error('Failed to load SOPs');
      return res.json();
    },
  });

  // Fetch Details
  const { data: selectedSopDetails, isLoading: loadingDetails } = useQuery<SopDocument>({
    queryKey: ['sop-detail', selectedSopId],
    queryFn: async () => {
      const res = await fetch(getApiUrl(`/api/sop/${selectedSopId}`));
      if (!res.ok) throw new Error('Failed to load SOP detail');
      return res.json();
    },
    enabled: Boolean(selectedSopId),
  });

  const filteredSops = sops.filter((s) => s.category === activeCategory);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      {!selectedSopId ? (
        <>
          <PageHeader
            title="Pustaka SOP"
            subtitle="Standar Operasional Prosedur Perusahaan yang terstruktur dan mudah diakses."
            icon={<BookOpen className="w-7 h-7" />}
          />

          {/* Category Tabs */}
          <div className="flex justify-center gap-3 mb-8">
            <button
              onClick={() => setActiveCategory('HEAD_OFFICE')}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activeCategory === 'HEAD_OFFICE'
                  ? 'bg-[#419CC3] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Building className="w-4 h-4" /> Head Office
            </button>
            <button
              onClick={() => setActiveCategory('OPERASIONAL')}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 cursor-pointer ${
                activeCategory === 'OPERASIONAL'
                  ? 'bg-[#419CC3] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Store className="w-4 h-4" /> Operasional Outlet
            </button>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#419CC3] mb-3" />
              <p className="text-sm text-slate-500">Memuat daftar SOP...</p>
            </div>
          ) : filteredSops.length === 0 ? (
            <EmptyState
              icon={<FileText className="w-8 h-8" />}
              title="Belum ada dokumen SOP"
              description="Belum ada dokumen SOP di kategori ini."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSops.map((sop) => (
                <div
                  key={sop.id}
                  onClick={() => setSelectedSopId(sop.id)}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 cursor-pointer hover:shadow-xl hover:border-[#89B4E1] transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#89B4E1]/20 text-[#419CC3] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1 group-hover:text-[#419CC3] transition-colors">
                    {sop.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {sop._count?.Points || 0} Langkah Prosedur
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* SOP Detail Reader */
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
          <Button
            variant="ghost"
            onClick={() => setSelectedSopId(null)}
            className="text-slate-500 hover:text-[#419CC3] mb-6 flex items-center gap-2 font-bold text-xs p-0 h-auto cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar SOP
          </Button>

          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8 border-b border-slate-100 pb-4">
            {selectedSopDetails?.title}
          </h2>

          {loadingDetails ? (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#419CC3] mb-3" />
              <p className="text-sm text-slate-500">Memuat detail prosedur...</p>
            </div>
          ) : (
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#89B4E1] before:to-transparent">
              {selectedSopDetails?.Points?.map((point, index) => (
                <div
                  key={point.id}
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                >
                  {/* Timeline Circle */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-[#419CC3] text-white shadow-md shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold text-sm">
                    {index + 1}
                  </div>

                  {/* Content Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl shadow-xs border border-slate-200 hover:shadow-md hover:border-[#89B4E1] transition-all">
                    <h4 className="text-base font-bold text-slate-800 mb-2">{point.title}</h4>
                    <p className="text-slate-600 leading-relaxed text-xs whitespace-pre-line">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedSopDetails?.source_pdf && (
            <div className="mt-12 text-center pt-6 border-t border-slate-100">
              <a
                href={`${API_BASE_URL}${selectedSopDetails.source_pdf}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-white bg-[#419CC3] hover:bg-[#3484a6] px-6 py-2.5 rounded-xl shadow-md transition-all"
              >
                <FileText className="w-4 h-4" /> Lihat Dokumen Asli (PDF){' '}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
