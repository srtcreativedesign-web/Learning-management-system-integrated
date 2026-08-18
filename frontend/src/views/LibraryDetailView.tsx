import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  BookOpen,
  HelpCircle,
  FileText,
  Download,
  Sparkles,
  CheckCircle2,
  Circle,
  Zap,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getApiUrl, API_BASE_URL } from '@/lib/api';

export const LibraryDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'materi' | 'kuis'>('materi');

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      const res = await fetch(getApiUrl(`/lms/courses/${id}`));
      if (!res.ok) throw new Error('Course not found');
      return res.json();
    },
    enabled: Boolean(id),
  });

  const material = course?.Materials?.[0];
  const quiz = material?.Quiz;

  return (
    <div className="p-4 md:p-6 w-full space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/library')}
          className="rounded-full shrink-0 border-slate-200 hover:bg-white shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-slate-600" />
        </Button>

        {isLoading ? (
          <div className="flex-1 py-10 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#419CC3]" />
          </div>
        ) : course ? (
          <div className="flex-1 w-full">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="secondary" className="font-bold text-xs bg-blue-50 text-[#419CC3]">
                {material?.type || 'UNKNOWN'}
              </Badge>
              {quiz && (
                <Badge className="font-bold text-xs bg-emerald-100 text-emerald-800 border-none">
                  Ada Kuis
                </Badge>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
              {course.title}
            </h1>
            <p className="text-slate-500 text-sm mt-1 leading-relaxed">
              {course.description}
            </p>
          </div>
        ) : null}
      </div>

      {course && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[80vh]">
          {/* Tabs Nav */}
          <div className="px-6 pt-4 border-b border-slate-100 bg-slate-50/60 flex gap-6">
            <button
              onClick={() => setActiveTab('materi')}
              className={`pb-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
                activeTab === 'materi'
                  ? 'border-[#419CC3] text-[#419CC3]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Konten Materi
            </button>
            <button
              onClick={() => setActiveTab('kuis')}
              className={`pb-3 font-bold text-sm transition-all border-b-2 flex items-center gap-2 ${
                activeTab === 'kuis'
                  ? 'border-[#419CC3] text-[#419CC3]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <HelpCircle className="w-4 h-4" /> Kuis Evaluasi
            </button>
          </div>

          {/* TAB MATERI */}
          {activeTab === 'materi' && (
            <div className="flex-1">
              {material?.content_url ? (
                <div className="w-full h-[85vh] bg-slate-100">
                  {material.type.toUpperCase() === 'PDF' ? (
                    <iframe
                      src={`${API_BASE_URL}${material.content_url}`}
                      className="w-full h-full border-none"
                      title="PDF Viewer"
                    />
                  ) : material.type.toUpperCase() === 'VIDEO' ||
                    material.type.toUpperCase() === 'MP4' ? (
                    <video
                      src={`${API_BASE_URL}${material.content_url}`}
                      controls
                      className="w-full h-auto max-h-[800px] bg-slate-900 mx-auto"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-20">
                      <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mb-6 text-[#419CC3]">
                        <FileText className="w-10 h-10" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-700 mb-2">File Tersedia</h3>
                      <p className="text-slate-500 text-sm mb-6 max-w-md text-center">
                        Format file ini tidak dapat dipratinjau langsung. Silakan unduh untuk melihat
                        isinya.
                      </p>
                      <a
                        href={`${API_BASE_URL}${material.content_url}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button className="bg-[#419CC3] hover:bg-[#3484a6] text-white font-bold shadow-md">
                          <Download className="w-4 h-4 mr-2" /> Unduh File Sekarang
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-24 bg-white">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700">Belum ada lampiran materi</h3>
                  <p className="text-slate-500 text-sm mt-1">
                    Materi ini hanya berisi teks deskripsi tanpa file PDF/Video.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB KUIS */}
          {activeTab === 'kuis' && (
            <div className="p-6 md:p-8 flex-1">
              {quiz ? (
                <div className="space-y-6">
                  {/* Banner */}
                  <div className="flex justify-between items-center bg-gradient-to-r from-[#89B4E1]/15 to-[#419CC3]/5 p-6 rounded-2xl border border-[#89B4E1]/30">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-xs text-[#419CC3]">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#419CC3]">Daftar Soal Kuis</h3>
                        <p className="text-xs text-slate-600">
                          Kuis ini telah di-generate dan siap dikerjakan oleh karyawan.
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="px-4 py-1.5 font-bold text-xs">
                      {quiz.Questions?.length || 0} Soal
                    </Badge>
                  </div>

                  {/* Questions */}
                  <div className="space-y-4">
                    {quiz.Questions?.map((q: any, idx: number) => (
                      <div
                        key={q.id}
                        className="bg-white border border-slate-200 hover:border-[#89B4E1] transition-colors rounded-2xl p-6 shadow-xs"
                      >
                        <div className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold text-sm flex items-center justify-center shrink-0">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-800 text-base mb-4">
                              {q.question_text}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {q.Options?.map((opt: any) => (
                                <div
                                  key={opt.id}
                                  className={`flex items-start gap-3 p-3.5 rounded-xl border text-sm transition-all ${
                                    opt.is_correct
                                      ? 'bg-emerald-50/70 border-emerald-300 font-bold text-emerald-900 shadow-xs'
                                      : 'bg-slate-50 border-slate-200 text-slate-700'
                                  }`}
                                >
                                  {opt.is_correct ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                  ) : (
                                    <Circle className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                                  )}
                                  <span className="leading-relaxed">{opt.option_text}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-white shadow-xs rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#419CC3]">
                    <HelpCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">Belum ada Kuis</h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                    Materi ini belum dilengkapi dengan kuis evaluasi AI.
                  </p>
                  <Button
                    onClick={() => navigate(`/library/generate-quiz?courseId=${course.id}`)}
                    className="bg-[#419CC3] hover:bg-[#3484a6] text-white font-bold shadow-md"
                  >
                    <Zap className="w-4 h-4 mr-2" /> Generate Kuis Sekarang
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
