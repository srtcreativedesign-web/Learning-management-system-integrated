import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Award, Pencil, AlertCircle, Loader2, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/common/PageHeader';
import { DataTable, ColumnDef } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { getApiUrl } from '@/lib/api';

interface LeaderboardUser {
  hris_user_id: string;
  full_name: string;
  current_rank: string;
  total_xp: number;
  quizzes_completed: number;
}

export const LeaderboardView: React.FC = () => {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [editData, setEditData] = useState({
    hris_user_id: '',
    full_name: '',
    new_xp: 0,
    reason: '',
  });
  const [savingXp, setSavingXp] = useState(false);

  const { data: users = [], isLoading, refetch } = useQuery<LeaderboardUser[]>({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      const res = await fetch(getApiUrl('/api/gamification/leaderboard'));
      if (!res.ok) throw new Error('Failed to load leaderboard');
      return res.json();
    },
  });

  const openEditModal = (user: LeaderboardUser) => {
    setEditData({
      hris_user_id: user.hris_user_id,
      full_name: user.full_name,
      new_xp: user.total_xp,
      reason: '',
    });
    setShowDialog(true);
  };

  const handleSaveXp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData.reason) {
      return alert('Alasan perubahan XP wajib diisi untuk Audit Trail.');
    }

    setSavingXp(true);
    try {
      const res = await fetch(getApiUrl('/api/gamification/adjust-xp'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hris_user_id: editData.hris_user_id,
          new_xp: Number(editData.new_xp),
          reason: editData.reason,
        }),
      });

      if (res.ok) {
        alert('XP berhasil disesuaikan!');
        setShowDialog(false);
        refetch();
      } else {
        alert('Gagal merubah XP');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyesuaikan XP.');
    } finally {
      setSavingXp(false);
    }
  };

  const columns: ColumnDef<LeaderboardUser>[] = [
    {
      key: 'rank',
      header: 'Peringkat',
      align: 'center',
      className: 'w-20',
      render: (_, index) => (
        <span className="font-bold text-slate-500 text-xs">#{index + 1}</span>
      ),
    },
    {
      key: 'hris_user_id',
      header: 'ID Karyawan',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs text-slate-500 font-semibold">{row.hris_user_id}</span>
      ),
    },
    {
      key: 'full_name',
      header: 'Nama Karyawan',
      sortable: true,
      render: (row) => <span className="font-bold text-slate-800">{row.full_name}</span>,
    },
    {
      key: 'current_rank',
      header: 'Pangkat (Rank)',
      sortable: true,
      render: (row) => <StatusBadge status={row.current_rank} />,
    },
    {
      key: 'total_xp',
      header: 'Total XP',
      sortable: true,
      render: (row) => (
        <span className="font-extrabold text-[#419CC3]">{row.total_xp} XP</span>
      ),
    },
    {
      key: 'quizzes_completed',
      header: 'Kuis Selesai',
      sortable: true,
      render: (row) => <span className="font-semibold text-slate-600">{row.quizzes_completed}</span>,
    },
    {
      key: 'actions',
      header: 'Aksi',
      align: 'center',
      className: 'w-20',
      render: (row) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => openEditModal(row)}
          className="text-slate-400 hover:text-[#419CC3] hover:bg-[#419CC3]/10 rounded-full h-8 w-8"
        >
          <Pencil className="w-4 h-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Reusable Page Header */}
      <PageHeader
        title="Papan Peringkat (Leaderboard)"
        subtitle="Pantau total XP dan Rank Gamifikasi seluruh karyawan."
        icon={<Award className="w-7 h-7 text-amber-500" />}
        actions={
          <Button
            onClick={() => navigate('/analytics/rank-rewards')}
            className="bg-[#419CC3] hover:bg-[#3484a6] text-white font-bold text-xs flex items-center gap-2 shadow-sm"
          >
            <Gift className="w-4 h-4" /> Kelola Hadiah Level
          </Button>
        }
      />

      {/* Reusable Data Table */}
      <DataTable
        data={users}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Cari ID atau Nama Karyawan..."
        emptyMessage="Belum ada data peringkat karyawan."
      />

      {/* Edit XP Modal */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800">
              Penyesuaian XP Manual
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveXp} className="space-y-4 pt-2">
            <div className="bg-blue-50 text-blue-800 p-3 rounded-xl text-xs font-medium flex items-start gap-2 border border-blue-100">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-[#419CC3]" />
              <span>
                Pengubahan XP manual akan mencatat Log Audit Trail. Pastikan Anda memiliki alasan yang
                jelas.
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Karyawan</label>
              <Input value={editData.full_name} disabled className="bg-slate-100 font-bold" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Total XP Baru</label>
              <Input
                type="number"
                value={editData.new_xp}
                onChange={(e) => setEditData({ ...editData, new_xp: Number(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">
                Alasan Perubahan (Audit Trail) <span className="text-rose-500">*</span>
              </label>
              <Textarea
                value={editData.reason}
                onChange={(e) => setEditData({ ...editData, reason: e.target.value })}
                rows={3}
                placeholder="Contoh: Penyesuaian poin kuis..."
                required
              />
            </div>

            <DialogFooter className="gap-2 pt-3 border-t border-slate-100">
              <Button type="button" variant="ghost" onClick={() => setShowDialog(false)}>
                Batal
              </Button>
              <Button
                type="submit"
                disabled={savingXp}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
              >
                {savingXp ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan Perubahan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
