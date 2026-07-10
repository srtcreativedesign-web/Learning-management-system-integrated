"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const quiz_service_1 = require("./quiz.service");
const ai_service_1 = require("./ai.service");
const client_1 = require("@prisma/client");
const path_1 = require("path");
let QuizController = class QuizController {
    quizService;
    aiService;
    prisma;
    constructor(quizService, aiService, prisma) {
        this.quizService = quizService;
        this.aiService = aiService;
        this.prisma = prisma;
    }
    async createQuizDraft(payload) {
        return this.quizService.createQuiz(payload);
    }
    async getQuizByMaterial(materialId) {
        return this.quizService.getQuizByMaterialId(materialId);
    }
    async extractPdfText(courseId) {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
            include: { Materials: true }
        });
        const pdfMat = course?.Materials.find(m => m.type.toUpperCase() === 'PDF');
        if (pdfMat && pdfMat.content_url) {
            try {
                const safeUrl = pdfMat.content_url.replace(/^\/+/, '');
                const localPath = (0, path_1.join)(__dirname, '..', '..', '..', safeUrl);
                const text = await this.aiService.extractTextFromPdf(localPath);
                return { success: true, text };
            }
            catch (e) {
                console.error("Failed extracting PDF:", e);
                return { success: false, message: 'Gagal mengekstrak PDF' };
            }
        }
        return { success: false, message: 'File PDF tidak ditemukan' };
    }
    async generateQuiz(body) {
        const text = body.materialText;
        if (!text || text.trim() === '') {
            throw new common_1.BadRequestException("Teks materi kosong atau gagal diekstrak");
        }
        const aiQuestions = await this.aiService.generateQuiz(text);
        return {
            success: true,
            message: "Soal berhasil di-generate secara cerdas oleh AI Groq",
            data: aiQuestions
        };
    }
    async submitQuiz(quizId, payload) {
        return this.quizService.submitQuiz(quizId, payload);
    }
};
exports.QuizController = QuizController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "createQuizDraft", null);
__decorate([
    (0, common_1.Get)('material/:materialId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get quiz by material ID' }),
    __param(0, (0, common_1.Param)('materialId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "getQuizByMaterial", null);
__decorate([
    (0, common_1.Get)('extract-pdf/:courseId'),
    __param(0, (0, common_1.Param)('courseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "extractPdfText", null);
__decorate([
    (0, common_1.Post)('generate'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate Quiz questions using Groq AI' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "generateQuiz", null);
__decorate([
    (0, common_1.Post)(':quizId/submit'),
    __param(0, (0, common_1.Param)('quizId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], QuizController.prototype, "submitQuiz", null);
exports.QuizController = QuizController = __decorate([
    (0, common_1.Controller)('quizzes'),
    (0, swagger_1.ApiTags)('quizzes'),
    __metadata("design:paramtypes", [quiz_service_1.QuizService,
        ai_service_1.AiService,
        client_1.PrismaClient])
], QuizController);
//# sourceMappingURL=quiz.controller.js.map