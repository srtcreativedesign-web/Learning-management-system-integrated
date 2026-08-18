import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Zap,
  CheckCircle2,
  Circle,
  Pencil,
  Check,
  Loader2,
  FileText,
  FileEdit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getApiUrl } from '@/lib/api';

interface Option {
  option_text: string;
  is_correct: boolean;
}

interface Question {
  question_text: string;
  options: Option[];
  isEditing?: boolean;
}

export const LibraryQuizGenerate: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId');

  const [materialText, setMaterialText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (courseId) {
      setMaterialText('Sedang mengekstrak teks asli dari PDF... Mohon tunggu...');
      fetch(getApiUrl(`/quizzes/extract-pdf/${courseId}`))
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.text) {
            setMaterialText(data.text);
          } else {
            setMaterialText(
              'Gagal mengekstrak PDF secara otomatis. Silakan tempelkan (copy-paste) isi materi secara manual di sini.'
            );
          }
        })
        .catch((e) => {
          console.error(e);
          setMaterialText('Terjadi kesalahan saat membaca PDF. Silakan masukkan teks manual.');
        });
    }
  }, [courseId]);

  const handleGenerate = async () => {
    if (!materialText.trim()) {
      alert('Masukkan teks materi terlebih dahulu.');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch(getApiUrl('/quizzes/generate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materialText }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setGeneratedSummary(data.data?.summary || '');
        setGeneratedQuestions(
          (data.data?.questions || []).map((q: any) => ({ ...q, isEditing: false }))
        );
      } else {
        alert(data.message || 'Gagal generate kuis.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan pada koneksi server.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSetCorrectOption = (qIdx: number, optIdx: number) => {
    setGeneratedQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        return {
          ...q,
          options: q.options.map((opt, oi) => ({
            ...opt,
            is_correct: oi === optIdx,
          })),
        };
      })
    );
  };

  const handleToggleEdit = (qIdx: number) => {
    setGeneratedQuestions((prev) =>
      prev.map((q, i) => (i === qIdx ? { ...q, isEditing: !q.isEditing } : q))
    );
  };

  const handleSaveQuiz = async () => {
    if (generatedQuestions.length === 0) return;
    if (!courseId) return alert('ID Course tidak ditemukan');

    setIsSaving(true);
    try {
      const courseRes = await fetch(getApiUrl(`/lms/courses/${courseId}`));
      const course = await courseRes.json();
      const materialId = course.Materials?.[0]?.id;

      if (!materialId) {
        return alert('Materi belum dilampirkan, harap lengkapi PDF/Video terlebih dahulu');
      }

      const payload = {
        course_material_id: materialId,
        passing_score: 80,
        questions: generatedQuestions.map((q) => ({
          text: q.question_text,
          type: 'MULTIPLE_CHOICE',
          options: q.options.map((o) => ({
            text: o.option_text,
            is_correct: o.is_correct,
          })),
        })),
      };

      const saveRes = await fetch(getApiUrl('/quizzes'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (saveRes.ok) {
        alert('Kuis berhasil disimpan dan dipublikasikan!');
        navigate(`/library/course/${courseId}`);
      } else {
        alert('Gagal menyimpan kuis');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan kuis.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/library')}
          className="rounded-full shrink-0 border-slate-200"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </Button>
        <div>
          <Badge className="bg-[#419CC3]/10 text-[#419CC3] border-[#419CC3]/20 font-bold mb-2 flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered
          </Badge>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            Generate Quiz Cepat ⚡
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl leading-relaxed">
            Kecerdasan Buatan kami akan menganalisis dokumen materi Anda dan menyusun sekumpulan soal
            pilihan ganda dalam hitungan detik.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Material */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#419CC3] text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                Sumber Materi
              </h2>
              <FileEdit className="w-4 h-4 text-slate-400" />
            </div>

            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Tempelkan (copy-paste) poin materi, ringkasan, atau isi PDF ke dalam kotak di bawah:
              </p>

              <Textarea
                value={materialText}
                onChange={(e) => setMaterialText(e.target.value)}
                rows={12}
                className="w-full text-xs font-mono bg-slate-50 border-slate-200 rounded-xl focus:border-[#419CC3] resize-none p-3.5 leading-relaxed"
                placeholder="Contoh: Prosedur operasional kasir wajib menyapa pelanggan..."
              />

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-[#419CC3] hover:bg-[#3484a6] text-white font-bold h-11 shadow-md flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sedang Menganalisis...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" /> Analisis & Generate Soal
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Output / Review */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h2 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#89B4E1] text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                Hasil Soal & Review
              </h2>
              {generatedQuestions.length > 0 && (
                <Badge variant="secondary" className="font-bold text-xs bg-[#419CC3]/10 text-[#419CC3]">
                  {generatedQuestions.length} Soal Dibuat
                </Badge>
              )}
            </div>

            <div className="p-6 flex-1 flex flex-col bg-slate-50/40">
              {/* Empty State */}
              {generatedQuestions.length === 0 && !isGenerating && (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-16 px-4">
                  <div className="w-16 h-16 bg-[#419CC3]/10 rounded-2xl flex items-center justify-center mb-4 text-[#419CC3]">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-slate-700 text-base mb-1">Area Review Kosong</h3>
                  <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                    Klik tombol &quot;Analisis & Generate Soal&quot; untuk memproses materi.
                  </p>
                </div>
              )}

              {/* Loading State */}
              {isGenerating && (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                  <Loader2 className="w-10 h-10 text-[#419CC3] animate-spin mb-4" />
                  <h3 className="font-bold text-slate-800 text-base">
                    AI Sedang Membaca & Merangkum Materi...
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Mengekstrak poin-poin krusial dan merancang struktur soal.
                  </p>
                </div>
              )}

              {/* Questions List */}
              {generatedQuestions.length > 0 && (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                  {/* Summary */}
                  {generatedSummary && (
                    <div className="bg-gradient-to-r from-[#89B4E1]/15 to-[#419CC3]/5 border border-[#89B4E1]/30 p-4 rounded-xl">
                      <h4 className="font-bold text-xs text-[#419CC3] flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-3.5 h-3.5" /> Ringkasan AI
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{generatedSummary}</p>
                    </div>
                  )}

                  {generatedQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs"
                    >
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          {!q.isEditing ? (
                            <div>
                              <h4 className="font-bold text-sm text-slate-800 mb-3">
                                {q.question_text}
                              </h4>
                              <div className="space-y-2">
                                {q.options.map((opt, oIdx) => (
                                  <div
                                    key={oIdx}
                                    className={`flex items-start gap-2.5 p-2.5 rounded-lg text-xs border transition-all ${
                                      opt.is_correct
                                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900 font-bold'
                                        : 'bg-slate-50 border-slate-100 text-slate-600'
                                    }`}
                                  >
                                    {opt.is_correct ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    ) : (
                                      <Circle className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                                    )}
                                    <span>{opt.option_text}</span>
                                  </div>
                                ))}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleEdit(idx)}
                                className="mt-3 text-xs text-slate-500 hover:text-slate-800"
                              >
                                <Pencil className="w-3 h-3 mr-1" /> Edit Soal Ini
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-3 bg-slate-50 p-3 rounded-lg">
                              <label className="text-[11px] font-bold text-slate-600 uppercase">
                                Pertanyaan
                              </label>
                              <Input
                                value={q.question_text}
                                onChange={(e) =>
                                  setGeneratedQuestions((prev) =>
                                    prev.map((item, i) =>
                                      i === idx ? { ...item, question_text: e.target.value } : item
                                    )
                                  )
                                }
                                className="text-xs bg-white"
                              />

                              <label className="text-[11px] font-bold text-slate-600 uppercase block">
                                Pilihan Jawaban (Klik Radio untuk Jawaban Benar)
                              </label>
                              <div className="space-y-2">
                                {q.options.map((opt, oIdx) => (
                                  <div key={oIdx} className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name={`correct_${idx}`}
                                      checked={opt.is_correct}
                                      onChange={() => handleSetCorrectOption(idx, oIdx)}
                                      className="w-4 h-4 text-emerald-600 cursor-pointer"
                                    />
                                    <Input
                                      value={opt.option_text}
                                      onChange={(e) =>
                                        setGeneratedQuestions((prev) =>
                                          prev.map((item, i) => {
                                            if (i !== idx) return item;
                                            return {
                                              ...item,
                                              options: item.options.map((o, oi) =>
                                                oi === oIdx ? { ...o, option_text: e.target.value } : o
                                              ),
                                            };
                                          })
                                        )
                                      }
                                      className="text-xs bg-white"
                                    />
                                  </div>
                                ))}
                              </div>

                              <div className="flex justify-end pt-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleToggleEdit(idx)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                                >
                                  <Check className="w-3.5 h-3.5 mr-1" /> Selesai Edit
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {generatedQuestions.length > 0 && (
              <div className="p-5 border-t border-slate-100 bg-white">
                <Button
                  onClick={handleSaveQuiz}
                  disabled={isSaving}
                  className="w-full bg-[#419CC3] hover:bg-[#3484a6] text-white font-bold h-11 shadow-md flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Simpan & Publikasikan Kuis
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
