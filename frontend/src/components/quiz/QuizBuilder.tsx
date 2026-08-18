import React, { useState } from 'react';
import { PlusCircle, Trash2, CheckCircle2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DynamicInputList, OptionItem } from '@/components/ui/DynamicInputList';

interface Question {
  id: string;
  text: string;
  type: 'MULTIPLE_CHOICE' | 'MULTIPLE_ANSWER' | 'TRUE_FALSE';
  options: OptionItem[];
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const QuizBuilder: React.FC = () => {
  const [passingScore, setPassingScore] = useState(80);
  const [certificateTemplateId, setCertificateTemplateId] = useState('');

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: generateId(),
      text: '',
      type: 'MULTIPLE_CHOICE',
      options: [
        { text: '', is_correct: true },
        { text: '', is_correct: false },
        { text: '', is_correct: false },
        { text: '', is_correct: false },
      ],
    },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: generateId(),
        text: '',
        type: 'MULTIPLE_CHOICE',
        options: [
          { text: '', is_correct: true },
          { text: '', is_correct: false },
        ],
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, updated: Partial<Question>) => {
    setQuestions(
      questions.map((q, i) => (i === index ? { ...q, ...updated } : q))
    );
  };

  const handleSave = () => {
    const payload = {
      passing_score: passingScore,
      certificate_template_id: certificateTemplateId,
      questions,
    };
    console.log('Quiz Payload:', payload);
    alert('Kuis berhasil disimpan! (Payload JSON dicatat pada console)');
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quiz Builder</h1>
          <p className="text-slate-500 text-sm mt-1">
            Buat soal kuis dan tentukan kunci jawaban untuk modul pelatihan.
          </p>
        </div>
        <Button
          onClick={handleSave}
          className="bg-[#419CC3] hover:bg-[#3484a6] text-white font-bold flex items-center gap-2 shadow-sm"
        >
          <Save className="w-4 h-4" /> Simpan Kuis
        </Button>
      </div>

      {/* Main Settings */}
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-base font-bold text-slate-800">
            Pengaturan Utama
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">
              Nilai Minimal Kelulusan (Passing Score)
            </label>
            <Input
              type="number"
              min={0}
              max={100}
              value={passingScore}
              onChange={(e) => setPassingScore(Number(e.target.value))}
              className="bg-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase">
              Template Sertifikat
            </label>
            <select
              value={certificateTemplateId}
              onChange={(e) => setCertificateTemplateId(e.target.value)}
              className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-xs focus:outline-hidden focus:ring-1 focus:ring-[#419CC3]"
            >
              <option value="">Tidak ada sertifikat</option>
              <option value="template-1">Sertifikat Kelulusan Standar</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((q, qIndex) => (
          <Card key={q.id} className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="py-3 px-5 border-b border-slate-100 bg-slate-50/60 flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                  {qIndex + 1}
                </span>
                <select
                  value={q.type}
                  onChange={(e) =>
                    updateQuestion(qIndex, {
                      type: e.target.value as Question['type'],
                    })
                  }
                  className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 shadow-xs"
                >
                  <option value="MULTIPLE_CHOICE">Pilihan Ganda (1 Jawaban)</option>
                  <option value="MULTIPLE_ANSWER">Pilihan Ganda (Banyak Jawaban)</option>
                  <option value="TRUE_FALSE">Benar / Salah</option>
                </select>
              </div>

              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Teks Pertanyaan
                </label>
                <Textarea
                  value={q.text}
                  onChange={(e) => updateQuestion(qIndex, { text: e.target.value })}
                  placeholder="Tulis pertanyaan di sini..."
                  rows={2}
                  className="resize-none text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase">
                  Pilihan Jawaban
                </label>
                <DynamicInputList
                  value={q.options}
                  onChange={(options) => updateQuestion(qIndex, { options })}
                  type={q.type}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Question Button */}
      <button
        type="button"
        onClick={addQuestion}
        className="w-full py-4 border-2 border-dashed border-slate-300 hover:border-[#419CC3] hover:bg-[#419CC3]/5 rounded-2xl text-slate-500 hover:text-[#419CC3] font-bold text-sm transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
      >
        <PlusCircle className="w-5 h-5" />
        Tambah Pertanyaan Baru
      </button>
    </div>
  );
};
