import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Plus,
  Trash2,
  X,
  Save,
  Loader2,
  GripVertical,
  List,
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
}

interface Category {
  id?: string;
  name: string;
  checklists: ChecklistItem[];
}

export const ChecklistBuilder: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchChecklists = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl('/audit/checklist'));
      const data = await res.json();
      if (data.success) {
        setCategories(data.data || []);
      }
    } catch (err) {
      console.error('Failed to load checklists', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChecklists = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(getApiUrl('/audit/checklist/sync'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Berhasil menyimpan checklist audit!');
        setCategories(data.data || []);
      } else {
        alert('Gagal menyimpan checklist');
      }
    } catch (err) {
      console.error('Failed to save', err);
      alert('Terjadi kesalahan saat menyimpan.');
    } finally {
      setIsSaving(false);
    }
  };

  const addCategory = () => {
    setCategories([
      ...categories,
      {
        name: 'Kategori Baru',
        checklists: [],
      },
    ]);
  };

  const removeCategory = (index: number) => {
    if (window.confirm('Yakin ingin menghapus kategori ini?')) {
      setCategories(categories.filter((_, i) => i !== index));
    }
  };

  const addPoint = (catIndex: number) => {
    const updated = [...categories];
    if (!updated[catIndex].checklists) {
      updated[catIndex].checklists = [];
    }
    updated[catIndex].checklists.push({
      question: 'Pertanyaan Baru',
    });
    setCategories(updated);
  };

  const removePoint = (catIndex: number, pointIndex: number) => {
    const updated = [...categories];
    updated[catIndex].checklists.splice(pointIndex, 1);
    setCategories(updated);
  };

  const updateCategoryName = (catIndex: number, name: string) => {
    const updated = [...categories];
    updated[catIndex].name = name;
    setCategories(updated);
  };

  const updatePointQuestion = (catIndex: number, pointIndex: number, question: string) => {
    const updated = [...categories];
    updated[catIndex].checklists[pointIndex].question = question;
    setCategories(updated);
  };

  useEffect(() => {
    fetchChecklists();
  }, []);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Reusable Page Header */}
      <PageHeader
        title="Kriteria Checklist Audit"
        subtitle="Atur kategori dan poin pemeriksaan untuk inspeksi lapangan (Audit App)"
        icon={<CheckSquare className="w-7 h-7" />}
        actions={
          <Button
            onClick={handleSaveChecklists}
            disabled={isSaving}
            className="bg-[#419CC3] hover:bg-[#3484a6] text-white font-bold flex items-center gap-2 shadow-sm"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan Perubahan
          </Button>
        }
      />

      {isLoading ? (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#419CC3] mb-3" />
          <p className="text-sm text-slate-500">Memuat data checklist audit...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.length === 0 ? (
            <EmptyState
              title="Belum ada kriteria checklist"
              description="Buat kategori dan tentukan poin-poin pertanyaan audit untuk toko."
              actionLabel="Buat Kategori Pertama"
              onAction={addCategory}
              actionIcon={<Plus className="w-4 h-4" />}
            />
          ) : (
            categories.map((cat, cIdx) => (
              <Card key={cIdx} className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
                {/* Category Header */}
                <CardHeader className="bg-slate-50 px-5 py-3.5 border-b border-slate-200 flex flex-row items-center gap-3">
                  <GripVertical className="w-4 h-4 text-slate-400" />
                  <Input
                    value={cat.name}
                    onChange={(e) => updateCategoryName(cIdx, e.target.value)}
                    placeholder="Nama Kategori (Contoh: Kebersihan Area Kasir)"
                    className="font-bold text-sm bg-white flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCategory(cIdx)}
                    className="text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardHeader>

                {/* Points List */}
                <CardContent className="p-5 space-y-3">
                  {(!cat.checklists || cat.checklists.length === 0) && (
                    <p className="text-xs text-slate-400 italic">
                      Belum ada poin pemeriksaan di kategori ini.
                    </p>
                  )}

                  {cat.checklists?.map((point, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2.5">
                      <List className="w-4 h-4 text-slate-300 shrink-0" />
                      <Input
                        value={point.question}
                        onChange={(e) => updatePointQuestion(cIdx, pIdx, e.target.value)}
                        placeholder="Contoh: Lantai bersih dan bebas sampah"
                        className="text-sm flex-1 bg-slate-50/50"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removePoint(cIdx, pIdx)}
                        className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full h-8 w-8"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addPoint(cIdx)}
                    className="mt-2 text-xs font-bold text-[#419CC3] border-slate-200"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Tambah Poin
                  </Button>
                </CardContent>
              </Card>
            ))
          )}

          {categories.length > 0 && (
            <div className="text-center pt-2">
              <Button
                variant="outline"
                onClick={addCategory}
                className="font-bold text-slate-700 border-slate-300"
              >
                <Plus className="w-4 h-4 mr-2" /> Tambah Kategori Baru
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
