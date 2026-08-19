import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Plus,
  Trash2,
  Save,
  Loader2,
  GripVertical,
  HelpCircle,
  Sparkles,
  Award,
  CheckCircle2,
  Calculator,
  ChevronDown,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { getApiUrl } from '@/lib/api';

interface ChecklistItem {
  id?: string;
  question: string;
  description?: string;
  max_score?: number;
}

interface Category {
  id?: string;
  name: string;
  checklists: ChecklistItem[];
}

export const InHouseChecklistBuilder: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [collapsedCats, setCollapsedCats] = useState<Record<number, boolean>>({});

  const fetchChecklists = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl('/in-house/checklists'));
      const data = await res.json();
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (err) {
      console.error('Failed to load in-house checklists', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklists();
  }, []);

  const handleSaveChecklists = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch(getApiUrl('/in-house/checklists/sync'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories }),
      });
      const data = await res.json();
      if (data.success) {
        setCategories(data.data || []);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert(data.message || 'Gagal menyimpan checklist');
      }
    } catch (err) {
      console.error('Failed to save in-house checklists', err);
      alert('Terjadi kesalahan saat menyimpan data.');
    } finally {
      setIsSaving(false);
    }
  };

  const addCategory = () => {
    setCategories([
      ...categories,
      {
        name: 'Kategori Training Baru',
        checklists: [
          {
            question: 'Butir Penilaian Kompetensi Baru',
            description: 'Panduan atau standar yang harus dipenuhi peserta',
            max_score: 5,
          },
        ],
      },
    ]);
  };

  const removeCategory = (index: number) => {
    if (window.confirm('Hapus kategori ini beserta seluruh butir penilaian di dalamnya?')) {
      setCategories(categories.filter((_, i) => i !== index));
    }
  };

  const updateCategoryName = (index: number, name: string) => {
    const updated = [...categories];
    updated[index].name = name;
    setCategories(updated);
  };

  const toggleCollapse = (index: number) => {
    setCollapsedCats((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const addPoint = (catIndex: number) => {
    const updated = [...categories];
    if (!updated[catIndex].checklists) {
      updated[catIndex].checklists = [];
    }
    updated[catIndex].checklists.push({
      question: 'Kriteria Kompetensi Baru',
      description: 'Panduan standar pelaksanaan di outlet',
      max_score: 5,
    });
    setCategories(updated);
  };

  const removePoint = (catIndex: number, pointIndex: number) => {
    const updated = [...categories];
    updated[catIndex].checklists.splice(pointIndex, 1);
    setCategories(updated);
  };

  const updatePoint = (
    catIndex: number,
    pointIndex: number,
    field: 'question' | 'description' | 'max_score',
    value: any
  ) => {
    const updated = [...categories];
    updated[catIndex].checklists[pointIndex] = {
      ...updated[catIndex].checklists[pointIndex],
      [field]: value,
    };
    setCategories(updated);
  };

  const totalPoints = categories.reduce(
    (acc, cat) => acc + (cat.checklists ? cat.checklists.length : 0),
    0
  );
  const totalMaxScore = categories.reduce(
    (acc, cat) =>
      acc +
      (cat.checklists
        ? cat.checklists.reduce((pAcc, p) => pAcc + (p.max_score || 5), 0)
        : 0),
    0
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <PageHeader
        title="Checklist In-House Training"
        subtitle="Kelola kriteria modul evaluasi on-site outlet dengan skala penilaian SB, B, C, K (1–5) & kalkulasi otomatis"
        icon={<GraduationCap className="w-7 h-7" />}
        actions={
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={addCategory}
              className="gap-2 border-slate-300 hover:bg-slate-50"
            >
              <Plus className="w-4 h-4 text-slate-600" />
              Tambah Kategori
            </Button>
            <Button
              onClick={handleSaveChecklists}
              disabled={isSaving}
              className="gap-2 bg-[#419CC3] hover:bg-[#3582a3] text-white shadow-sm"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menyimpan...
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  Tersimpan!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        }
      />

      {/* Guide Banner for Grading Scale */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#419CC3]/10 border border-[#419CC3]/20 flex items-center justify-center shrink-0">
              <Calculator className="w-5 h-5 text-[#419CC3]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                Format Skala Penilaian On-Site (In-House Training)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Setiap butir dinilai berdasarkan skala 1–5 dengan konversi predikat otomatis:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl py-2 px-3">
              <span className="font-extrabold text-emerald-700 block text-xs">SB (5)</span>
              <span className="text-[11px] text-emerald-600 font-medium">Sangat Baik</span>
            </div>
            <div className="bg-[#419CC3]/10 border border-[#419CC3]/25 rounded-xl py-2 px-3">
              <span className="font-extrabold text-[#419CC3] block text-xs">B (4)</span>
              <span className="text-[11px] text-[#3484a6] font-medium">Baik</span>
            </div>
            <div className="bg-amber-50 border border-amber-200/80 rounded-xl py-2 px-3">
              <span className="font-extrabold text-amber-700 block text-xs">C (3)</span>
              <span className="text-[11px] text-amber-600 font-medium">Cukup</span>
            </div>
            <div className="bg-rose-50 border border-rose-200/80 rounded-xl py-2 px-3">
              <span className="font-extrabold text-rose-700 block text-xs">K (1–2)</span>
              <span className="text-[11px] text-rose-600 font-medium">Kurang</span>
            </div>
          </div>
        </div>

        {/* Summary Counter */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex flex-wrap items-center gap-4">
            <span>
              Total Kategori: <strong className="text-slate-800 font-bold">{categories.length}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Total Butir Penilaian: <strong className="text-slate-800 font-bold">{totalPoints}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Skor Maksimum Kumulatif: <strong className="text-[#419CC3] font-bold">{totalMaxScore} Poin</strong>
            </span>
          </div>
          <span className="text-slate-500">
            Standar Kelulusan: <strong className="text-emerald-600 font-bold">Min. 70% (Predikat B)</strong>
          </span>
        </div>
      </div>

      {/* Main Categories List */}
      {isLoading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#419CC3] mb-3" />
          <p className="text-sm font-medium text-slate-500">Memuat struktur checklist training...</p>
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="w-8 h-8 text-slate-400" />}
          title="Belum Ada Modul Checklist Training"
          description="Tambahkan kategori dan butir penilaian pertama untuk panduan training outlet."
          actionLabel="Tambah Kategori Sekarang"
          actionIcon={<Plus className="w-4 h-4" />}
          onAction={addCategory}
        />
      ) : (
        <div className="space-y-6">
          {categories.map((cat, catIndex) => {
            const isCollapsed = !!collapsedCats[catIndex];
            const pointCount = cat.checklists?.length || 0;

            return (
              <Card
                key={cat.id || catIndex}
                className="border border-slate-200 shadow-sm overflow-hidden bg-white hover:border-slate-300 transition-colors"
              >
                {/* Category Header */}
                <CardHeader className="bg-slate-50/80 border-b border-slate-200/80 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        type="button"
                        onClick={() => toggleCollapse(catIndex)}
                        className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors"
                      >
                        {isCollapsed ? (
                          <ChevronRight className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>

                      <div className="w-7 h-7 rounded-lg bg-[#419CC3]/15 text-[#419CC3] font-bold text-xs flex items-center justify-center shrink-0">
                        {catIndex + 1}
                      </div>

                      <Input
                        value={cat.name}
                        onChange={(e) => updateCategoryName(catIndex, e.target.value)}
                        placeholder="Nama Kategori (misal: Standar Grooming & Kebersihan)"
                        className="font-bold text-sm text-slate-800 bg-white max-w-lg border-slate-300 focus-visible:ring-[#419CC3]"
                      />

                      <span className="text-xs text-slate-500 font-medium bg-slate-200/60 px-2.5 py-0.5 rounded-full">
                        {pointCount} butir kriteria
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addPoint(catIndex)}
                        className="text-xs text-[#419CC3] hover:text-[#3582a3] hover:bg-[#419CC3]/10"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Tambah Butir
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCategory(catIndex)}
                        className="text-xs text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Category Points */}
                {!isCollapsed && (
                  <CardContent className="p-4 space-y-3">
                    {pointCount === 0 ? (
                      <div className="py-6 text-center border-2 border-dashed border-slate-200 rounded-xl">
                        <p className="text-xs text-slate-400 mb-2">
                          Belum ada butir penilaian dalam kategori ini.
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addPoint(catIndex)}
                          className="text-xs"
                        >
                          <Plus className="w-3.5 h-3.5 mr-1 text-slate-500" />
                          Tambah Kriteria Pertama
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {cat.checklists.map((point, pointIndex) => (
                          <div
                            key={point.id || pointIndex}
                            className="flex items-start gap-3 p-3.5 bg-slate-50/60 hover:bg-slate-50 rounded-xl border border-slate-200/90 transition-all group"
                          >
                            <div className="pt-2 text-slate-300 group-hover:text-slate-400 cursor-grab">
                              <GripVertical className="w-4 h-4" />
                            </div>

                            <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center shrink-0 mt-1">
                              {pointIndex + 1}
                            </div>

                            <div className="flex-1 space-y-2">
                              <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                                  Kriteria Pertanyaan Penilaian
                                </label>
                                <Input
                                  value={point.question}
                                  onChange={(e) =>
                                    updatePoint(catIndex, pointIndex, 'question', e.target.value)
                                  }
                                  placeholder="Tuliskan kriteria yang dinilai oleh trainer..."
                                  className="text-xs font-semibold text-slate-800 bg-white border-slate-200 focus-visible:ring-[#419CC3]"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                  Panduan / Standar Pelaksanaan (Deskripsi)
                                </label>
                                <Input
                                  value={point.description || ''}
                                  onChange={(e) =>
                                    updatePoint(
                                      catIndex,
                                      pointIndex,
                                      'description',
                                      e.target.value
                                    )
                                  }
                                  placeholder="Contoh: Karyawan menggunakan sarung tangan, kuku bersih, apron tidak kotor"
                                  className="text-xs text-slate-600 bg-white border-slate-200 focus-visible:ring-[#419CC3]"
                                />
                              </div>
                            </div>

                            {/* Max Score & Scale indicator */}
                            <div className="flex flex-col items-end gap-2 shrink-0 pt-1">
                              <div className="flex items-center gap-1.5 bg-slate-100/90 border border-slate-200 px-2.5 py-1 rounded-lg">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">
                                  Skala:
                                </span>
                                <span className="text-xs font-bold text-[#419CC3]">1 – 5</span>
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removePoint(catIndex, pointIndex)}
                                className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
