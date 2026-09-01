import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import gsap from 'gsap';
import {
  TrendingUp,
  Download,
  Printer,
  RefreshCw,
  GraduationCap,
  Award,
  CheckCircle2,
  XCircle,
  Users,
  Store,
  Calendar,
  Search,
  BookOpen,
  Sparkles,
  Eye,
  Info,
  BarChart3,
  FileSpreadsheet,
} from 'lucide-react';

import { PageHeader } from '@/components/common/PageHeader';
import { StatCard } from '@/components/common/StatCard';
import { LineChartCard } from '@/components/charts/LineChartCard';
import { BarChartCard } from '@/components/charts/BarChartCard';
import { DataTable, dataTableHelper } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getApiUrl } from '@/lib/api';
import { printTrainingReport } from '@/utils/printTrainingReport';

// Interfaces
interface TrainingRecord {
  id: string;
  type: 'ONLINE' | 'IN_HOUSE';
  typeLabel: string;
  date: string;
  traineeName: string;
  traineeId: string | null;
  traineeRole: string | null;
  title: string;
  trainerName: string | null;
  outletId: string | null;
  outletName: string | null;
  score: number;
  maxScore: number;
  percentage: number;
  grade: string;
  isPassed: boolean;
  xpAwarded: number;
  notes?: string | null;
  answersDetailCount?: number;
  assessmentsCount?: number;
}

interface OverviewData {
  summary: {
    totalTrainingEvents: number;
    totalPassedEvents: number;
    overallPassRate: number;
    totalTraineesTrained: number;
    totalXpAwarded: number;
    online: {
      totalAttempts: number;
      passedAttempts: number;
      passRate: number;
      avgScore: number;
      totalXp: number;
      statusDistribution: { passed: number; failed: number };
    };
    inHouse: {
      totalSessions: number;
      passedSessions: number;
      passRate: number;
      avgPercentage: number;
      gradeDistribution: { SB: number; B: number; C: number; K: number };
    };
  };
  monthlyTrend: Array<{
    monthKey: string;
    monthLabel: string;
    onlineAttempts: number;
    onlinePassed: number;
    inHouseSessions: number;
    inHousePassed: number;
    totalParticipants: number;
  }>;
  coursePerformance: Array<{
    courseId: string;
    title: string;
    totalAttempts: number;
    passedCount: number;
    failedCount: number;
    passRate: number;
    avgScore: number;
  }>;
  outletPerformance: Array<{
    outletId: string;
    outletName: string;
    totalSessions: number;
    passedCount: number;
    passRate: number;
    avgPercentage: number;
    gradeSB: number;
    gradeB: number;
    gradeC: number;
    gradeK: number;
  }>;
}

interface OutletItem {
  id: string;
  hris_id: number;
  name: string;
  status: string;
}

type TabType = 'overview' | 'online' | 'inhouse' | 'ledger';

const column = dataTableHelper<TrainingRecord>();

