import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
const pdfParse = require('pdf-parse');
import * as fs from 'fs';

@Injectable()
export class AiService {
  private groq: Groq;

  constructor() {
    this.groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  async extractTextFromPdf(filePath: string): Promise<string> {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      
      // Temporarily silence annoying PDF.js TT warnings
      const originalConsoleWarn = console.warn;
      console.warn = function (...args) {
        if (args[0] && typeof args[0] === 'string' && args[0].includes('Warning: TT: undefined function:')) return;
        originalConsoleWarn.apply(console, args);
      };

      const data = await pdfParse(dataBuffer);
      
      // Restore console.warn
      console.warn = originalConsoleWarn;

      return data.text;
    } catch (error) {
      console.error('Error parsing PDF:', error);
      throw new Error('Gagal mengekstrak teks dari PDF.');
    }
  }

  async generateQuiz(text: string): Promise<{summary: string, questions: any[]}> {
    const prompt = `Anda adalah ahli pembuat soal kuis.
Baca teks materi berikut secara menyeluruh dan lakukan dua hal:
1. Buatlah RINGKASAN (summary) yang komprehensif dan mendetail dari materi tersebut untuk membantu pengguna me-review seluruh poin-poin krusial isi materi. Panjang ringkasan harus proporsional dengan panjang materi aslinya.
2. Buatlah 5 soal pilihan ganda (Multiple Choice) berbahasa Indonesia sesuai point point penting yang ada di dalam materi. hindari soal generik.

Setiap soal harus memiliki 3-4 pilihan jawaban (options), dengan SATU jawaban yang benar.
Output HARUS BERUPA FORMAT JSON MURNI tanpa markdown block (jangan gunakan \`\`\`json).
Output JSON harus memiliki key "summary" (tipe string) dan key "questions" (tipe array).

Contoh struktur JSON yang WAJIB DIIKUTI:
{
  "summary": "Ini adalah ringkasan dari materi...",
  "questions": [
    {
      "question_text": "Apa ibu kota dari Indonesia?",
      "type": "MULTIPLE_CHOICE",
      "options": [
        { "option_text": "Jakarta", "is_correct": true },
        { "option_text": "Bandung", "is_correct": false },
        { "option_text": "Surabaya", "is_correct": false }
      ]
    }
  ]
}

Teks Materi:
${text.substring(0, 50000)}
`;

    try {
      const chatCompletion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
        temperature: 0.3,
        response_format: { type: 'json_object' }
      });

      let responseContent = chatCompletion.choices[0]?.message?.content || '{}';
      
      // Ekstrak hanya blok JSON jika model menambahkan teks pengantar
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        responseContent = jsonMatch[0];
      }

      const parsed = JSON.parse(responseContent);
      return {
        summary: parsed.summary || 'Tidak ada ringkasan yang dihasilkan.',
        questions: parsed.questions || []
      };
    } catch (error) {
      console.error('AI Error:', error);
      return { summary: '', questions: [] };
    }
  }
  async extractSopPoints(text: string): Promise<{ points: { title: string, description: string }[] }> {
    const prompt = `Anda adalah asisten AI yang ahli dalam mengekstrak Standar Operasional Prosedur (SOP).
Baca teks dokumen SOP berikut ini secara menyeluruh dan ekstrak menjadi poin-poin langkah kerja.

Setiap langkah kerja harus memiliki:
1. "title": Judul singkat langkah kerja tersebut (maksimal 1 kalimat).
2. "description": Penjelasan detail dari langkah tersebut. Jika ada poin-poin tambahan atau peringatan, masukkan ke dalam description ini secara deskriptif.

Output HARUS BERUPA FORMAT JSON MURNI tanpa markdown block (jangan gunakan \`\`\`json).
Output JSON harus memiliki key "points" (tipe array of objects).
Contoh struktur JSON yang WAJIB DIIKUTI:
{
  "points": [
    {
      "title": "Tahap 1: Persiapan Area Kerja",
      "description": "Pastikan area kerja bersih dari debu dan kotoran. Gunakan alat pelindung diri sebelum memulai."
    }
  ]
}

Teks Materi:
${text.substring(0, 50000)}
`;

    try {
      const chatCompletion = await this.groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
        temperature: 0.1, // Rendah agar lebih faktual
        response_format: { type: 'json_object' }
      });

      let responseContent = chatCompletion.choices[0]?.message?.content || '{}';
      
      const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        responseContent = jsonMatch[0];
      }

      const parsed = JSON.parse(responseContent);
      return {
        points: parsed.points || []
      };
    } catch (error) {
      console.error('AI SOP Error:', error);
      return { points: [] };
    }
  }
}
