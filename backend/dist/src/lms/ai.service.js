"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const pdfParse = require('pdf-parse');
const fs = __importStar(require("fs"));
let AiService = class AiService {
    groq;
    constructor() {
        this.groq = new groq_sdk_1.default({ apiKey: process.env.GROQ_API_KEY });
    }
    async extractTextFromPdf(filePath) {
        try {
            const dataBuffer = fs.readFileSync(filePath);
            const originalConsoleWarn = console.warn;
            console.warn = function (...args) {
                if (args[0] && typeof args[0] === 'string' && args[0].includes('Warning: TT: undefined function:'))
                    return;
                originalConsoleWarn.apply(console, args);
            };
            const data = await pdfParse(dataBuffer);
            console.warn = originalConsoleWarn;
            return data.text;
        }
        catch (error) {
            console.error('Error parsing PDF:', error);
            throw new Error('Gagal mengekstrak teks dari PDF.');
        }
    }
    async generateQuiz(text) {
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
        }
        catch (error) {
            console.error('AI Error:', error);
            return { summary: '', questions: [] };
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AiService);
//# sourceMappingURL=ai.service.js.map