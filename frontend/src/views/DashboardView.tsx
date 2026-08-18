import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import {
  GraduationCap,
  Users,
  Clock,
  Star,
  Settings,
  BarChart3,
  Award,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  FileText,
  HelpCircle,
  Upload,
  PlusCircle,
  LayoutDashboard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/PageHeader';
import { BarChartCard } from '@/components/charts/BarChartCard';
import { LineChartCard } from '@/components/charts/LineChartCard';
import { cn } from '@/lib/utils';

export const DashboardView: React.FC = () => {
  const navigate = useNavigate();

  // Crew Rank Leaderboard
  const crewRank = [
    { id: 1, name: 'Budi Santoso', points: 1250, badge: 'Gold' },
    { id: 2, name: 'Siti Aminah', points: 1100, badge: 'Silver' },
    { id: 3, name: 'Andi Wijaya', points: 950, badge: 'Bronze' },
    { id: 4, name: 'Rina Kusuma', points: 800, badge: 'Participant' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-card',
        { y: 15, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out',
          clearProps: 'all',
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <PageHeader
        title="Dasbor Instruktur"
        subtitle="Pantau perkembangan peserta dan efektivitas kelas Anda bulan ini."
        icon={<LayoutDashboard className="w-7 h-7" />}
      />

      {/* Top Row: Active Course & Crew Rank */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Spanning 2 columns */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Active Course Card */}
          <div className="gsap-card bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Kelas Sedang Berjalan (Batch Aktif)
            </h3>

            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="w-20 h-20 bg-[#419CC3]/10 rounded-2xl flex-shrink-0 flex items-center justify-center text-[#419CC3]">
                <GraduationCap className="w-10 h-10" />
              </div>

              <div className="flex-1 w-full">
                <h4 className="text-lg font-bold text-slate-800 mb-2">
                  Orientasi Karyawan Baru - Batch Juli
                </h4>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-50 text-[#419CC3] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    Online Course
                  </span>
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" /> 45 Peserta Terdaftar
                  </span>
                  <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Sisa 3 Hari
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                  <span className="text-slate-600">Progress Kelulusan Peserta</span>
                  <span className="text-[#419CC3] font-bold">60% (27/45 Lulus)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#419CC3] rounded-full transition-all duration-500"
                    style={{ width: '60%' }}
                  />
                </div>
              </div>

              <div className="w-full md:w-auto mt-4 md:mt-0 flex flex-col gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center">
                  Tindakan
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="font-bold flex items-center justify-center gap-1.5"
                >
                  <Star className="w-4 h-4 text-amber-500" /> Beri Nilai
                </Button>
                <Button
                  size="sm"
                  className="bg-[#419CC3] hover:bg-[#3484a6] text-white font-bold flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Settings className="w-4 h-4" /> Kelola Kelas
                </Button>
              </div>
            </div>
          </div>

          {/* Module Performance (Reusable Horizontal Bar Chart) */}
          <div className="gsap-card">
            <BarChartCard
              title="Performa per Modul (Kelas Aktif)"
              icon={<BarChart3 className="w-4 h-4" />}
              labels={['M1: Pengenalan', 'M2: Visi & Misi', 'M3: SOP Kerja', 'M4: K3 Dasar']}
              datasets={[
                {
                  label: 'Rata-rata Nilai',
                  data: [92, 88, 76, 85],
                  backgroundColor: '#419CC3',
                  barPercentage: 0.6,
                },
              ]}
              horizontal
              showLegend={false}
              height={160}
              maxY={100}
            />
          </div>
        </div>

        {/* Crew Rank Leaderboard Widget */}
        <div className="gsap-card bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" /> Papan Peringkat Peserta
          </h3>

          <div className="space-y-2.5">
            {crewRank.map((crew, index) => (
              <div
                key={crew.id}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs',
                      index === 0
                        ? 'bg-[#419CC3] text-white'
                        : 'bg-slate-100 text-slate-600'
                    )}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-slate-800">{crew.name}</p>
                    <p className="text-[11px] text-slate-400">{crew.badge}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                  {crew.points} XP
                </span>
              </div>
            ))}
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100">
            <button
              onClick={() => navigate('/analytics/leaderboard')}
              className="w-full text-center text-xs font-bold text-[#419CC3] hover:underline cursor-pointer"
            >
              Lihat Semua Peringkat →
            </button>
          </div>
        </div>
      </div>

      {/* Middle Row: Analytics Charts (Reusable Components) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="gsap-card">
          <BarChartCard
            title="Rata-rata Nilai Ujian (Pre vs Post)"
            icon={<BarChart3 className="w-4 h-4" />}
            labels={['Komunikasi', 'K3 Dasar', 'SOP Gudang', 'Manajemen Waktu', 'Leadership']}
            datasets={[
              {
                label: 'Pre-test',
                backgroundColor: '#89B4E1',
                data: [60, 55, 70, 50, 65],
              },
              {
                label: 'Post-test',
                backgroundColor: '#419CC3',
                data: [85, 90, 95, 80, 88],
              },
            ]}
            maxY={100}
            height={260}
          />
        </div>

        <div className="gsap-card">
          <LineChartCard
            title="Laju Kelulusan Peserta"
            icon={<TrendingUp className="w-4 h-4" />}
            labels={['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun']}
            datasets={[
              {
                label: 'Peserta Lulus',
                data: [120, 150, 180, 140, 210, 250],
                borderColor: '#419CC3',
                backgroundColor: '#419CC3',
              },
            ]}
            height={260}
          />
        </div>
      </div>

      {/* Third Row: Audit Analytics Charts (Reusable Components) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="gsap-card">
          <BarChartCard
            title="Top 5 Outlet - Kepatuhan Tertinggi"
            icon={<ShieldCheck className="w-4 h-4 text-emerald-500" />}
            labels={['Sudirman', 'Kemang', 'Kelapa Gading', 'Bintaro', 'PIK']}
            datasets={[
              {
                label: 'Tingkat Kepatuhan (%)',
                backgroundColor: '#86EFAC',
                data: [98, 95, 94, 91, 89],
              },
            ]}
            showLegend={false}
            maxY={100}
            height={260}
          />
        </div>

        <div className="gsap-card">
          <BarChartCard
            title="Top 5 Outlet - Temuan Terbanyak"
            icon={<AlertCircle className="w-4 h-4 text-rose-500" />}
            labels={['Depok', 'Bekasi', 'Tangerang', 'Bogor', 'Cibubur']}
            datasets={[
              {
                label: 'Jumlah Temuan (NOK)',
                backgroundColor: '#FCA5A5',
                data: [24, 19, 15, 12, 10],
              },
            ]}
            showLegend={false}
            height={260}
          />
        </div>
      </div>

      {/* Bottom Row: Pustaka Materi Shortcut */}
      <div className="gsap-card bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Materi Terbaru yang Diunggah
          </h3>
          <button
            onClick={() => navigate('/library')}
            className="text-xs font-bold text-[#419CC3] hover:underline cursor-pointer"
          >
            Lihat Semua
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => navigate('/library')}
            className="p-4 rounded-xl border border-slate-200 hover:border-[#419CC3] hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-800 mb-1">SOP K3 Dasar</h4>
            <p className="text-xs text-slate-500 mb-3">Diperbarui: 1 Hari Lalu</p>
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> 45 Diakses
              </span>
            </div>
          </div>

          <div
            onClick={() => navigate('/library')}
            className="p-4 rounded-xl border border-slate-200 hover:border-[#419CC3] hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 bg-blue-50 text-[#419CC3] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-800 mb-1">Kuis Gudang</h4>
            <p className="text-xs text-slate-500 mb-3">Diperbarui: 3 Jam Lalu</p>
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> 12 Dikerjakan
              </span>
            </div>
          </div>

          <div
            onClick={() => navigate('/library')}
            className="p-4 rounded-xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center hover:bg-[#419CC3]/5 hover:border-[#419CC3] transition-all cursor-pointer min-h-[160px]"
          >
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2 text-slate-400">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-[#419CC3]">Unggah Materi</p>
          </div>

          <div
            onClick={() => navigate('/quiz-builder')}
            className="p-4 rounded-xl border border-dashed border-[#419CC3] flex flex-col items-center justify-center text-center bg-[#419CC3]/5 hover:bg-[#419CC3]/10 transition-all cursor-pointer min-h-[160px]"
          >
            <div className="w-10 h-10 rounded-full bg-[#419CC3] text-white flex items-center justify-center mb-2 shadow-sm">
              <PlusCircle className="w-5 h-5" />
            </div>
            <p className="text-sm font-bold text-[#419CC3]">Buat Kuis Baru</p>
          </div>
        </div>
      </div>
    </div>
  );
};