export const TrainingAnalytics: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Filters State
  const [dateRange, setDateRange] = useState<string>('all');
  const [selectedOutlet, setSelectedOutlet] = useState<string>('all');
  const [recordType, setRecordType] = useState<'ALL' | 'ONLINE' | 'IN_HOUSE'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PASSED' | 'FAILED'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRecord, setSelectedRecord] = useState<TrainingRecord | null>(null);

  // Compute actual date parameters based on selected range
  const { startDate, endDate, dateRangeLabel } = useMemo(() => {
    const now = new Date();
    let start: Date | null = null;
    let end: Date = now;
    let label = 'Semua Waktu';

    if (dateRange === '30days') {
      start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      label = '30 Hari Terakhir';
    } else if (dateRange === '90days') {
      start = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      label = '90 Hari Terakhir';
    } else if (dateRange === 'thisMonth') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      label = 'Bulan Ini';
    } else if (dateRange === 'thisYear') {
      start = new Date(now.getFullYear(), 0, 1);
      label = 'Tahun Ini';
    }

    return {
      startDate: start ? start.toISOString() : undefined,
      endDate: start ? end.toISOString() : undefined,
      dateRangeLabel: label,
    };
  }, [dateRange]);

  // Fetch Outlets
  const { data: outlets = [] } = useQuery<OutletItem[]>({
    queryKey: ['training-report-outlets'],
    queryFn: async () => {
      const res = await fetch(getApiUrl('training-report/outlets'));
      const json = await res.json();
      return json.data || [];
    },
  });

  // Fetch Overview Data
  const {
    data: overview,
    isLoading: isLoadingOverview,
    refetch: refetchOverview,
    isFetching: isFetchingOverview,
  } = useQuery<OverviewData>({
    queryKey: ['training-report-overview', startDate, endDate, selectedOutlet],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (selectedOutlet !== 'all') params.append('outletId', selectedOutlet);

      const res = await fetch(getApiUrl(`training-report/overview?${params.toString()}`));
      const json = await res.json();
      return json.data;
    },
  });

  // Fetch Records Ledger
  const {
    data: recordsData,
    isLoading: isLoadingRecords,
    refetch: refetchRecords,
  } = useQuery<{ total: number; records: TrainingRecord[] }>({
    queryKey: ['training-report-records', startDate, endDate, recordType, statusFilter, selectedOutlet, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (recordType !== 'ALL') params.append('type', recordType);
      if (statusFilter !== 'ALL') params.append('isPassed', statusFilter);
      if (selectedOutlet !== 'all') params.append('outletId', selectedOutlet);
      if (searchQuery) params.append('search', searchQuery);
      params.append('limit', '200');

      const res = await fetch(getApiUrl(`training-report/records?${params.toString()}`));
      const json = await res.json();
      return json.data || { total: 0, records: [] };
    },
  });

  // GSAP animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-report-card',
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.35,
          stagger: 0.04,
          ease: 'power2.out',
          clearProps: 'all',
        }
      );
    });
    return () => ctx.revert();
  }, [overview, activeTab]);

  // Export to CSV
  const handleExportCSV = () => {
    const records = recordsData?.records || [];
    if (records.length === 0) {
      alert('Tidak ada data pelatihan untuk diekspor.');
      return;
    }

    const headers = [
      'No',
      'Tanggal',
      'Tipe Training',
      'Nama Peserta',
      'ID Karyawan',
      'Judul Pelatihan / Modul',
      'Trainer / Penilai',
      'Lokasi / Outlet',
      'Skor',
      'Grade',
      'Status Kelulusan',
      'Reward XP',
    ];

    const rows = records.map((r, index) => [
      index + 1,
      new Date(r.date).toLocaleDateString('id-ID'),
      r.typeLabel,
      `"${r.traineeName.replace(/"/g, '""')}"`,
      r.traineeId || '-',
      `"${r.title.replace(/"/g, '""')}"`,
      `"${(r.trainerName || '-').replace(/"/g, '""')}"`,
      `"${(r.outletName || '-').replace(/"/g, '""')}"`,
      r.score,
      r.grade,
      r.isPassed ? 'LULUS' : 'REMIDI',
      r.xpAwarded,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Laporan_Training_TnD_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Official PDF Report
  const handlePrintReport = () => {
    if (!overview) return;
    printTrainingReport({
      periodLabel: dateRangeLabel,
      summary: overview.summary,
      coursePerformance: overview.coursePerformance,
      outletPerformance: overview.outletPerformance,
      recentRecords: recordsData?.records?.slice(0, 15) || [],
    });
  };

  // Build Table Columns
  const tableColumns = useMemo(
    () =>
      column.columns([
        column.accessor('date', {
          header: 'Tanggal',
          cell: ({ getValue }) => {
            const d = new Date(getValue());
            return (
              <div className="flex flex-col">
                <span className="font-semibold text-slate-800">
                  {d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="text-[11px] text-slate-400">
                  {d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          },
        }),
        column.accessor('traineeName', {
          header: 'Peserta / Karyawan',
          cell: ({ row }) => (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#419CC3]/10 text-[#419CC3] flex items-center justify-center font-bold text-xs shrink-0">
                {row.original.traineeName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-slate-800 truncate">{row.original.traineeName}</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {row.original.traineeId ? `ID: ${row.original.traineeId}` : row.original.traineeRole || 'Peserta'}
                </span>
              </div>
            </div>
          ),
        }),
        column.accessor('typeLabel', {
          header: 'Modalitas & Judul',
          cell: ({ row }) => (
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    row.original.type === 'ONLINE'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {row.original.type === 'ONLINE' ? 'E-Learning' : 'In-House Outlet'}
                </span>
                {row.original.outletName && row.original.type === 'IN_HOUSE' && (
                  <span className="text-[11px] text-slate-500 font-medium truncate max-w-[150px]">
                    • {row.original.outletName}
                  </span>
                )}
              </div>
              <span className="font-semibold text-slate-700 text-xs truncate max-w-[260px]">
                {row.original.title}
              </span>
            </div>
          ),
        }),
        column.accessor('score', {
          header: 'Skor & Grade',
          cell: ({ row }) => {
            const isPassed = row.original.isPassed;
            return (
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-extrabold ${
                    isPassed ? 'text-emerald-600' : 'text-rose-500'
                  }`}
                >
                  {row.original.score}
                  <span className="text-xs font-normal text-slate-400">/{row.original.maxScore}</span>
                </span>
                <Badge
                  variant="outline"
                  className={`text-[10px] font-bold px-1.5 py-0.5 ${
                    row.original.grade === 'SB'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : row.original.grade === 'B'
                      ? 'bg-sky-50 text-sky-700 border-sky-300'
                      : row.original.grade === 'C'
                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                      : row.original.grade === 'K'
                      ? 'bg-rose-50 text-rose-700 border-rose-300'
                      : isPassed
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-rose-50 text-rose-700 border-rose-300'
                  }`}
                >
                  {row.original.grade}
                </Badge>
              </div>
            );
          },
        }),
        column.accessor('isPassed', {
          header: 'Kelulusan',
          cell: ({ getValue }) => {
            const passed = getValue();
            return (
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                  passed
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {passed ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Lulus
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5 text-rose-600" /> Remidi
                  </>
                )}
              </span>
            );
          },
        }),
        column.accessor('xpAwarded', {
          header: 'Reward XP',
          cell: ({ getValue }) => {
            const xp = getValue();
            return xp > 0 ? (
              <span className="text-xs font-extrabold text-amber-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> +{xp} XP
              </span>
            ) : (
              <span className="text-xs text-slate-400">-</span>
            );
          },
        }),
        column.display({
          id: 'actions',
          header: 'Aksi',
          cell: ({ row }) => (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRecord(row.original)}
              className="h-8 px-2.5 text-slate-600 hover:text-[#419CC3] hover:bg-sky-50"
            >
              <Eye className="w-4 h-4 mr-1" />
              <span className="text-xs">Detail</span>
            </Button>
          ),
        }),
      ]),
    []
  );

  // Line Chart datasets for monthly trend
  const lineChartLabels = overview?.monthlyTrend.map((m) => m.monthLabel) || [];
  const lineChartDatasets = [
    {
      label: 'E-Learning (Kuis)',
      data: overview?.monthlyTrend.map((m) => m.onlineAttempts) || [],
      borderColor: '#419CC3',
      backgroundColor: '#419CC3',
    },
    {
      label: 'In-House Outlet',
      data: overview?.monthlyTrend.map((m) => m.inHouseSessions) || [],
      borderColor: '#10b981',
      backgroundColor: '#10b981',
    },
  ];

  // Bar Chart dataset for In-House Grade Distribution
  const gradeLabels = ['SB (Sangat Baik)', 'B (Baik)', 'C (Cukup)', 'K (Kurang)'];
  const gradeDatasets = [
    {
      label: 'Jumlah Sesi',
      data: [
        overview?.summary.inHouse.gradeDistribution.SB || 0,
        overview?.summary.inHouse.gradeDistribution.B || 0,
        overview?.summary.inHouse.gradeDistribution.C || 0,
        overview?.summary.inHouse.gradeDistribution.K || 0,
      ],
      backgroundColor: ['#10b981', '#0ea5e9', '#f59e0b', '#f43f5e'],
      borderRadius: 6,
    },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <PageHeader
          title="Laporan Training & Development"
          subtitle="Pantau statistik komprehensif, tingkat kelulusan, performa modul, dan rekapitulasi data pelatihan seluruh divisi."
          icon={<TrendingUp className="w-7 h-7" />}
        />

        {/* Global Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Date Filter */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-300 rounded-lg py-2 px-3 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#419CC3] shadow-xs"
          >
            <option value="all">📅 Semua Waktu</option>
            <option value="thisMonth">📅 Bulan Ini</option>
            <option value="30days">📅 30 Hari Terakhir</option>
            <option value="90days">📅 90 Hari Terakhir</option>
            <option value="thisYear">📅 Tahun Ini</option>
          </select>

          {/* Outlet Filter */}
          <select
            value={selectedOutlet}
            onChange={(e) => setSelectedOutlet(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-300 rounded-lg py-2 px-3 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#419CC3] shadow-xs max-w-[170px] truncate"
          >
            <option value="all">🏢 Semua Outlet</option>
            {outlets.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>

          {/* Refresh Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetchOverview();
              refetchRecords();
            }}
            disabled={isFetchingOverview}
            className="h-9 px-3 bg-white text-slate-600 hover:text-slate-900 border-slate-300 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetchingOverview ? 'animate-spin' : ''}`} />
          </Button>

          {/* Print PDF Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrintReport}
            className="h-9 px-3 bg-white text-slate-700 hover:text-[#419CC3] border-slate-300 shadow-xs font-semibold"
          >
            <Printer className="w-4 h-4 mr-1.5 text-slate-500" />
            Cetak PDF
          </Button>

          {/* Export CSV Button */}
          <Button
            size="sm"
            onClick={handleExportCSV}
            className="h-9 px-3.5 bg-[#419CC3] hover:bg-[#347d9d] text-white shadow-xs font-semibold"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Ekspor CSV
          </Button>
        </div>
      </div>

      {/* Top Row: Executive Summary 4-Column StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
        <StatCard
          title="Total Pelatihan Terlaksana"
          value={overview?.summary.totalTrainingEvents || 0}
          subtitle={`${overview?.summary.online.totalAttempts || 0} Online + ${overview?.summary.inHouse.totalSessions || 0} In-House`}
          icon={<GraduationCap className="w-6 h-6" />}
          className="gsap-report-card"
        />

        <StatCard
          title="Tingkat Kelulusan (Pass Rate)"
          value={`${overview?.summary.overallPassRate || 0}%`}
          subtitle={`${overview?.summary.totalPassedEvents || 0} Sesi / Kuis Lulus`}
          icon={<CheckCircle2 className="w-6 h-6" />}
          trend={{
            value: `${overview?.summary.overallPassRate || 0}% Pass`,
            isPositive: (overview?.summary.overallPassRate || 0) >= 75,
          }}
          className="gsap-report-card"
        />

        <StatCard
          title="Karyawan Terlatih"
          value={overview?.summary.totalTraineesTrained || 0}
          subtitle="Partisipan unik aktif"
          icon={<Users className="w-6 h-6" />}
          className="gsap-report-card"
        />

        <StatCard
          title="Reward XP Diberikan"
          value={(overview?.summary.totalXpAwarded || 0).toLocaleString('id-ID')}
          subtitle="Total poin gamifikasi"
          icon={<Award className="w-6 h-6" />}
          className="gsap-report-card"
        />
      </div>

      {/* Main Tab Pills Bar */}
      <div className="w-full flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-white text-[#419CC3] shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Ringkasan & Tren
        </button>
        <button
          onClick={() => setActiveTab('online')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'online'
              ? 'bg-white text-[#419CC3] shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <BookOpen className="w-4 h-4" /> E-Learning (Online LMS)
        </button>
        <button
          onClick={() => setActiveTab('inhouse')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'inhouse'
              ? 'bg-white text-[#419CC3] shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Store className="w-4 h-4" /> In-House Training (Outlet)
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ledger'
              ? 'bg-white text-[#419CC3] shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" /> Rekapitulasi Data (Buku Besar)
        </button>
      </div>

      {/* TAB CONTENT: 1. OVERVIEW & TRENDS */}
      {activeTab === 'overview' && (
        <div className="space-y-6 w-full">
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            {/* Monthly Trend (Spans 2 columns) */}
            <div className="lg:col-span-2">
              <LineChartCard
                title="Tren Aktivitas Pelatihan Bulanan"
                subtitle="Perbandingan volume training online dan in-house outlet sepanjang waktu"
                labels={lineChartLabels}
                datasets={lineChartDatasets}
                height={270}
                icon={<TrendingUp className="w-4 h-4" />}
              />
            </div>

            {/* In-House Grade Distribution */}
            <div>
              <BarChartCard
                title="Distribusi Grade In-House"
                subtitle="Komposisi hasil evaluasi outlet (SB, B, C, K)"
                labels={gradeLabels}
                datasets={gradeDatasets}
                height={270}
                icon={<Award className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Performance Grids: Top Courses & Outlets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Course Performance Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#419CC3]" /> Performa Modul Kursus Online
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Tingkat kelulusan dan rata-rata skor per modul</p>
                </div>
              </div>

              <div className="p-4 flex-1">
                {overview?.coursePerformance && overview.coursePerformance.length > 0 ? (
                  <div className="space-y-3">
                    {overview.coursePerformance.slice(0, 5).map((course) => (
                      <div key={course.courseId} className="p-3 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-xs text-slate-800 truncate max-w-[280px]">
                            {course.title}
                          </span>
                          <span className="text-xs font-extrabold text-[#419CC3]">
                            {course.passRate}% Lulus
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-1.5">
                          <div
                            className="bg-[#419CC3] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, Math.max(0, course.passRate))}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>{course.totalAttempts} percobaan ({course.passedCount} lulus, {course.failedCount} remidi)</span>
                          <span className="font-semibold">Rata-rata Skor: {course.avgScore}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400 text-xs">Belum ada data modul kuis.</div>
                )}
              </div>
            </div>

            {/* Outlet Performance Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                    <Store className="w-4 h-4 text-emerald-600" /> Evaluasi Training Outlet
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Ringkasan kepatuhan dan pencapaian nilai praktik outlet</p>
                </div>
              </div>

              <div className="p-4 flex-1">
                {overview?.outletPerformance && overview.outletPerformance.length > 0 ? (
                  <div className="space-y-3">
                    {overview.outletPerformance.slice(0, 5).map((outlet) => (
                      <div key={outlet.outletId} className="p-3 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-bold text-xs text-slate-800 truncate max-w-[280px]">
                            {outlet.outletName}
                          </span>
                          <span className="text-xs font-extrabold text-emerald-600">
                            {outlet.avgPercentage}% Rata-rata Nilai
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-1.5">
                          <div
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(100, Math.max(0, outlet.avgPercentage))}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>{outlet.totalSessions} sesi ({outlet.passedCount} lulus)</span>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold">
                            <span className="text-emerald-700 bg-emerald-100 px-1.5 rounded">SB: {outlet.gradeSB}</span>
                            <span className="text-sky-700 bg-sky-100 px-1.5 rounded">B: {outlet.gradeB}</span>
                            <span className="text-amber-700 bg-amber-100 px-1.5 rounded">C: {outlet.gradeC}</span>
                            <span className="text-rose-700 bg-rose-100 px-1.5 rounded">K: {outlet.gradeK}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400 text-xs">Belum ada data sesi outlet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. ONLINE LMS DETAILS */}
      {activeTab === 'online' && (
        <div className="space-y-6 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full">
            <StatCard
              title="Total Kuis Dikerjakan"
              value={overview?.summary.online.totalAttempts || 0}
              subtitle="Pengerjaan modul e-learning"
              icon={<BookOpen className="w-6 h-6" />}
              className="gsap-report-card"
            />
            <StatCard
              title="Pass Rate Kuis Online"
              value={`${overview?.summary.online.passRate || 0}%`}
              subtitle={`${overview?.summary.online.passedAttempts || 0} Kuis Lulus`}
              icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />}
              className="gsap-report-card"
            />
            <StatCard
              title="Rata-rata Skor Kuis"
              value={`${overview?.summary.online.avgScore || 0} / 100`}
              subtitle="Rata-rata akumulasi nilai kuis"
              icon={<Award className="w-6 h-6 text-amber-500" />}
              className="gsap-report-card"
            />
          </div>

          {/* Course Performance Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800">Daftar Analisis Performa per Modul Kursus</h3>
              <p className="text-xs text-slate-500 mt-0.5">Detail tingkat kelulusan dan rata-rata skor per materi pembelajaran</p>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                    <th className="py-3.5 px-5">Judul Modul Kursus</th>
                    <th className="py-3.5 px-4 text-center">Total Percobaan</th>
                    <th className="py-3.5 px-4 text-center">Lulus</th>
                    <th className="py-3.5 px-4 text-center">Remidi / Gagal</th>
                    <th className="py-3.5 px-4 text-center">Tingkat Kelulusan</th>
                    <th className="py-3.5 px-4 text-center">Rata-rata Nilai</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {overview?.coursePerformance && overview.coursePerformance.length > 0 ? (
                    overview.coursePerformance.map((c) => (
                      <tr key={c.courseId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-5 font-bold text-slate-800">{c.title}</td>
                        <td className="py-3.5 px-4 text-center font-semibold text-slate-700">{c.totalAttempts}</td>
                        <td className="py-3.5 px-4 text-center text-emerald-600 font-bold">{c.passedCount}</td>
                        <td className="py-3.5 px-4 text-center text-rose-500 font-bold">{c.failedCount}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full font-extrabold ${
                              c.passRate >= 75
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {c.passRate}%
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-extrabold text-slate-800">{c.avgScore}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Tidak ada data kursus.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. IN-HOUSE OUTLET DETAILS */}
      {activeTab === 'inhouse' && (
        <div className="space-y-6 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full">
            <StatCard
              title="Total Sesi Lapangan"
              value={overview?.summary.inHouse.totalSessions || 0}
              subtitle="Sesi observasi & evaluasi outlet"
              icon={<Store className="w-6 h-6" />}
              className="gsap-report-card"
            />
            <StatCard
              title="Pass Rate Sesi Outlet"
              value={`${overview?.summary.inHouse.passRate || 0}%`}
              subtitle={`${overview?.summary.inHouse.passedSessions || 0} Sesi Lulus`}
              icon={<CheckCircle2 className="w-6 h-6 text-emerald-600" />}
              className="gsap-report-card"
            />
            <StatCard
              title="Rata-rata Skor Praktik"
              value={`${overview?.summary.inHouse.avgPercentage || 0}%`}
              subtitle="Pencapaian checklist operasional"
              icon={<Award className="w-6 h-6 text-sky-600" />}
              className="gsap-report-card"
            />
          </div>

          {/* Outlet Performance Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800">Evaluasi Pelatihan per Outlet Cabang</h3>
              <p className="text-xs text-slate-500 mt-0.5">Distribusi pencapaian grade dan rata-rata skor per lokasi outlet</p>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold">
                    <th className="py-3.5 px-5">Nama Outlet Cabang</th>
                    <th className="py-3.5 px-4 text-center">Total Sesi</th>
                    <th className="py-3.5 px-4 text-center">Sesi Lulus</th>
                    <th className="py-3.5 px-4 text-center">Rata-rata Nilai</th>
                    <th className="py-3.5 px-4 text-center">Distribusi Grade (SB / B / C / K)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {overview?.outletPerformance && overview.outletPerformance.length > 0 ? (
                    overview.outletPerformance.map((o) => (
                      <tr key={o.outletId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-5 font-bold text-slate-800">{o.outletName}</td>
                        <td className="py-3.5 px-4 text-center font-semibold text-slate-700">{o.totalSessions}</td>
                        <td className="py-3.5 px-4 text-center text-emerald-600 font-bold">{o.passedCount}</td>
                        <td className="py-3.5 px-4 text-center font-extrabold text-slate-800">{o.avgPercentage}%</td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold">
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">SB: {o.gradeSB}</span>
                            <span className="bg-sky-100 text-sky-800 px-2 py-0.5 rounded">B: {o.gradeB}</span>
                            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded">C: {o.gradeC}</span>
                            <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded">K: {o.gradeK}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        Tidak ada data outlet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. DETAILED DATA LEDGER */}
      {activeTab === 'ledger' && (
        <div className="space-y-4 w-full">
          {/* Sub-Filters for Ledger */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 w-full">
            <div className="flex flex-wrap items-center gap-2">
              {/* Type Filter */}
              <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => setRecordType('ALL')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${
                    recordType === 'ALL' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Semua Modalitas
                </button>
                <button
                  onClick={() => setRecordType('ONLINE')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${
                    recordType === 'ONLINE' ? 'bg-white text-[#419CC3] shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  E-Learning (Kuis)
                </button>
                <button
                  onClick={() => setRecordType('IN_HOUSE')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${
                    recordType === 'IN_HOUSE' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  In-House Outlet
                </button>
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="text-xs font-semibold bg-white border border-slate-300 rounded-lg py-1.5 px-3 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#419CC3]"
              >
                <option value="ALL">Semua Status</option>
                <option value="PASSED">✅ Hanya Lulus</option>
                <option value="FAILED">❌ Belum Lulus / Remidi</option>
              </select>
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <Input
                placeholder="Cari peserta, ID, judul, atau outlet..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs h-9 bg-slate-50 border-slate-200 focus:bg-white"
              />
            </div>
          </div>

          {/* Interactive DataTable */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden w-full">
            <DataTable
              data={recordsData?.records || []}
              columns={tableColumns}
              isLoading={isLoadingRecords}
              pageSize={15}
              emptyMessage="Tidak ada catatan data training yang sesuai filter."
            />
          </div>
        </div>
      )}

      {/* Record Detail Dialog */}
      <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent className="max-w-md p-6 bg-white rounded-2xl">
          <DialogHeader className="border-b border-slate-100 pb-3">
            <DialogTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Info className="w-5 h-5 text-[#419CC3]" /> Rincian Partisipasi Training
            </DialogTitle>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-4 pt-2 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Peserta:</span>
                  <span className="font-bold text-slate-800">{selectedRecord.traineeName}</span>
                </div>
                {selectedRecord.traineeId && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">ID HRIS:</span>
                    <span className="font-mono font-bold text-slate-700">{selectedRecord.traineeId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Tipe Pelatihan:</span>
                  <span className="font-semibold text-slate-800">{selectedRecord.typeLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Judul Training:</span>
                  <span className="font-bold text-slate-800 text-right max-w-[200px]">{selectedRecord.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tanggal Pelaksanaan:</span>
                  <span className="font-medium text-slate-700">
                    {new Date(selectedRecord.date).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                {selectedRecord.trainerName && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Instruktur / Penilai:</span>
                    <span className="font-medium text-slate-700">{selectedRecord.trainerName}</span>
                  </div>
                )}
                {selectedRecord.outletName && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lokasi / Outlet:</span>
                    <span className="font-medium text-slate-700">{selectedRecord.outletName}</span>
                  </div>
                )}
              </div>

              {/* Score & Evaluation Result */}
              <div className="border border-slate-200 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-600">Hasil Evaluasi:</span>
                  <span
                    className={`font-bold px-2.5 py-0.5 rounded-full ${
                      selectedRecord.isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {selectedRecord.isPassed ? 'LULUS' : 'REMIDI'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Skor / Persentase:</span>
                  <span className="text-sm font-extrabold text-slate-800">
                    {selectedRecord.score} / {selectedRecord.maxScore} ({selectedRecord.percentage}%)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Predikat / Grade:</span>
                  <span className="font-bold text-slate-800">{selectedRecord.grade}</span>
                </div>
                {selectedRecord.xpAwarded > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Poin Gamifikasi:</span>
                    <span className="font-extrabold text-amber-600">+{selectedRecord.xpAwarded} XP</span>
                  </div>
                )}
                {selectedRecord.notes && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-400 block mb-1">Catatan:</span>
                    <p className="text-slate-700 italic">{selectedRecord.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRecord(null)}
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
