import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  History,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Check,
  X,
  Circle,
  User,
  BookOpen,
  Award,
  Calendar,
  X as CloseIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable, ColumnDef } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getApiUrl } from '@/lib/api';

interface Attempt {
  id: string;
  score: number;
  xp_awarded: number;
  is_passed: boolean;
  created_at: string;
  User?: {
    full_name: string;
    hris_user_id: string;
  };
  Quiz?: {
    passing_score?: number;
    Material?: {
      Course?: {
        title: string;
      };
    };
  };
  answers_detail?: Array<{
    question_text: string;
    is_correct: boolean;
    user_selected_ids: string[];
    options: Array<{
      id: string;
      text: string;
      is_correct: boolean;
    }>;
  }>;
}

export const QuizHistoryView: React.FC = () => {
  const [selectedAttempt, setSelectedAttempt] = useState<Attempt | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const { data: attempts = [], isLoading, refetch, isFetching } = useQuery<Attempt[]>({
    queryKey: ['quiz-attempts'],
    queryFn: async () => {
      const res = await fetch(getApiUrl('/quizzes/attempts'));
      if (!res.ok) throw new Error('Failed to load quiz attempts');
      return res.json();
    },
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    return d.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const openDetails = (data: Attempt) => {
    setSelectedAttempt(data);
    setShowDetail(true);
  };

  const columns: ColumnDef<Attempt>[] = [
    {
      key: 'user',
      header: 'Karyawan',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-800">{row.User?.full_name || 'Unknown'}</span>
          <span className="text-xs text-slate-400 font-mono">ID: {row.User?.hris_user_id}</span>
        </div>
      ),
    },
    {
      key: 'course',
      header: 'Materi / Kursus',
      render: (row) => (
        <span className="font-semibold text-slate-700">
          {row.Quiz?.Material?.Course?.title || '-'}
        </span>
      ),
    },
    {
      key: 'score',
      header: 'Skor',
      sortable: true,
      render: (row) => (
        <span
          className={`font-extrabold ${
            row.is_passed ? 'text-emerald-600' : 'text-rose-500'
          }`}
        >
          {Number(row.score).toFixed(0)} / 100
        </span>
      ),
    },
    {
      key: 'xp_awarded',
      header: 'XP Didapat',
      sortable: true,
      render: (row) => <span className="font-bold text-[#419CC3]">+{row.xp_awarded} XP</span>,
    },
    {
      key: 'is_passed',
      header: 'Status',
      align: 'center',
      render: (row) => <StatusBadge status={row.is_passed ? 'passed' : 'failed'} />,
    },
    {
      key: 'created_at',
      header: 'Tanggal',
      sortable: true,
      render: (row) => (
        <span className="text-xs text-slate-500">{formatDate(row.created_at)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Evaluasi',
      align: 'center',
      className: 'w-20',
      render: (row) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => openDetails(row)}
          className="text-slate-400 hover:text-[#419CC3] hover:bg-[#419CC3]/10 rounded-full h-8 w-8"
        >
          <Search className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Reusable Page Header */}
      <PageHeader
        title="Riwayat Pengerjaan Kuis"
        subtitle="Lacak performa belajar, skor kelulusan, dan evaluasi jawaban tiap karyawan."
        icon={<History className="w-7 h-7 text-[#419CC3]" />}
        actions={
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="font-bold flex items-center gap-2 border-slate-200"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            Muat Ulang
          </Button>
        }
      />

      {/* Reusable Data Table */}
      <DataTable
        data={attempts}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Cari riwayat kuis karyawan..."
        emptyMessage="Belum ada riwayat pengerjaan kuis."
      />

      {/* Spacious & Proportional Evaluation Detail Modal */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="sm:max-w-3xl md:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0 rounded-2xl bg-white border border-slate-200 shadow-2xl">
          {/* Modal Header */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/70 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <DialogTitle className="text-xl font-bold text-slate-800">
                  Evaluasi Jawaban Kuis
                </DialogTitle>
                {selectedAttempt && (
                  <StatusBadge status={selectedAttempt.is_passed ? 'passed' : 'failed'} />
                )}
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-2">
                <span>{selectedAttempt?.Quiz?.Material?.Course?.title || 'Materi Kuis'}</span>
                <span>•</span>
                <span>{formatDate(selectedAttempt?.created_at)}</span>
              </p>
            </div>
          </div>

          {selectedAttempt && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* Summary Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* 1. Karyawan */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#419CC3]/10 text-[#419CC3] flex items-center justify-center font-bold text-sm shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Karyawan
                    </p>
                    <p className="font-bold text-slate-800 text-xs truncate">
                      {selectedAttempt.User?.full_name || 'Karyawan'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      ID: {selectedAttempt.User?.hris_user_id || '-'}
                    </p>
                  </div>
                </div>

                {/* 2. Modul */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Materi Kursus
                    </p>
                    <p className="font-bold text-slate-800 text-xs truncate">
                      {selectedAttempt.Quiz?.Material?.Course?.title || 'Umum'}
                    </p>
                  </div>
                </div>

                {/* 3. Skor Akhir */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
                      selectedAttempt.is_passed
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {Number(selectedAttempt.score).toFixed(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Skor Akhir
                    </p>
                    <p
                      className={`font-extrabold text-xs ${
                        selectedAttempt.is_passed ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {selectedAttempt.is_passed ? 'Lulus Passing Grade' : 'Di Bawah Standar'}
                    </p>
                  </div>
                </div>

                {/* 4. XP Awarded */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      XP Diperoleh
                    </p>
                    <p className="font-extrabold text-amber-600 text-xs">
                      +{selectedAttempt.xp_awarded} XP
                    </p>
                  </div>
                </div>
              </div>

              {/* Questions & Detailed Answers Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                    Detail Evaluasi Soal ({selectedAttempt.answers_detail?.length || 0} Butir Soal)
                  </h3>
                  <span className="text-xs text-slate-400">
                    Kunci jawaban & opsi yang dipilih karyawan
                  </span>
                </div>

                {selectedAttempt.answers_detail && selectedAttempt.answers_detail.length > 0 ? (
                  <div className="space-y-4">
                    {selectedAttempt.answers_detail.map((ans, idx) => (
                      <div
                        key={idx}
                        className={`p-5 rounded-2xl border transition-all ${
                          ans.is_correct
                            ? 'bg-emerald-50/30 border-emerald-200'
                            : 'bg-rose-50/30 border-rose-200'
                        }`}
                      >
                        {/* Question Header */}
                        <div className="flex items-start justify-between gap-3 mb-3.5">
                          <div className="flex items-start gap-2.5">
                            <span className="w-6 h-6 rounded-full bg-slate-800 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <h4 className="font-bold text-sm text-slate-800 leading-snug">
                              {ans.question_text}
                            </h4>
                          </div>

                          <Badge
                            variant="secondary"
                            className={`text-xs font-bold shrink-0 flex items-center gap-1.5 ${
                              ans.is_correct
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {ans.is_correct ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Benar
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5 text-rose-600" /> Salah
                              </>
                            )}
                          </Badge>
                        </div>

                        {/* Options List */}
                        <div className="space-y-2 pl-8.5">
                          {ans.options?.map((opt) => {
                            const isSelectedByUser = ans.user_selected_ids?.includes(opt.id);

                            return (
                              <div
                                key={opt.id}
                                className={`text-xs flex items-center justify-between p-3 rounded-xl border transition-all ${
                                  opt.is_correct
                                    ? 'bg-emerald-100/70 text-emerald-900 border-emerald-300 font-semibold shadow-xs'
                                    : isSelectedByUser
                                    ? 'bg-rose-100/70 text-rose-900 border-rose-300 font-semibold shadow-xs'
                                    : 'bg-white/80 border-slate-200 text-slate-600'
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  {opt.is_correct ? (
                                    <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                                  ) : isSelectedByUser ? (
                                    <X className="w-4 h-4 text-rose-700 shrink-0" />
                                  ) : (
                                    <Circle className="w-3 h-3 text-slate-300 shrink-0" />
                                  )}
                                  <span className="leading-relaxed">{opt.text}</span>
                                </div>

                                <div className="flex items-center gap-2 shrink-0 ml-3">
                                  {isSelectedByUser && (
                                    <span
                                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                                        ans.is_correct
                                          ? 'bg-emerald-200 text-emerald-900'
                                          : 'bg-rose-200 text-rose-900'
                                      }`}
                                    >
                                      Jawaban Karyawan
                                    </span>
                                  )}
                                  {opt.is_correct && !isSelectedByUser && (
                                    <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-md">
                                      Kunci Jawaban
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-400">
                      Detail butir jawaban tidak direkam untuk percobaan kuis ini.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
            <Button
              variant="outline"
              onClick={() => setShowDetail(false)}
              className="font-bold text-xs px-5 border-slate-200"
            >
              Tutup
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
