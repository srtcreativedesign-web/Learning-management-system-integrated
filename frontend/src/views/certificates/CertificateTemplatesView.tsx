import React, { useState, useEffect } from 'react';
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Layers,
  Sparkles,
  Eye,
  Sliders,
  Save,
  RotateCcw,
  Palette,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CertificateCanvas, CertificateData } from '@/components/certificate/CertificateCanvas';
import { CertificateModal } from '@/components/certificate/CertificateModal';
import { getApiUrl } from '@/lib/api';

interface CertificateTemplate {
  id: string;
  name: string;
  bg_image_url: string;
  name_pos_x: number;
  name_pos_y: number;
  name_font_size: number;
  name_font_color: string;
  _count?: { Quizzes: number };
}

export const CertificateTemplatesView: React.FC = () => {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Editor Modal / Drawer state
  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<CertificateTemplate>>({
    name: 'Template Baru',
    bg_image_url: 'theme:classic-navy',
    name_pos_x: 50,
    name_pos_y: 45,
    name_font_size: 34,
    name_font_color: '#0F4F68',
  });

  // Interactive Live Preview Data
  const [sampleRecipientName, setSampleRecipientName] = useState('Budi Santoso');
  const [sampleCourseTitle, setSampleCourseTitle] = useState('SOP Barista & Service Hospitality Standard');

  // Full Screen Preview Modal
  const [previewData, setPreviewData] = useState<CertificateData | null>(null);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl('/certificate-templates'));
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch (err) {
      console.error('Failed to load certificate templates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleOpenCreate = () => {
    setEditingTemplate({
      name: 'Template Sertifikat Baru',
      bg_image_url: 'theme:classic-navy',
      name_pos_x: 50,
      name_pos_y: 45,
      name_font_size: 34,
      name_font_color: '#0F4F68',
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (t: CertificateTemplate) => {
    setEditingTemplate({ ...t });
    setIsEditing(true);
  };

  const handleSaveTemplate = async () => {
    if (!editingTemplate.name?.trim()) {
      alert('Mohon isi nama template sertifikat.');
      return;
    }

    setIsSaving(true);
    try {
      const isUpdating = Boolean(editingTemplate.id);
      const url = isUpdating
        ? getApiUrl(`/certificate-templates/${editingTemplate.id}`)
        : getApiUrl('/certificate-templates');
      const method = isUpdating ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTemplate),
      });

      if (res.ok) {
        setIsEditing(false);
        loadTemplates();
      } else {
        alert('Gagal menyimpan template sertifikat.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTemplate = async (id: string, name: string) => {
    if (confirm(`Hapus template "${name}"?`)) {
      try {
        const res = await fetch(getApiUrl(`/certificate-templates/${id}`), {
          method: 'DELETE',
        });
        if (res.ok) {
          loadTemplates();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const THEMES = [
    {
      id: 'theme:classic-navy',
      name: 'Navy & Gold Classic',
      color: '#0F4F68',
      desc: 'Standar resmi TnD Academy dengan bingkai ganda emas klasik',
    },
    {
      id: 'theme:gold-executive',
      name: 'Gold Executive Modern',
      color: '#B45309',
      desc: 'Warna emas mewah untuk kelulusan managerial & supervisor',
    },
    {
      id: 'theme:emerald-specialist',
      name: 'Emerald Specialist',
      color: '#065F46',
      desc: 'Tema hijau botani untuk spesialis barista, roaster & beverage',
    },
    {
      id: 'theme:minimalist-light',
      name: 'Minimalist Clean',
      color: '#334155',
      desc: 'Desain minimalis modern SobatHR dengan tipografi kontemporer',
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#0F4F68] text-white flex items-center justify-center shadow-xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Desain Template Sertifikat
              </h1>
              <p className="text-slate-500 text-xs mt-0.5">
                Kelola layout visual sertifikat kelulusan kuis & modul pelatihan SobatHR.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={handleOpenCreate}
            className="bg-[#0F4F68] hover:bg-[#0c3f54] text-white font-bold text-xs gap-1.5 shadow-sm rounded-xl px-4 py-2.5"
          >
            <Plus className="w-4 h-4" /> Tambah Template Baru
          </Button>
        </div>
      </div>

      {/* Template Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-16 text-center text-slate-400">
            <p className="text-sm">Memuat daftar template sertifikat...</p>
          </div>
        ) : templates.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400">
            <Award className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-700">Belum ada template</p>
            <p className="text-xs text-slate-400 mt-1">Klik tombol di atas untuk membuat template sertifikat pertama.</p>
          </div>
        ) : (
          templates.map((t) => (
            <Card
              key={t.id}
              className="rounded-2xl border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Mini Canvas Preview */}
                <div className="h-44 bg-slate-100 overflow-hidden relative border-b border-slate-100 flex items-center justify-center p-2">
                  <div className="pointer-events-none scale-[0.27] origin-center">
                    <CertificateCanvas
                      data={{
                        recipientName: 'Nama Peserta',
                        courseTitle: 'Judul Modul Pelatihan',
                        score: 95,
                        template: t,
                      }}
                      showBorder
                    />
                  </div>
                </div>

                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-slate-800 line-clamp-1">
                        {t.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        Posisi Y: {t.name_pos_y}% • Font: {t.name_font_size}px
                      </p>
                    </div>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#419CC3]/10 text-[#419CC3] whitespace-nowrap">
                      {t._count?.Quizzes || 0} Kuis Terhubung
                    </span>
                  </div>
                </CardContent>
              </div>

              {/* Card Footer Actions */}
              <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPreviewData({
                      recipientName: sampleRecipientName,
                      courseTitle: sampleCourseTitle,
                      score: 98,
                      template: t,
                    })
                  }
                  className="text-xs text-slate-600 gap-1 rounded-lg"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview Penuh
                </Button>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(t)}
                    className="text-xs text-slate-700 gap-1 rounded-lg"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTemplate(t.id, t.name)}
                    className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg p-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Editor Modal / Live Designer */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#0F4F68] text-white flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-800">
                    {editingTemplate.id ? 'Edit Template Sertifikat' : 'Buat Template Sertifikat Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sesuaikan tema latar belakang, posisi teks nama, dan warna sertifikat secara visual.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                  className="text-xs"
                >
                  Batal
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveTemplate}
                  disabled={isSaving}
                  className="bg-[#0F4F68] hover:bg-[#0c3f54] text-white text-xs font-bold gap-1.5 shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              </div>
            </div>

            {/* Modal Body: Two Columns (Controls on Left, Live Preview Canvas on Right) */}
            <div className="flex-1 overflow-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
              {/* Left Controls (4 cols) */}
              <div className="lg:col-span-5 space-y-4">
                {/* Template Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">
                    Nama Template
                  </label>
                  <Input
                    value={editingTemplate.name || ''}
                    onChange={(e) =>
                      setEditingTemplate({ ...editingTemplate, name: e.target.value })
                    }
                    placeholder="misal: Sertifikat Spesialis Barista"
                    className="bg-white text-xs"
                  />
                </div>

                {/* Theme Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-slate-500" />
                    Pilih Tema Desain
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {THEMES.map((theme) => {
                      const isSelected = editingTemplate.bg_image_url === theme.id;
                      return (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() =>
                            setEditingTemplate({
                              ...editingTemplate,
                              bg_image_url: theme.id,
                            })
                          }
                          className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                            isSelected
                              ? 'border-[#0F4F68] bg-[#0F4F68]/5 ring-2 ring-[#0F4F68]/20'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: theme.color }}
                            />
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-[#0F4F68]" />
                            )}
                          </div>
                          <p className="text-xs font-bold text-slate-800 mt-2">
                            {theme.name}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Coordinate & Typography Sliders */}
                <Card className="rounded-xl border-slate-200 p-4 space-y-4 bg-slate-50/50">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Tata Letak Nama Peserta
                  </h4>

                  {/* Posisi Y */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 font-medium">Posisi Vertikal (Y)</span>
                      <span className="font-bold text-slate-800 font-mono">
                        {editingTemplate.name_pos_y || 45}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="35"
                      max="60"
                      step="1"
                      value={editingTemplate.name_pos_y || 45}
                      onChange={(e) =>
                        setEditingTemplate({
                          ...editingTemplate,
                          name_pos_y: Number(e.target.value),
                        })
                      }
                      className="w-full accent-[#0F4F68]"
                    />
                  </div>

                  {/* Ukuran Font */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 font-medium">Ukuran Huruf (Font Size)</span>
                      <span className="font-bold text-slate-800 font-mono">
                        {editingTemplate.name_font_size || 34}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="24"
                      max="48"
                      step="1"
                      value={editingTemplate.name_font_size || 34}
                      onChange={(e) =>
                        setEditingTemplate({
                          ...editingTemplate,
                          name_font_size: Number(e.target.value),
                        })
                      }
                      className="w-full accent-[#0F4F68]"
                    />
                  </div>

                  {/* Warna Font */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-600 font-medium">Warna Huruf</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={editingTemplate.name_font_color || '#0F4F68'}
                        onChange={(e) =>
                          setEditingTemplate({
                            ...editingTemplate,
                            name_font_color: e.target.value,
                          })
                        }
                        className="w-8 h-8 rounded-md border border-slate-300 p-0.5 cursor-pointer"
                      />
                      <Input
                        value={editingTemplate.name_font_color || '#0F4F68'}
                        onChange={(e) =>
                          setEditingTemplate({
                            ...editingTemplate,
                            name_font_color: e.target.value,
                          })
                        }
                        className="bg-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </Card>

                {/* Sample Preview Text Modifier */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">
                    Uji Teks Sampel
                  </label>
                  <Input
                    value={sampleRecipientName}
                    onChange={(e) => setSampleRecipientName(e.target.value)}
                    placeholder="Nama Peserta Sampel"
                    className="bg-white text-xs"
                  />
                </div>
              </div>

              {/* Right Canvas Live Preview (7 cols) */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center p-4 bg-slate-100/70 rounded-2xl border border-slate-200/80 overflow-hidden">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Pratinjau Langsung (Live Visual Preview)
                </p>
                <div className="scale-[0.62] origin-top">
                  <CertificateCanvas
                    data={{
                      recipientName: sampleRecipientName || 'Nama Peserta',
                      courseTitle: sampleCourseTitle,
                      score: 95,
                      template: editingTemplate,
                    }}
                    showBorder
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Certificate Preview Modal */}
      <CertificateModal
        isOpen={Boolean(previewData)}
        onClose={() => setPreviewData(null)}
        data={previewData}
      />
    </div>
  );
};
