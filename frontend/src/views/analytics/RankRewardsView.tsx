import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Gift,
  Award,
  Pencil,
  CheckCircle2,
  Lock,
  Sparkles,
  Smartphone,
  Save,
  Loader2,
  RefreshCw,
  Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/common/PageHeader';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { getApiUrl } from '@/lib/api';

interface RankReward {
  id: string;
  rank_name: string;
  min_xp: number;
  reward_title: string;
  reward_description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const RankRewardsView: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedReward, setSelectedReward] = useState<RankReward | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit Form State
  const [formData, setFormData] = useState({
    reward_title: '',
    reward_description: '',
    min_xp: 0,
    is_active: true,
  });

  // Fetch all rank rewards
  const { data: rewards = [], isLoading, refetch, isFetching } = useQuery<RankReward[]>({
    queryKey: ['admin-rank-rewards'],
    queryFn: async () => {
      const res = await fetch(getApiUrl('/api/gamification/admin/rank-rewards'));
      if (!res.ok) throw new Error('Failed to load rank rewards');
      return res.json();
    },
  });

  const openEdit = (reward: RankReward) => {
    setSelectedReward(reward);
    setFormData({
      reward_title: reward.reward_title || '',
      reward_description: reward.reward_description || '',
      min_xp: reward.min_xp || 0,
      is_active: reward.is_active ?? true,
    });
    setShowEditModal(true);
  };

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: typeof formData }) => {
      const res = await fetch(getApiUrl(`/api/gamification/admin/rank-rewards/${id}`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Gagal menyimpan hadiah');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rank-rewards'] });
      queryClient.invalidateQueries({ queryKey: ['rank-rewards'] });
      setShowEditModal(false);
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReward) return;
    if (!formData.reward_title.trim()) {
      return alert('Judul hadiah wajib diisi.');
    }
    updateMutation.mutate({ id: selectedReward.id, payload: formData });
  };

  const getRankTheme = (rankName: string) => {
    switch (rankName) {
      case 'Pemula':
        return {
          badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
          iconBg: 'bg-slate-100 text-slate-600',
          border: 'border-slate-200',
          accent: '#64748b',
        };
      case 'Pembelajar Aktif':
        return {
          badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
          iconBg: 'bg-blue-50 text-blue-600',
          border: 'border-blue-200',
          accent: '#3b82f6',
        };
      case 'Karyawan Terampil':
        return {
          badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          iconBg: 'bg-emerald-50 text-emerald-600',
          border: 'border-emerald-200',
          accent: '#10b981',
        };
      case 'Master Pengetahuan':
        return {
          badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
          iconBg: 'bg-purple-50 text-purple-600',
          border: 'border-purple-200',
          accent: '#a855f7',
        };
      case 'Pakar SobatHR':
        return {
          badgeBg: 'bg-amber-50 text-amber-800 border-amber-300',
          iconBg: 'bg-amber-100 text-amber-600',
          border: 'border-amber-300',
          accent: '#f59e0b',
        };
      default:
        return {
          badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
          iconBg: 'bg-slate-100 text-slate-600',
          border: 'border-slate-200',
          accent: '#419CC3',
        };
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <PageHeader
        title="Manajemen Hadiah Level (Rank Rewards)"
        subtitle="Atur reward, voucher, dan insentif yang dapat dibuka oleh karyawan pada setiap level pencapaian XP di aplikasi mobile SobatHR."
        icon={<Gift className="w-7 h-7 text-[#419CC3]" />}
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

      {/* Grid Layout: Main Rewards + Mobile App Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of 5 Rank Rewards */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h2 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Daftar Hadiah Berdasarkan Peringkat (5 Level)
            </h2>
            <span className="text-xs text-slate-400">
              Perubahan langsung tersinkron ke aplikasi mobile
            </span>
          </div>

          {isLoading ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#419CC3] mb-3" />
              <p className="text-sm text-slate-500">Memuat daftar hadiah level...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {rewards.map((r, index) => {
                const theme = getRankTheme(r.rank_name);

                return (
                  <div
                    key={r.id}
                    className={`bg-white rounded-2xl border p-5 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${theme.border}`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Level Step Badge */}
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs ${theme.iconBg}`}
                      >
                        <Gift className="w-6 h-6" />
                      </div>

                      {/* Info */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <Badge
                            variant="outline"
                            className={`font-bold text-xs px-2.5 py-0.5 rounded-md ${theme.badgeBg}`}
                          >
                            Level {index + 1}: {r.rank_name}
                          </Badge>
                          <Badge variant="secondary" className="text-[11px] font-bold bg-slate-100 text-slate-600">
                            Min {r.min_xp} XP
                          </Badge>
                          {!r.is_active && (
                            <Badge variant="outline" className="text-[10px] text-rose-600 border-rose-200">
                              Non-aktif
                            </Badge>
                          )}
                        </div>

                        <h3 className="font-bold text-base text-slate-800 pt-1">
                          {r.reward_title}
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                          {r.reward_description || 'Belum ada deskripsi hadiah.'}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center gap-2 shrink-0 sm:self-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(r)}
                        className="font-bold text-xs border-slate-200 hover:bg-[#419CC3]/10 hover:text-[#419CC3] hover:border-[#419CC3]/30 flex items-center gap-1.5"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit Hadiah
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Live Mobile App Preview */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center gap-2 pb-2">
            <Smartphone className="w-4 h-4 text-[#419CC3]" />
            <h2 className="font-bold text-sm text-slate-800">Preview Tampilan Mobile</h2>
          </div>

          <div className="bg-slate-900 p-4 rounded-3xl shadow-xl max-w-sm mx-auto border-4 border-slate-800">
            {/* Phone Screen Mockup */}
            <div className="bg-[#f8fafc] rounded-2xl p-4 space-y-4 text-slate-800">
              {/* Mobile Header Card */}
              <div className="bg-gradient-to-br from-[#419CC3] to-[#2563eb] text-white p-4 rounded-xl shadow-sm space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium opacity-90">Progres Levelling</span>
                  <Badge className="bg-white/20 text-white font-bold text-[10px] border-0">
                    Level Anda
                  </Badge>
                </div>
                <div className="flex items-baseline justify-between">
                  <h4 className="font-extrabold text-base">Karyawan Terampil</h4>
                  <span className="font-bold text-xs opacity-90">450 / 600 XP</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-amber-300 rounded-full" />
                </div>
              </div>

              {/* Hadiah Setiap Level Section */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs text-slate-700 flex items-center gap-1">
                    <Gift className="w-3.5 h-3.5 text-[#419CC3]" /> Hadiah Setiap Level
                  </h5>
                  <span className="text-[10px] text-slate-400">Otomatis Terbuka</span>
                </div>

                <div className="space-y-2">
                  {rewards.map((r, i) => {
                    const isUnlocked = i <= 2; // Demo unlocked up to Karyawan Terampil
                    const isCurrent = i === 2;

                    return (
                      <div
                        key={r.id}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all ${
                          isCurrent
                            ? 'bg-[#419CC3]/10 border-[#419CC3]/40 text-slate-800 font-semibold shadow-xs'
                            : isUnlocked
                            ? 'bg-white border-slate-200 text-slate-700'
                            : 'bg-slate-100/70 border-slate-200/60 text-slate-400 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {isUnlocked ? (
                            <Gift
                              className={`w-4 h-4 shrink-0 ${
                                isCurrent ? 'text-[#419CC3]' : 'text-emerald-600'
                              }`}
                            />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-[11px] truncate leading-tight">
                              {r.reward_title}
                            </p>
                            <p className="text-[9px] text-slate-400 truncate">
                              {r.rank_name} ({r.min_xp} XP)
                            </p>
                          </div>
                        </div>

                        {isCurrent && (
                          <Badge className="bg-[#419CC3] text-white text-[9px] px-1.5 py-0 shrink-0 font-bold border-0">
                            Level Anda
                          </Badge>
                        )}
                        {!isCurrent && isUnlocked && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Reward Dialog Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-lg rounded-2xl p-6 bg-white border border-slate-200 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Gift className="w-5 h-5 text-[#419CC3]" /> Edit Hadiah: {selectedReward?.rank_name}
            </DialogTitle>
          </DialogHeader>

          {selectedReward && (
            <form onSubmit={handleSave} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Nama Level (Rank)
                </label>
                <Input
                  value={selectedReward.rank_name}
                  disabled
                  className="bg-slate-100 font-bold text-slate-600 cursor-not-allowed"
                />
                <p className="text-[11px] text-slate-400">
                  Nama level disinkronkan dengan penentuan rank XP SobatHR.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Syarat Minimum XP
                </label>
                <Input
                  type="number"
                  value={formData.min_xp}
                  onChange={(e) => setFormData({ ...formData, min_xp: Number(e.target.value) })}
                  min={0}
                  className="font-semibold text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Judul Hadiah / Voucher
                </label>
                <Input
                  value={formData.reward_title}
                  onChange={(e) => setFormData({ ...formData, reward_title: e.target.value })}
                  placeholder="Contoh: Voucher Makan Rp 100.000"
                  className="font-semibold text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Deskripsi & Ketentuan Hadiah
                </label>
                <Textarea
                  value={formData.reward_description}
                  onChange={(e) =>
                    setFormData({ ...formData, reward_description: e.target.value })
                  }
                  rows={3}
                  placeholder="Contoh: Berlaku di seluruh outlet perusahaan."
                  className="text-xs resize-none leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-[#419CC3] rounded-md cursor-pointer"
                />
                <label
                  htmlFor="is_active"
                  className="text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Aktifkan Hadiah Ini di Aplikasi Mobile
                </label>
              </div>

              <DialogFooter className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                  disabled={updateMutation.isPending}
                  className="font-bold text-xs border-slate-200"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="bg-[#419CC3] hover:bg-[#3484a6] text-white font-bold text-xs flex items-center gap-2 shadow-sm"
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Simpan Perubahan
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
