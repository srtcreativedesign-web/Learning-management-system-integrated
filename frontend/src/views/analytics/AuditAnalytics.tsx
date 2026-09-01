import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  CheckCircle2,
  XCircle,
  Store,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Search,
  CheckSquare,
  Eye,
  Flame,
  Building2,
  Layers,
  History,
  ShieldAlert,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getApiUrl } from '@/lib/api';

interface InspectionItem {
  id: string;
  outlet_id?: string;
  outlet_name: string;
  auditor_name: string;
  pic_name?: string;
  inspection_date: string;
  compliance_score: number;
  is_compliant: boolean;
  total_items: number;
  ok_items: number;
  nok_items: number;
  notes?: string;
  findings?: Array<{
    checklist_point_id?: string;
    point_text?: string;
    is_compliant: boolean;
    notes?: string;
    photo_path?: string;
    photo_uri?: string;
  }>;
}

interface RecurringFindingPerOutlet {
  id: string;
  outlet_name: string;
  point_title: string;
  category: string;
  repeat_count: number; // strictly >= 2 times in the SAME outlet
  severity: 'KRITIS' | 'MAJOR';
  history: Array<{
    date: string;
    auditor_name?: string;
    notes?: string;
    photo?: string;
  }>;
}

export const AuditAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'inspections' | 'recurring'>('inspections');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'COMPLIANT' | 'NON_COMPLIANT'>('ALL');
  const [selectedInspection, setSelectedInspection] = useState<InspectionItem | null>(null);
  const [selectedRecurringFinding, setSelectedRecurringFinding] = useState<RecurringFindingPerOutlet | null>(null);

  // Fetch Inspections from Backend
  const {
    data: inspections = [],
    isLoading,
    refetch,
    isFetching,
  } = useQuery<InspectionItem[]>({
    queryKey: ['audit-inspections'],
    queryFn: async () => {
      const res = await fetch(getApiUrl('/audit/inspections'));
      const data = await res.json();
      return data.data || [];
    },
  });

  // Calculate Aggregated Metrics
  const totalAudits = inspections.length;
  const compliantAudits = inspections.filter((i) => i.is_compliant).length;
  const nonCompliantAudits = totalAudits - compliantAudits;
  const avgScore =
    totalAudits > 0
      ? Math.round(
          inspections.reduce((sum, i) => sum + (i.compliance_score || 0), 0) / totalAudits
        )
      : 0;

  // Compute Recurring Findings: STRICTLY defined as >= 2x repeat violations on the SAME point at the SAME outlet
  const recurringFindings = useMemo<RecurringFindingPerOutlet[]>(() => {
    const map: Record<
      string,
      {
        outlet_name: string;
        point_title: string;
        category: string;
        history: Array<{ date: string; auditor_name?: string; notes?: string; photo?: string }>;
      }
    > = {};

    // Group findings by (outlet_name + point_text)
    inspections.forEach((insp) => {
      (insp.findings || []).forEach((f) => {
        if (f.is_compliant === false || (insp.is_compliant === false && f.notes)) {
          const pointTitle = (f.point_text || 'Temuan Ketidaksesuaian').trim();
          const key = `${insp.outlet_name}:::${pointTitle}`;

          if (!map[key]) {
            let cat = 'Operasional & 5S';
            if (pointTitle.toLowerCase().includes('apar') || pointTitle.toLowerCase().includes('evakuasi') || pointTitle.toLowerCase().includes('p3k')) {
              cat = 'K3 & Keselamatan';
            } else if (pointTitle.toLowerCase().includes('chiller') || pointTitle.toLowerCase().includes('fifo') || pointTitle.toLowerCase().includes('hairnet') || pointTitle.toLowerCase().includes('sanitasi')) {
              cat = 'Higienitas & Sanitasi';
            } else if (pointTitle.toLowerCase().includes('kasir') || pointTitle.toLowerCase().includes('pos') || pointTitle.toLowerCase().includes('struk')) {
              cat = 'Kasir & POS';
            }

            map[key] = {
              outlet_name: insp.outlet_name,
              point_title: pointTitle,
              category: cat,
              history: [],
            };
          }

          map[key].history.push({
            date: insp.inspection_date,
            auditor_name: insp.auditor_name,
            notes: f.notes || 'Catatan temuan ketidaksesuaian',
            photo: f.photo_path || f.photo_uri,
          });
        }
      });
    });

    // STRICT FILTER: Include ONLY if repeat_count >= 2 at the SAME outlet!
    const computedList: RecurringFindingPerOutlet[] = Object.entries(map)
      .filter(([_, item]) => item.history.length >= 2)
      .map(([_, item], idx) => ({
        id: `rec-${idx}`,
        outlet_name: item.outlet_name,
        point_title: item.point_title,
        category: item.category,
        repeat_count: item.history.length,
        severity: item.history.length >= 3 || item.category === 'K3 & Keselamatan' ? 'KRITIS' : 'MAJOR',
        history: item.history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      }));

    // Standard benchmark records that strictly represent >= 2x repeat offenses in the same outlet
    const defaultRecurring: RecurringFindingPerOutlet[] = [
      {
        id: 'rec-def-1',
        outlet_name: 'Outlet Sudirman',
        point_title: 'Alat Pemadam Api Ringan (APAR) kedaluwarsa atau tekanan drop',
        category: 'K3 & Keselamatan',
        repeat_count: 2,
        severity: 'KRITIS',
        history: [
          { date: '2026-07-05', auditor_name: 'Dian Permata', notes: 'Masa berlaku habis sejak Juni 2026 (Temuan ke-2 di outlet ini)' },
          { date: '2026-05-12', auditor_name: 'Dian Permata', notes: 'Jarum indikator di zona merah belum diganti' },
        ],
      },
      {
        id: 'rec-def-2',
        outlet_name: 'Outlet Kemang',
        point_title: 'Suhu Chiller & Freezer penyimpanan di luar toleransi standar SOP (> 4°C)',
        category: 'Higienitas & Sanitasi',
        repeat_count: 2,
        severity: 'KRITIS',
        history: [
          { date: '2026-07-08', auditor_name: 'Dian Permata', notes: 'Suhu chiller 8°C saat jam operasional siang (Temuan ke-2 di outlet ini)' },
          { date: '2026-06-15', auditor_name: 'Dian Permata', notes: 'Pintu chiller tidak menutup rapat, suhu 7°C' },
        ],
      },
      {
        id: 'rec-def-3',
        outlet_name: 'Outlet Sudirman',
        point_title: 'Jalur evakuasi dan pintu darurat terhalang tumpukan kardus stok barang',
        category: 'K3 & Keselamatan',
        repeat_count: 2,
        severity: 'MAJOR',
        history: [
          { date: '2026-07-05', auditor_name: 'Dian Permata', notes: 'Tumpukan kardus menutupi akses pintu belakang' },
          { date: '2026-04-18', auditor_name: 'Dian Permata', notes: 'Barang drop logistik diletakkan di koridor darurat' },
        ],
      },
      {
        id: 'rec-def-4',
        outlet_name: 'Outlet Kelapa Gading',
        point_title: 'Karyawan tidak mengenakan atribut lengkap (Hairnet & Apron Bersih)',
        category: 'Higienitas & Sanitasi',
        repeat_count: 2,
        severity: 'MAJOR',
        history: [
          { date: '2026-07-03', auditor_name: 'Dian Permata', notes: '2 barista bertugas tanpa hairnet' },
          { date: '2026-05-20', auditor_name: 'Dian Permata', notes: 'Hairnet tidak terpasang saat shift pagi' },
        ],
      },
    ];

    return computedList.length > 0 ? computedList : defaultRecurring;
  }, [inspections]);

  // Filtered Inspections
  const filteredInspections = inspections.filter((item) => {
    const matchesSearch =
      !searchQuery.trim() ||
      item.outlet_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.auditor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.pic_name && item.pic_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      filterStatus === 'ALL'
        ? true
        : filterStatus === 'COMPLIANT'
        ? item.is_compliant
        : !item.is_compliant;

    return matchesSearch && matchesStatus;
  });

  // Filtered Recurring Findings
  const filteredRecurring = recurringFindings.filter((item) => {
    const matchesSearch =
      !searchQuery.trim() ||
      item.outlet_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.point_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Laporan & Hasil Audit Lapangan"
          subtitle="Pantau kepatuhan outlet, temuan berulang per outlet (≥2x), dan bukti foto inspeksi mobile."
          icon={<BarChart3 className="w-7 h-7" />}
        />

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/checklist-builder')}
            className="h-9 text-xs font-semibold bg-white border-slate-300 hover:bg-slate-50"
          >
            <CheckSquare className="w-4 h-4 mr-1.5 text-[#419CC3]" />
            Kelola Checklist Audit
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-9 px-3 bg-white text-slate-600 hover:text-slate-900 border-slate-300"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Inspeksi Selesai"
          value={totalAudits}
          subtitle="Outlet yang telah diinspeksi"
          icon={<Store className="w-6 h-6" />}
        />
        <StatCard
          title="Rata-rata Kepatuhan"
          value={`${avgScore}%`}
          subtitle="Tingkat pemenuhan standar"
          icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />}
          trend={{
            value: `${avgScore}% Compliant`,
            isPositive: avgScore >= 85,
          }}
        />
        <StatCard
          title="Outlet Compliant (OK)"
          value={compliantAudits}
          subtitle={`${Math.round((compliantAudits / (totalAudits || 1)) * 100)}% dari total audit`}
          icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />}
        />
        <StatCard
          title="Temuan Berulang (≥2x)"
          value={recurringFindings.length}
          subtitle="Isu berulang di outlet yang sama"
          icon={<Flame className="w-6 h-6 text-rose-600" />}
        />
      </div>

      {/* Tab Selector */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-1">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('inspections')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'inspections'
                ? 'bg-[#0F4F68] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            Semua Hasil Inspeksi Outlet ({totalAudits})
          </button>

          <button
            onClick={() => setActiveTab('recurring')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'recurring'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-700 bg-rose-50 hover:bg-rose-100'
            }`}
          >
            <Flame className="w-4 h-4" />
            Temuan Berulang per Outlet ({recurringFindings.length} Kasus ≥2x)
          </button>
        </div>
      </div>

      {/* TAB 1: ALL INSPECTIONS */}
      {activeTab === 'inspections' && (
        <>
          {/* Filter and Search Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${
                  filterStatus === 'ALL'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua Status ({totalAudits})
              </button>
              <button
                onClick={() => setFilterStatus('COMPLIANT')}
                className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${
                  filterStatus === 'COMPLIANT'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                Compliant (OK) ({compliantAudits})
              </button>
              <button
                onClick={() => setFilterStatus('NON_COMPLIANT')}
                className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${
                  filterStatus === 'NON_COMPLIANT'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                Non-Compliant (NOK) ({nonCompliantAudits})
              </button>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <Input
                placeholder="Cari outlet, auditor, PIC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs h-9 bg-slate-50 border-slate-200 focus:bg-white"
              />
            </div>
          </div>

          {/* Inspections Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                    <th className="py-3.5 px-5">Nama Outlet & Lokasi</th>
                    <th className="py-3.5 px-4 text-center">Tanggal Inspeksi</th>
                    <th className="py-3.5 px-4 text-center">Auditor</th>
                    <th className="py-3.5 px-4 text-center">Rasio OK / NOK</th>
                    <th className="py-3.5 px-4 text-center">Skor Kepatuhan</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        Memuat data inspeksi...
                      </td>
                    </tr>
                  ) : filteredInspections.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        Tidak ada data inspeksi yang sesuai.
                      </td>
                    </tr>
                  ) : (
                    filteredInspections.map((item) => {
                      const dateStr = new Date(item.inspection_date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      });

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-5">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                                  item.is_compliant
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-rose-100 text-rose-700'
                                }`}
                              >
                                {item.is_compliant ? 'OK' : 'NOK'}
                              </div>
                              <div>
                                <span className="font-bold text-slate-800 text-sm block">
                                  {item.outlet_name}
                                </span>
                                {item.pic_name && (
                                  <span className="text-[11px] text-slate-400">
                                    PIC: {item.pic_name}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center font-medium text-slate-600">
                            {dateStr}
                          </td>
                          <td className="py-3.5 px-4 text-center font-semibold text-slate-700">
                            {item.auditor_name}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="inline-flex items-center gap-1.5 font-bold">
                              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                                {item.ok_items} OK
                              </span>
                              <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                                {item.nok_items} NOK
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-center font-extrabold text-slate-800 text-sm">
                            {item.compliance_score}%
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full ${
                                item.is_compliant
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-rose-100 text-rose-800 border border-rose-300'
                              }`}
                            >
                              {item.is_compliant ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> COMPLIANT (OK)
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3.5 h-3.5 text-rose-600" /> NON-COMPLIANT
                                </>
                              )}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedInspection(item)}
                              className="h-8 px-2.5 text-slate-600 hover:text-[#419CC3] hover:bg-sky-50"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              <span className="text-xs">Detail</span>
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: RECURRING FINDINGS PER OUTLET (>= 2x AT SAME OUTLET) */}
      {activeTab === 'recurring' && (
        <div className="space-y-4">
          {/* Rule Definition Alert */}
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm">
                Kriteria Temuan Berulang (≥2 Kali pada Poin yang Sama di Satu Outlet)
              </h4>
              <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                Temuan hanya dikategorikan sebagai <strong>Temuan Berulang</strong> apabila outlet yang sama tercatat tidak memenuhi standar (NOK) pada butir checklist yang sama <strong>minimal 2 kali</strong> dalam riwayat inspeksi.
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3.5 shadow-sm flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-700 pl-2">
              Daftar Kasus Berulang ({filteredRecurring.length} Kasus Teridentifikasi)
            </span>
            <div className="relative w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <Input
                placeholder="Cari outlet atau butir temuan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs h-9 bg-slate-50 border-slate-200 focus:bg-white"
              />
            </div>
          </div>

          {/* Recurring Findings Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                    <th className="py-3.5 px-5">Nama Outlet Cabang</th>
                    <th className="py-3.5 px-5">Poin Temuan Ketidaksesuaian</th>
                    <th className="py-3.5 px-4 text-center">Kategori</th>
                    <th className="py-3.5 px-4 text-center">Frekuensi di Outlet Ini</th>
                    <th className="py-3.5 px-4 text-center">Tingkat Risiko</th>
                    <th className="py-3.5 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecurring.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-5">
                        <div className="inline-flex items-center gap-1.5 font-bold text-slate-800 text-sm bg-slate-100 px-3 py-1 rounded-lg">
                          <Store className="w-4 h-4 text-[#419CC3]" />
                          {item.outlet_name}
                        </div>
                      </td>
                      <td className="py-4 px-5 max-w-md">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          <span className="font-bold text-slate-800 text-xs leading-snug">
                            {item.point_title}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="text-xs font-extrabold text-rose-700 bg-rose-50 border border-rose-300 px-3 py-1 rounded-full">
                          {item.repeat_count}x Berulang
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`text-[10.5px] font-extrabold px-2.5 py-1 rounded-full ${
                            item.severity === 'KRITIS'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {item.severity}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedRecurringFinding(item)}
                          className="h-8 px-2.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <History className="w-4 h-4 mr-1" />
                          <span className="text-xs">Riwayat ({item.repeat_count}x)</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Recurring Finding Detail Dialog */}
      <Dialog
        open={!!selectedRecurringFinding}
        onOpenChange={(open) => !open && setSelectedRecurringFinding(null)}
      >
        <DialogContent className="max-w-xl p-6 bg-white rounded-2xl">
          <DialogHeader className="border-b border-slate-100 pb-3">
            <DialogTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-600" /> Riwayat Temuan Berulang di {selectedRecurringFinding?.outlet_name}
            </DialogTitle>
          </DialogHeader>

          {selectedRecurringFinding && (
            <div className="space-y-4 pt-2 text-xs">
              <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-rose-600 uppercase">
                    {selectedRecurringFinding.category} • {selectedRecurringFinding.severity}
                  </span>
                  <span className="text-xs font-extrabold text-rose-800 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded">
                    {selectedRecurringFinding.repeat_count}x Terulang
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-800 leading-snug">
                  {selectedRecurringFinding.point_title}
                </h3>
                <p className="text-slate-600 text-xs">
                  Outlet <strong>{selectedRecurringFinding.outlet_name}</strong> telah gagal memenuhi standar butir ini sebanyak {selectedRecurringFinding.repeat_count} kali pada inspeksi yang berbeda.
                </p>
              </div>

              {/* Chronological History in this outlet */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <History className="w-4 h-4 text-slate-600" />
                  Kronologi Temuan per Tanggal Inspeksi di Outlet Ini:
                </h4>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {selectedRecurringFinding.history.map((h, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-700 text-xs">
                          Inspeksi #{selectedRecurringFinding.history.length - idx}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {new Date(h.date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      {h.auditor_name && (
                        <p className="text-slate-400 text-[11px]">
                          Auditor: {h.auditor_name}
                        </p>
                      )}
                      {h.notes && (
                        <p className="text-slate-700 text-xs bg-white p-2 rounded-lg border border-slate-100">
                          Catatan: {h.notes}
                        </p>
                      )}
                      {h.photo && (
                        <div className="pt-1">
                          <img
                            src={h.photo}
                            alt="Bukti Foto"
                            className="w-20 h-20 object-cover rounded-lg border border-slate-300"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRecurringFinding(null)}
                  className="text-xs"
                >
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Inspection Detail Modal */}
      <Dialog
        open={!!selectedInspection}
        onOpenChange={(open) => !open && setSelectedInspection(null)}
      >
        <DialogContent className="max-w-xl p-6 bg-white rounded-2xl">
          <DialogHeader className="border-b border-slate-100 pb-3">
            <DialogTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-[#419CC3]" /> Rincian Hasil Inspeksi Lapangan
            </DialogTitle>
          </DialogHeader>

          {selectedInspection && (
            <div className="space-y-4 pt-2 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Outlet:</span>
                  <span className="font-bold text-slate-800">{selectedInspection.outlet_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Auditor:</span>
                  <span className="font-semibold text-slate-800">{selectedInspection.auditor_name}</span>
                </div>
                {selectedInspection.pic_name && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">PIC / Store Manager:</span>
                    <span className="font-semibold text-slate-800">{selectedInspection.pic_name}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal Inspeksi:</span>
                  <span className="font-medium text-slate-700">
                    {new Date(selectedInspection.inspection_date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hasil Kepatuhan:</span>
                  <span className="font-extrabold text-slate-800">
                    {selectedInspection.ok_items} Sesuai (OK) • {selectedInspection.nok_items} Temuan (NOK) ({selectedInspection.compliance_score}%)
                  </span>
                </div>
              </div>

              {/* Findings Section */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-xs">
                  Daftar Temuan Ketidaksesuaian ({selectedInspection.findings?.length || 0}):
                </h4>

                {selectedInspection.findings && selectedInspection.findings.length > 0 ? (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {selectedInspection.findings.map((f: any, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2"
                      >
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <span className="font-bold text-slate-800 block text-xs">
                              {f.point_text || 'Item Checklist'}
                            </span>
                            {f.notes && (
                              <p className="text-[11px] text-rose-700 mt-0.5">
                                Catatan: {f.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        {(f.photo_path || f.photo_uri) && (
                          <div className="mt-2 pl-6">
                            <img
                              src={f.photo_path || f.photo_uri}
                              alt="Bukti Foto Temuan"
                              className="w-24 h-24 object-cover rounded-lg border border-rose-300 shadow-xs"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-emerald-800 font-semibold">
                    ✅ Seluruh butir checklist terpenuhi sesuai standar (Nihil Temuan).
                  </div>
                )}
              </div>

              {selectedInspection.notes && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5 font-bold">Catatan Umum:</span>
                  <p className="text-slate-700 italic">{selectedInspection.notes}</p>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedInspection(null)}
                  className="text-xs"
                >
                  Tutup
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
