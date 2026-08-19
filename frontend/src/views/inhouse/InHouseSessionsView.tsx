import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Plus,
  Search,
  Store,
  Calendar,
  CheckCircle2,
  XCircle,
  Award,
  Filter,
  Eye,
  Trash2,
  Loader2,
  FileSpreadsheet,
  Building2,
  User,
  Calculator,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { getApiUrl } from '@/lib/api';

interface AssessmentItem {
  id?: string;
  checklist_point_id: string;
  score: number;
  grade: string;
  notes?: string;
  checklistPoint?: {
    question: string;
    description?: string;
    category?: {
      name: string;
    };
  };
}

interface InHouseSession {
  id: string;
  trainer_name: string;
  outlet_id?: string;
  trainee_name: string;
  training_date: string;
  status: string;
  total_score: number;
  max_score: number;
  percentage: number;
  grade: 'SB' | 'B' | 'C' | 'K';
  is_passed: boolean;
  notes?: string;
  assessments?: AssessmentItem[];
}

interface Outlet {
  id: string;
  name: string;
}

export const InHouseSessionsView: React.FC = () => {
  const [sessions, setSessions] = useState<InHouseSession[]>([]);
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOutlet, setSelectedOutlet] = useState<string>('all');
  const [selectedSession, setSelectedSession] = useState<InHouseSession | null>(null);

  // New Assessment Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formTrainerName, setFormTrainerName] = useState('Trainer TnD');
  const [formOutletId, setFormOutletId] = useState('');
  const [formTraineeName, setFormTraineeName] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formScores, setFormScores] = useState<Record<string, number>>({});
  const [formItemNotes, setFormItemNotes] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl('/in-house/sessions'));
      const data = await res.json();
      if (data.success) {
        setSessions(data.data || []);
      }
    } catch (err) {
      console.error('Failed to load in-house sessions', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOutlets = async () => {
    try {
      const res = await fetch(getApiUrl('/audit/outlets'));
      const data = await res.json();
      setOutlets(data || []);
    } catch (err) {
      console.error('Failed to load outlets', err);
    }
  };

  const openNewAssessmentModal = async () => {
    try {
      const res = await fetch(getApiUrl('/in-house/checklists'));
      const data = await res.json();
      if (data.success && data.data) {
        setCategories(data.data);
        // Default all scores to 4 (Baik)
        const initialScores: Record<string, number> = {};
        data.data.forEach((cat: any) => {
          cat.checklists?.forEach((point: any) => {
            initialScores[point.id] = 4;
          });
        });
        setFormScores(initialScores);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error('Failed to prepare checklist modal', err);
      alert('Gagal memuat template checklist');
    }
  };

  useEffect(() => {
    fetchSessions();
    fetchOutlets();
  }, []);

  const handleScoreChange = (pointId: string, score: number) => {
    setFormScores((prev) => ({
      ...prev,
      [pointId]: score,
    }));
  };

  // Calculate live summary in modal
  const calculateLiveSummary = () => {
    let currentTotal = 0;
    let currentMax = 0;

    categories.forEach((cat) => {
      cat.checklists?.forEach((point: any) => {
        const score = formScores[point.id] || 4;
        const max = point.max_score || 5;
        currentTotal += score;
        currentMax += max;
      });
    });

    const percentage = currentMax > 0 ? parseFloat(((currentTotal / currentMax) * 100).toFixed(1)) : 0;
    let grade = 'K';
    if (percentage >= 85) grade = 'SB';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 55) grade = 'C';

    const isPassed = percentage >= 70;

    return { currentTotal, currentMax, percentage, grade, isPassed };
  };

  const liveSummary = isModalOpen ? calculateLiveSummary() : null;

  const handleSubmitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTraineeName.trim()) {
      alert('Mohon isi nama karyawan / tim peserta training.');
      return;
    }

    setIsSubmitting(true);
    try {
      const assessments = Object.keys(formScores).map((pointId) => ({
        checklist_point_id: pointId,
        score: formScores[pointId],
        notes: formItemNotes[pointId] || '',
      }));

      const res = await fetch(getApiUrl('/in-house/sessions'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainer_name: formTrainerName,
          outlet_id: formOutletId || null,
          trainee_name: formTraineeName,
          notes: formNotes,
          assessments,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Penilaian sesi in-house training berhasil disimpan!');
        setIsModalOpen(false);
        fetchSessions();
      } else {
        alert(data.message || 'Gagal menyimpan evaluasi training.');
      }
    } catch (err) {
      console.error('Failed to submit evaluation', err);
      alert('Terjadi kesalahan saat menyimpan data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSession = async (id: string) => {
    if (!window.confirm('Yakin ingin menghapus riwayat sesi training ini?')) return;
    try {
      const res = await fetch(getApiUrl(`/in-house/sessions/${id}`), {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        fetchSessions();
      }
    } catch (err) {
      console.error('Failed to delete session', err);
    }
  };

  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.trainee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.trainer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesOutlet = selectedOutlet === 'all' || s.outlet_id === selectedOutlet;
    return matchesSearch && matchesOutlet;
  });

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'SB':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Award className="w-3 h-3 text-emerald-600" /> SB (Sangat Baik)
          </span>
        );
      case 'B':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-sky-100 text-sky-800 border border-sky-300">
            <CheckCircle2 className="w-3 h-3 text-sky-600" /> B (Baik)
          </span>
        );
      case 'C':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
            C (Cukup)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3 h-3 text-rose-600" /> K (Kurang)
          </span>
        );
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <PageHeader
        title="Evaluasi & Sesi In-House Training"
        subtitle="Rekapitulasi hasil penilaian on-site training staf outlet dengan predikat SB, B, C, K & kalkulasi otomatis"
        icon={<GraduationCap className="w-7 h-7" />}
        actions={
          <Button
            onClick={openNewAssessmentModal}
            className="gap-2 bg-[#419CC3] hover:bg-[#3582a3] text-white shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Input Penilaian Training Baru
          </Button>
        }
      />

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama peserta / trainer..."
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Store className="w-4 h-4 text-slate-400" />
          <select
            value={selectedOutlet}
            onChange={(e) => setSelectedOutlet(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#419CC3]"
          >
            <option value="all">Semua Outlet</option>
            {outlets.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sessions Table */}
      {isLoading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#419CC3] mb-3" />
          <p className="text-sm font-medium text-slate-500">Memuat riwayat sesi training...</p>
        </div>
      ) : filteredSessions.length === 0 ? (
        <EmptyState
          icon={<FileSpreadsheet className="w-8 h-8 text-slate-400" />}
          title="Belum Ada Rekap Penilaian Training"
          description="Trainer dapat melakukan penilaian checklist on-site di outlet sekarang."
          actionLabel="Mulai Input Penilaian"
          actionIcon={<Plus className="w-4 h-4" />}
          onAction={openNewAssessmentModal}
        />
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Tanggal & Outlet</th>
                  <th className="py-3.5 px-4">Peserta Training</th>
                  <th className="py-3.5 px-4">Trainer</th>
                  <th className="py-3.5 px-4 text-center">Skor Kumulatif</th>
                  <th className="py-3.5 px-4 text-center">Persentase (%)</th>
                  <th className="py-3.5 px-4 text-center">Predikat</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {filteredSessions.map((session) => {
                  const outlet = outlets.find((o) => o.id === session.outlet_id);
                  const formattedDate = new Date(session.training_date).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <tr key={session.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5 text-[#419CC3]" />
                          {outlet?.name || 'Outlet Umum'}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{formattedDate}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{session.trainee_name}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-600">{session.trainer_name}</div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="font-bold text-slate-800">
                          {session.total_score} / {session.max_score}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="font-extrabold text-[#419CC3] text-sm">
                          {session.percentage}%
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">{getGradeBadge(session.grade)}</td>

                      <td className="py-3.5 px-4 text-center">
                        {session.is_passed ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Lulus
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            Retraining
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedSession(session)}
                            className="h-8 px-2.5 text-xs text-[#419CC3] hover:bg-[#419CC3]/10"
                          >
                            <Eye className="w-3.5 h-3.5 mr-1" />
                            Detail
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSession(session.id)}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Input Sesi Penilaian Baru */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#419CC3]/15 text-[#419CC3] flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Form Penilaian In-House Training (On-Site)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Input penilaian checklist SB, B, C, K untuk peserta training di outlet
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitEvaluation} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Top Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                    Outlet Cabang
                  </label>
                  <select
                    value={formOutletId}
                    onChange={(e) => setFormOutletId(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 font-medium"
                    required
                  >
                    <option value="">-- Pilih Outlet --</option>
                    {outlets.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                    Nama Karyawan / Peserta
                  </label>
                  <Input
                    value={formTraineeName}
                    onChange={(e) => setFormTraineeName(e.target.value)}
                    placeholder="Nama Karyawan atau Tim Barista"
                    className="text-xs font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                    Nama Trainer
                  </label>
                  <Input
                    value={formTrainerName}
                    onChange={(e) => setFormTrainerName(e.target.value)}
                    placeholder="Nama Trainer TnD"
                    className="text-xs font-semibold"
                    required
                  />
                </div>
              </div>

              {/* Live Calculator Card */}
              {liveSummary && (
                <div className="bg-[#419CC3]/5 border border-[#419CC3]/20 text-slate-800 p-4 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#419CC3]/15 flex items-center justify-center">
                      <Calculator className="w-5 h-5 text-[#419CC3]" />
                    </div>
                    <div>
                      <span className="text-[10px] text-[#3484a6] font-bold uppercase tracking-wider block">
                        Kalkulasi Nilai Berjalan
                      </span>
                      <span className="text-xs text-slate-600 font-medium">
                        Skor: <strong className="text-slate-900 font-bold">{liveSummary.currentTotal}</strong> /{' '}
                        {liveSummary.currentMax} Poin
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 block font-medium">Persentase</span>
                      <span className="text-lg font-black text-[#419CC3]">
                        {liveSummary.percentage}%
                      </span>
                    </div>

                    <div className="border-l border-slate-200 pl-4 text-right">
                      <span className="text-[11px] text-slate-500 block font-medium">Predikat</span>
                      <span
                        className={`text-lg font-black ${
                          liveSummary.grade === 'SB'
                            ? 'text-emerald-600'
                            : liveSummary.grade === 'B'
                            ? 'text-[#419CC3]'
                            : liveSummary.grade === 'C'
                            ? 'text-amber-600'
                            : 'text-rose-600'
                        }`}
                      >
                        {liveSummary.grade}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Checklist Items Accordion */}
              <div className="space-y-5">
                {categories.map((cat, catIdx) => (
                  <div key={cat.id || catIdx} className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-100/80 px-4 py-2.5 font-bold text-xs text-slate-800 border-b border-slate-200 flex items-center justify-between">
                      <span>
                        {catIdx + 1}. {cat.name}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {cat.checklists?.length || 0} butir
                      </span>
                    </div>

                    <div className="p-3.5 space-y-3 bg-white">
                      {cat.checklists?.map((point: any, pIdx: number) => {
                        const currentScore = formScores[point.id] || 4;

                        return (
                          <div
                            key={point.id || pIdx}
                            className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-3"
                          >
                            <div className="flex-1">
                              <h5 className="font-semibold text-xs text-slate-800">
                                {pIdx + 1}. {point.question}
                              </h5>
                              {point.description && (
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  {point.description}
                                </p>
                              )}
                            </div>

                            {/* Scoring Buttons (SB, B, C, K) */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              {[
                                { label: 'SB (5)', score: 5, color: 'hover:border-emerald-500 active:bg-emerald-50' },
                                { label: 'B (4)', score: 4, color: 'hover:border-sky-500 active:bg-sky-50' },
                                { label: 'C (3)', score: 3, color: 'hover:border-amber-500 active:bg-amber-50' },
                                { label: 'K (1)', score: 1, color: 'hover:border-rose-500 active:bg-rose-50' },
                              ].map((btn) => {
                                const isSelected = currentScore === btn.score;
                                return (
                                  <button
                                    key={btn.score}
                                    type="button"
                                    onClick={() => handleScoreChange(point.id, btn.score)}
                                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                                      isSelected
                                        ? btn.score === 5
                                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                          : btn.score === 4
                                          ? 'bg-[#419CC3] text-white border-[#419CC3] shadow-sm'
                                          : btn.score === 3
                                          ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                                          : 'bg-rose-600 text-white border-rose-600 shadow-sm'
                                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                                    }`}
                                  >
                                    {btn.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Trainer Notes */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                  Catatan Evaluasi / Rekomendasi Trainer
                </label>
                <textarea
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Catatan tambahan mengenai performa peserta, kelebihan, atau aspek yang butuh perbaikan..."
                  className="w-full text-xs border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#419CC3]"
                  rows={3}
                />
              </div>

              {/* Submit Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#419CC3] hover:bg-[#3582a3] text-white text-xs gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Simpan & Selesaikan Penilaian
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Detail Sesi Penilaian */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#419CC3]/15 text-[#419CC3] flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Detail Laporan In-House Training</h3>
                  <p className="text-xs text-slate-500">
                    Peserta: <strong className="text-slate-800">{selectedSession.trainee_name}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              {/* Score Highlight Card */}
              <div className="p-4 bg-[#419CC3]/5 border border-[#419CC3]/20 rounded-xl flex items-center justify-between text-slate-800">
                <div>
                  <span className="text-[10px] text-[#3484a6] font-bold uppercase tracking-wider block">
                    Hasil Akhir
                  </span>
                  <span className="text-xs text-slate-600 font-medium">
                    Skor: <strong className="text-slate-900 font-bold">{selectedSession.total_score}</strong> / {selectedSession.max_score} Poin
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 block font-medium">Persentase</span>
                    <span className="text-xl font-black text-[#419CC3]">
                      {selectedSession.percentage}%
                    </span>
                  </div>
                  <div className="border-l border-slate-200 pl-4 text-right">
                    <span className="text-[11px] text-slate-500 block font-medium">Predikat</span>
                    <span
                      className={`text-xl font-black ${
                        selectedSession.grade === 'SB'
                          ? 'text-emerald-600'
                          : selectedSession.grade === 'B'
                          ? 'text-[#419CC3]'
                          : selectedSession.grade === 'C'
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {selectedSession.grade}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assessment Breakdown */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                  Rincian Penilaian Checklist
                </h4>

                <div className="space-y-2">
                  {selectedSession.assessments?.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-800">
                          {item.checklistPoint?.question || `Kriteria #${idx + 1}`}
                        </div>
                        {item.checklistPoint?.category?.name && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {item.checklistPoint.category.name}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 font-bold">
                        <span className="text-slate-500">Nilai: {item.score}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${
                            item.grade === 'SB'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.grade === 'B'
                              ? 'bg-sky-100 text-sky-800'
                              : item.grade === 'C'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {item.grade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedSession.notes && (
                <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                    Catatan Trainer
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">{selectedSession.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
