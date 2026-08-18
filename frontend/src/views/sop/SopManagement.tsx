import React, { useState, useRef } from 'react';
import { FileText, Sparkles, CheckCircle2, Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/common/PageHeader';
import { getApiUrl } from '@/lib/api';

export const SopManagement: React.FC = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('HEAD_OFFICE');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      alert('Pilih file PDF SOP terlebih dahulu.');
      return;
    }

    setIsUploading(true);
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('file', file);

    try {
      const res = await fetch(getApiUrl('/api/sop/upload'), {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setUploadSuccess(true);
        setTitle('');
        setCategory('HEAD_OFFICE');
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        alert('Gagal mengunggah SOP.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menghubungi server.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Reusable Page Header */}
      <PageHeader
        title="Manajemen SOP (Admin)"
        subtitle="Unggah dokumen SOP dalam format PDF. Sistem AI akan mengekstrak butir-butir panduan secara otomatis."
        icon={<FileText className="w-7 h-7" />}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">Judul SOP</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: SOP Kasir & Pelayanan Pelanggan"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-xs focus:outline-hidden focus:ring-1 focus:ring-[#419CC3]"
            >
              <option value="HEAD_OFFICE">Head Office</option>
              <option value="OPERASIONAL">Operasional (Outlet)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">File PDF SOP</label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors">
              <input
                type="file"
                ref={fileInputRef}
                accept="application/pdf"
                className="hidden"
                id="sop-file-input"
                required
              />
              <label
                htmlFor="sop-file-input"
                className="cursor-pointer flex flex-col items-center justify-center gap-1.5"
              >
                <Upload className="w-8 h-8 text-slate-400" />
                <span className="text-sm font-bold text-[#419CC3]">
                  Pilih Dokumen PDF SOP
                </span>
                <span className="text-xs text-slate-400">Format .pdf maksimal 10MB</span>
              </label>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isUploading}
            className="w-full bg-[#419CC3] hover:bg-[#3484a6] text-white font-bold h-11 shadow-md flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Sedang Mengunggah & Mengekstrak AI...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Upload & Ekstrak AI
              </>
            )}
          </Button>
        </form>

        {uploadSuccess && (
          <div className="mt-6 p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Berhasil Diunggah!</h4>
              <p className="text-xs text-emerald-700 mt-0.5">
                SOP telah diekstrak oleh AI dan siap dibaca oleh seluruh tim di Pustaka SOP.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
