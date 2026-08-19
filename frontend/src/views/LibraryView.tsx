import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  FolderOpen,
  Search,
  CloudDownload,
  Plus,
  Zap,
  Eye,
  Pencil,
  FileText,
  HelpCircle,
  Star,
  Loader2,
  FileCheck,
  Check,
  X,
  Upload,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { getApiUrl } from '@/lib/api';

interface Material {
  id: string;
  type: string;
  content_url: string;
  Quiz?: any;
}

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  reward_points: number;
  Materials?: Material[];
}

interface QuizItem {
  id: string;
  passing_score: number;
  Material?: {
    Course?: {
      title: string;
    };
  };
  _count?: {
    Questions: number;
    EmployeeQuizAttempts: number;
  };
}

export const LibraryView: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'materi' | 'kuis'>('materi');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'PDF',
    thumbnail_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&q=80',
    reward_points: 100,
  });
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');

  // Fetch Courses
  const { data: courses = [], isLoading: isLoadingCourses } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => {
      const res = await fetch(getApiUrl('/lms/courses'));
      if (!res.ok) throw new Error('Failed to load courses');
      return res.json();
    },
  });

  // Fetch Quizzes
  const { data: quizzes = [], isLoading: isLoadingQuizzes } = useQuery<QuizItem[]>({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const res = await fetch(getApiUrl('/quizzes/all'));
      if (!res.ok) throw new Error('Failed to load quizzes');
      return res.json();
    },
    enabled: activeTab === 'kuis',
  });

  const openCreateModal = () => {
    setIsEdit(false);
    setCurrentId('');
    setFormData({
      title: '',
      description: '',
      type: 'PDF',
      thumbnail_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&q=80',
      reward_points: 100,
    });
    setUploadedFileUrl('');
    setShowDialog(true);
  };

  const openEditModal = (item: Course) => {
    setIsEdit(true);
    setCurrentId(item.id);
    setFormData({
      title: item.title,
      description: item.description,
      type: item.Materials?.[0]?.type || 'PDF',
      thumbnail_url: item.thumbnail_url || '',
      reward_points: item.reward_points || 0,
    });
    setUploadedFileUrl(item.Materials?.[0]?.content_url || '');
    setShowDialog(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch(getApiUrl('/lms/courses/upload'), {
        method: 'POST',
        body,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUploadedFileUrl(data.url);
        alert('File berhasil diunggah!');
      } else {
        alert(data.message || 'Gagal mengunggah file.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return alert('Judul wajib diisi');
    if (!isEdit && !uploadedFileUrl) {
      return alert('Silakan pilih dan unggah file materi (PDF/Video) terlebih dahulu!');
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      thumbnail_url: formData.thumbnail_url,
      reward_points: Number(formData.reward_points),
      materials: uploadedFileUrl
        ? [{ type: formData.type, content_url: uploadedFileUrl, min_read_time: 0 }]
        : undefined,
    };

    try {
      const url = isEdit
        ? getApiUrl(`/lms/courses/${currentId}`)
        : getApiUrl('/lms/courses');
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(isEdit ? 'Berhasil diperbarui' : 'Berhasil ditambahkan');
        setShowDialog(false);
        queryClient.invalidateQueries({ queryKey: ['courses'] });
      } else {
        alert('Gagal menyimpan materi');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan');
    }
  };

  const handleSyncHRIS = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      alert('Sinkronisasi HRIS selesai. (Mobile app HRIS dapat mengambil data terbaru)');
    }, 1000);
  };

  const filteredCourses = courses.filter((c) =>
    c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Reusable Page Header */}
      <PageHeader
        title="Pustaka Materi"
        subtitle="Kelola modul PDF, Video, dan Kuis. Tersinkronisasi dengan HRIS."
        icon={<FolderOpen className="w-7 h-7" />}
        actions={
          <>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari materi..."
                className="pl-9 h-10 rounded-xl bg-slate-50 border-slate-200 text-sm"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleSyncHRIS}
              disabled={syncing}
              className="font-semibold flex items-center gap-2 border-slate-200"
            >
              {syncing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CloudDownload className="w-4 h-4 text-[#419CC3]" />
              )}
              Sync HRIS
            </Button>
            {activeTab === 'materi' ? (
              <Button
                onClick={openCreateModal}
                className="bg-[#419CC3] hover:bg-[#3484a6] text-white font-bold flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Buat Materi Baru
              </Button>
            ) : (
              <Button
                onClick={() => navigate('/library/generate-quiz')}
                className="bg-[#419CC3] hover:bg-[#3484a6] text-white font-bold flex items-center gap-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4" /> Buat Kuis Baru (AI)
              </Button>
            )}
          </>
        }
      />

      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('materi')}
          className={`pb-3 font-bold text-sm transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'materi'
              ? 'border-[#419CC3] text-[#419CC3]'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" /> Pustaka Materi
        </button>
        <button
          onClick={() => setActiveTab('kuis')}
          className={`pb-3 font-bold text-sm transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'kuis'
              ? 'border-[#419CC3] text-[#419CC3]'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <HelpCircle className="w-4 h-4" /> Manajemen Kuis
        </button>
      </div>

      {/* MATERI TAB */}
      {activeTab === 'materi' && (
        <>
          {isLoadingCourses ? (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#419CC3] mb-3" />
              <p className="text-sm text-slate-500">Memuat materi pelatihan...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <EmptyState
              icon={<FolderOpen className="w-8 h-8" />}
              title="Belum ada materi"
              description="Klik tombol 'Buat Baru' untuk mengunggah PDF atau Video Pelatihan."
              actionLabel="Unggah Materi Sekarang"
              onAction={openCreateModal}
              actionIcon={<Plus className="w-4 h-4" />}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((item) => {
                const materialType = item.Materials?.[0]?.type || 'PDF';
                const hasQuiz = Boolean(item.Materials?.[0]?.Quiz);

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-1"
                  >
                    {/* Card Thumbnail */}
                    <div className="h-44 overflow-hidden relative bg-slate-100">
                      <img
                        src={item.thumbnail_url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 right-3 z-10">
                        <Badge variant="secondary" className="bg-white/90 backdrop-blur-md text-slate-800 font-bold shadow-xs">
                          {materialType}
                        </Badge>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-base text-slate-800 line-clamp-1 group-hover:text-[#419CC3] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.description || 'Tidak ada deskripsi.'}
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          {item.reward_points} Poin
                        </span>
                        <StatusBadge
                          status={item.Materials?.length ? 'published' : 'draft'}
                        />
                      </div>

                      {/* Card Actions */}
                      <div className="mt-4 space-y-2">
                        {!hasQuiz && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => navigate(`/library/generate-quiz?courseId=${item.id}`)}
                            className="w-full bg-[#419CC3]/10 hover:bg-[#419CC3]/20 text-[#419CC3] font-bold text-xs flex items-center justify-center gap-1.5"
                          >
                            <Zap className="w-3.5 h-3.5" /> Generate Kuis Cepat
                          </Button>
                        )}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => navigate(`/library/course/${item.id}`)}
                            className="flex-1 bg-[#419CC3] hover:bg-[#3484a6] text-white font-bold text-xs flex items-center justify-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" /> Detail
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditModal(item)}
                            className="flex-1 font-bold text-xs flex items-center justify-center gap-1.5 border-slate-200"
                          >
                            <Pencil className="w-3.5 h-3.5" /> Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* KUIS TAB */}
      {activeTab === 'kuis' && (
        <>
          {isLoadingQuizzes ? (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#419CC3] mb-3" />
              <p className="text-sm text-slate-500">Memuat daftar kuis...</p>
            </div>
          ) : quizzes.length === 0 ? (
            <EmptyState
              icon={<HelpCircle className="w-8 h-8" />}
              title="Belum ada Kuis"
              description="Belum ada modul kuis evaluasi yang dibuat. Anda dapat membuat kuis otomatis dengan bantuan AI dari materi yang sudah diunggah."
              actionLabel="Buat Kuis Baru dengan AI"
              onAction={() => navigate('/library/generate-quiz')}
              actionIcon={<Sparkles className="w-4 h-4" />}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((q) => (
                <div
                  key={q.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-bold text-base text-slate-800 line-clamp-2">
                      Kuis: {q.Material?.Course?.title || 'Umum'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Nilai Kelulusan:{' '}
                      <strong className="text-[#419CC3]">{q.passing_score}</strong>
                    </p>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="text-center p-3 bg-slate-50 rounded-xl">
                        <p className="text-lg font-extrabold text-slate-800">
                          {q._count?.Questions || 0}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          Soal
                        </p>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-xl">
                        <p className="text-lg font-extrabold text-slate-800">
                          {q._count?.EmployeeQuizAttempts || 0}
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          Peserta
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/quiz-builder')}
                      className="w-full font-bold text-xs flex items-center justify-center gap-2 border-slate-200"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Edit Soal
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800">
              {isEdit ? 'Edit Materi Pelatihan' : 'Buat Materi Baru'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveCourse} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Judul Course</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: Orientasi Kasir"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">Deskripsi</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                placeholder="Deskripsi modul materi..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Tipe File</label>
                <Input
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="PDF / VIDEO"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">Poin Reward</label>
                <Input
                  type="number"
                  value={formData.reward_points}
                  onChange={(e) => setFormData({ ...formData, reward_points: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase">
                Unggah File Materi (PDF / MP4)
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors">
                <input
                  type="file"
                  id="course-file"
                  accept="application/pdf,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="course-file"
                  className="cursor-pointer flex flex-col items-center justify-center gap-1"
                >
                  {isUploading ? (
                    <Loader2 className="w-6 h-6 text-[#419CC3] animate-spin" />
                  ) : (
                    <Upload className="w-6 h-6 text-slate-400" />
                  )}
                  <span className="text-xs font-bold text-[#419CC3]">
                    {isUploading ? 'Sedang Mengunggah...' : 'Pilih File PDF / Video'}
                  </span>
                </label>
              </div>
              {uploadedFileUrl && (
                <div className="text-xs text-[#419CC3] font-bold mt-2 flex items-center gap-1.5 bg-[#419CC3]/10 p-2.5 rounded-lg">
                  <FileCheck className="w-4 h-4" /> Terlampir: {uploadedFileUrl.split('/').pop()}
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 pt-4 border-t border-slate-100">
              <Button type="button" variant="ghost" onClick={() => setShowDialog(false)}>
                <X className="w-4 h-4 mr-1" /> Batal
              </Button>
              <Button type="submit" className="bg-[#419CC3] hover:bg-[#3484a6] text-white font-bold">
                <Check className="w-4 h-4 mr-1" /> Simpan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
