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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
          <span className="text-xs text-slate-400 font-mono">{row.User?.hris_user_id}</span>
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
        subtitle="Lacak performa belajar, skor, dan evaluasi jawaban tiap karyawan."
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

      {/* Evaluation Detail Modal */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800">
              Evaluasi Jawaban Kuis
            </DialogTitle>
          </DialogHeader>

          {selectedAttempt && (
            <div className="space-y-5 pt-2">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Karyawan</p>
                  <p className="font-bold text-slate-800 text-sm">
                    {selectedAttempt.User?.full_name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Skor Akhir</p>
                  <p
                    className={`font-extrabold text-2xl ${
                      selectedAttempt.is_passed ? 'text-emerald-600' : 'text-rose-500'
                    }`}
                  >
                    {Number(selectedAttempt.score).toFixed(0)}
                  </p>
                </div>
              </div>

              {selectedAttempt.answers_detail && selectedAttempt.answers_detail.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                    Detail Soal & Jawaban
                  </h3>

                  {selectedAttempt.answers_detail.map((ans, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border border-l-4 ${
                        ans.is_correct
                          ? 'border-l-emerald-500 bg-emerald-50/20 border-slate-200'
                          : 'border-l-rose-500 bg-rose-50/20 border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 shrink-0">
                          {ans.is_correct ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-rose-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-800 text-sm mb-3">
                            {idx + 1}. {ans.question_text}
                          </p>

                          <div className="space-y-1.5">
                            {ans.options?.map((opt) => {
                              const isSelectedByUser = ans.user_selected_ids?.includes(opt.id);

                              return (
                                <div
                                  key={opt.id}
                                  className={`text-xs flex items-center gap-2 p-2.5 rounded-lg border transition-all ${
                                    opt.is_correct
                                      ? 'bg-emerald-100/60 text-emerald-900 border-emerald-200 font-semibold'
                                      : isSelectedByUser
                                      ? 'bg-rose-100/60 text-rose-900 border-rose-200 font-semibold'
                                      : 'bg-white border-slate-100 text-slate-600'
                                  }`}
                                >
                                  {opt.is_correct ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                  ) : isSelectedByUser ? (
                                    <X className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                  ) : (
                                    <Circle className="w-2.5 h-2.5 text-slate-300 shrink-0" />
                                  )}

                                  <span className="flex-1">{opt.text}</span>

                                  {isSelectedByUser && (
                                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">
                                      Jawaban Karyawan
                                    </span>
                                  )}
                                  {opt.is_correct && !isSelectedByUser && (
                                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">
                                      Kunci Jawaban
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-xs text-slate-400 py-8">
                  Detail jawaban tidak direkam untuk kuis ini.
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
