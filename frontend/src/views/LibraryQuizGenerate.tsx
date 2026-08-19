import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Sparkles,
  Zap,
  CheckCircle2,
  Circle,
  Pencil,
  Check,
  Loader2,
  BookOpen,
  FileEdit,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/common/PageHeader';
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

interface CourseItem {
  id: string;
  title: string;
  description?: string;
  Materials?: Array<{
    id: string;
    type: string;
    content_url: string;
  }>;
}

export const LibraryQuizGenerate: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCourseId = searchParams.get('courseId') || '';

  const [selectedCourseId, setSelectedCourseId] = useState<string>(urlCourseId);
  const [materialText, setMaterialText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [passingScore, setPassingScore] = useState(80);

  // Fetch all courses for the dropdown selector
  const { data: courses = [], isLoading: isLoadingCourses } = useQuery<CourseItem[]>({
    queryKey: ['courses-for-quiz'],
    queryFn: async () => {
      const res = await fetch(getApiUrl('/lms/courses'));
      if (!res.ok) throw new Error('Failed to load courses');
      return res.json();
    },
  });

  // Extract text and auto-generate when a course is chosen
  const extractAndGenerate = async (courseId: string) => {
    if (!courseId) return;

    setIsExtracting(true);
    setMaterialText('');
    setGeneratedQuestions([]);
    setGeneratedSummary('');

    try {
      // Step 1: Extract PDF text from backend
      const extractRes = await fetch(getApiUrl(`/quizzes/extract-pdf/${courseId}`));
      const extractData = await extractRes.json();

      let extractedText = '';
      if (extractData.success && extractData.text && extractData.text.trim()) {
        extractedText = extractData.text;
      } else {
        // Fallback: If no PDF or extraction returned empty, look up course title/description
        const selectedCourse = courses.find((c) => c.id === courseId);
        extractedText = selectedCourse
          ? `${selectedCourse.title}\n\n${selectedCourse.description || ''}`
          : '';
      }

      setMaterialText(extractedText);
      setIsExtracting(false);

      // Step 2: Auto-trigger AI Quiz Generation if text is available
      if (extractedText.trim()) {
        await runAiGeneration(extractedText);
      }
    } catch (err) {
      console.error('Error extracting PDF:', err);
      setIsExtracting(false);
      setMaterialText('Gagal mengekstrak materi. Anda dapat menempelkan teks materi secara manual di bawah.');
    }
  };

  // Run AI Groq generation
  const runAiGeneration = async (textToUse: string) => {
    if (!textToUse || !textToUse.trim()) {
      alert('Teks materi masih kosong. Silakan masukkan teks materi.');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch(getApiUrl('/quizzes/generate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materialText: textToUse }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setGeneratedSummary(data.data?.summary || '');
        setGeneratedQuestions(
          (data.data?.questions || []).map((q: any) => ({ ...q, isEditing: false }))
        );
      } else {
        alert(data.message || 'AI gagal menghasilkan kuis. Silakan coba lagi.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menghubungi server AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle course dropdown change
  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSearchParams(courseId ? { courseId } : {});
    if (courseId) {
      extractAndGenerate(courseId);
    }
  };

  // Trigger on initial load if courseId was passed in URL query
  useEffect(() => {
    if (urlCourseId && courses.length > 0) {
      setSelectedCourseId(urlCourseId);
      extractAndGenerate(urlCourseId);
    }
  }, [urlCourseId, courses.length]);

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
    if (!selectedCourseId) return alert('Silakan pilih Materi Kursus terlebih dahulu.');

    setIsSaving(true);
    try {
      const courseRes = await fetch(getApiUrl(`/lms/courses/${selectedCourseId}`));
      const course = await courseRes.json();
      const materialId = course.Materials?.[0]?.id;

      if (!materialId) {
        setIsSaving(false);
        return alert('Materi ini belum memiliki file lampiran (PDF/Video). Harap lengkapi materi kursus terlebih dahulu.');
      }

      const payload = {
        course_material_id: materialId,
        passing_score: Number(passingScore) || 80,
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
        alert('Kuis berhasil dibuat, disimpan, dan dipublikasikan!');
        navigate('/library');
      } else {
        alert('Gagal menyimpan kuis.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan kuis.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Reusable Header */}
      <PageHeader
        title="Buat Kuis Otomatis dengan AI"
        subtitle="Pilih modul materi kursus, sistem AI akan langsung mengekstrak dokumen dan menyusun 5 butir soal evaluasi secara instan."
        icon={<Sparkles className="w-7 h-7 text-[#419CC3]" />}
        backUrl="/library"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Select Course & Material Source */}
        <div className="lg:col-span-5 space-y-6">
          {/* Step 1: Select Course */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="w-6 h-6 rounded-full bg-[#419CC3] text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              <h2 className="font-bold text-slate-800 text-sm">Pilih Materi Kursus</h2>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Materi yang Ingin Dibuatkan Kuis
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => handleCourseChange(e.target.value)}
                disabled={isLoadingCourses || isExtracting || isGenerating}
                className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#419CC3] transition-all cursor-pointer"
              >
                <option value="">-- Pilih Materi Kursus --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.Materials?.[0]?.type || 'Materi'})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400">
                Saat Anda memilih materi, sistem AI akan otomatis membaca dokumen & menyusun soal.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Batas Nilai Kelulusan (Passing Score)
              </label>
              <Input
                type="number"
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
                min={10}
                max={100}
                className="h-10 text-sm font-bold bg-slate-50"
              />
            </div>
          </div>

          {/* Step 2: Extracted Text / Manual Input */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <h2 className="font-bold text-slate-800 text-sm">Teks Materi (Hasil Ekstraksi)</h2>
              </div>
              {isExtracting && (
                <Badge variant="outline" className="bg-blue-50 text-[#419CC3] border-blue-200 text-xs animate-pulse">
                  Mengekstrak PDF...
                </Badge>
              )}
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Anda juga dapat mengedit atau menambahkan teks materi secara manual sebelum dianalisis oleh AI:
            </p>

            <Textarea
              value={materialText}
              onChange={(e) => setMaterialText(e.target.value)}
              rows={10}
              disabled={isExtracting}
              className="w-full text-xs font-mono bg-slate-50 border-slate-200 rounded-xl focus:border-[#419CC3] resize-none p-3.5 leading-relaxed"
              placeholder="Teks isi dokumen akan muncul di sini setelah materi dipilih..."
            />

            <Button
              onClick={() => runAiGeneration(materialText)}
              disabled={isGenerating || isExtracting || !materialText.trim()}
              className="w-full bg-[#419CC3] hover:bg-[#3484a6] text-white font-bold h-11 shadow-sm flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> AI Sedang Menyusun Soal...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" /> Generate Ulang dengan AI
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right Column: Output / Review 5 Questions */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#89B4E1] text-white text-xs flex items-center justify-center font-bold">
                  3
                </span>
                <h2 className="font-bold text-slate-800 text-sm">Hasil 5 Soal & Evaluasi AI</h2>
              </div>
              {generatedQuestions.length > 0 && (
                <Badge variant="secondary" className="font-bold text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                  {generatedQuestions.length} Soal Siap Dipublikasikan
                </Badge>
              )}
            </div>

            <div className="p-6 flex-1 flex flex-col bg-slate-50/30">
              {/* Initial Empty State */}
              {generatedQuestions.length === 0 && !isGenerating && !isExtracting && (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-16 px-4">
                  <div className="w-16 h-16 bg-[#419CC3]/10 rounded-2xl flex items-center justify-center mb-4 text-[#419CC3]">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-slate-700 text-base mb-1">Pilih Materi untuk Memulai</h3>
                  <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                    Pilih salah satu materi di dropdown sebelah kiri, sistem AI akan langsung mengekstrak dan membuat 5 butir soal secara otomatis.
                  </p>
                </div>
              )}

              {/* Extraction / AI Loading State */}
              {(isExtracting || isGenerating) && (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                  <Loader2 className="w-10 h-10 text-[#419CC3] animate-spin mb-4" />
                  <h3 className="font-bold text-slate-800 text-base">
                    {isExtracting
                      ? 'Sedang Membaca & Mengekstrak Dokumen Materi...'
                      : 'AI Sedang Merancang 5 Soal Kuis Berkualitas...'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Menganalisis poin-poin penting, opsi jawaban, dan kunci jawaban yang tepat.
                  </p>
                </div>
              )}

              {/* Questions List */}
              {generatedQuestions.length > 0 && (
                <div className="space-y-4 max-h-[560px] overflow-y-auto pr-1 custom-scrollbar">
                  {/* Summary */}
                  {generatedSummary && (
                    <div className="bg-gradient-to-r from-[#89B4E1]/15 to-[#419CC3]/5 border border-[#89B4E1]/30 p-4 rounded-xl">
                      <h4 className="font-bold text-xs text-[#419CC3] flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-3.5 h-3.5" /> Ringkasan Materi oleh AI
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{generatedSummary}</p>
                    </div>
                  )}

                  {generatedQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3"
                    >
                      <div className="flex gap-3">
                        <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          {!q.isEditing ? (
                            <div>
                              <h4 className="font-bold text-sm text-slate-800 mb-3 leading-snug">
                                {q.question_text}
                              </h4>
                              <div className="space-y-2">
                                {q.options.map((opt, oIdx) => (
                                  <div
                                    key={oIdx}
                                    className={`flex items-start gap-2.5 p-2.5 rounded-lg text-xs border transition-all ${
                                      opt.is_correct
                                        ? 'bg-emerald-50 text-emerald-900 border-emerald-200 font-semibold'
                                        : 'bg-slate-50 border-slate-100 text-slate-600'
                                    }`}
                                  >
                                    {opt.is_correct ? (
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    ) : (
                                      <Circle className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                                    )}
                                    <span className="flex-1">{opt.option_text}</span>
                                    {opt.is_correct && (
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                                        Kunci Jawaban
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleEdit(idx)}
                                className="mt-3 text-xs text-slate-500 hover:text-slate-800 p-0 h-auto font-medium cursor-pointer"
                              >
                                <Pencil className="w-3 h-3 mr-1" /> Edit Soal Ini
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-3 bg-slate-50 p-4 rounded-xl">
                              <label className="text-[11px] font-bold text-slate-600 uppercase">
                                Pertanyaan Soal
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
                                className="text-xs bg-white font-medium"
                              />

                              <label className="text-[11px] font-bold text-slate-600 uppercase block">
                                Pilihan Jawaban (Pilih Radio untuk Menentukan Kunci Jawaban)
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
                                  <Check className="w-3.5 h-3.5 mr-1" /> Selesai Mengedit
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

            {/* Save Button Footer */}
            {generatedQuestions.length > 0 && (
              <div className="p-5 border-t border-slate-100 bg-white">
                <Button
                  onClick={handleSaveQuiz}
                  disabled={isSaving}
                  className="w-full bg-[#419CC3] hover:bg-[#3484a6] text-white font-bold h-11 shadow-sm flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Simpan & Publikasikan Kuis ke Materi
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
