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
Output harus dalam format JSON object murni dengan key "summary" (tipe string) dan key "questions" (tipe array).
Contoh struktur JSON:
{
  "questions": [
    {
      "question_text": "Apa tujuan dari sistem X?",
      "type": "MULTIPLE_CHOICE",
      "options": [
        { "option_text": "Untuk efisiensi", "is_correct": true },
        { "option_text": "Untuk membuang waktu", "is_correct": false }
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

      const responseContent = chatCompletion.choices[0]?.message?.content || '{}';
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
}
