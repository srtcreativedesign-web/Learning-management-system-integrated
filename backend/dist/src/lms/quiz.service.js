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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let QuizService = class QuizService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createQuiz(data) {
        const { course_material_id, passing_score, certificate_template_id, questions } = data;
        return this.prisma.$transaction(async (tx) => {
            const quiz = await tx.quiz.create({
                data: {
                    course_material_id,
                    passing_score,
                    certificate_template_id,
                },
            });
            for (const q of questions) {
                await tx.quizQuestion.create({
                    data: {
                        quiz_id: quiz.id,
                        question_text: q.text,
                        type: q.type || 'MULTIPLE_CHOICE',
                        Options: {
                            create: q.options.map((opt) => ({
                                option_text: opt.text,
                                is_correct: opt.is_correct,
                            })),
                        },
                    },
                });
            }
            return quiz;
        });
    }
    async getQuizByMaterialId(materialId) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { course_material_id: materialId },
            include: {
                Questions: {
                    include: {
                        Options: {
                            select: {
                                id: true,
                                question_id: true,
                                option_text: true,
                            },
                        },
                    },
                },
            },
        });
        if (!quiz)
            throw new common_1.NotFoundException('Quiz not found for this material');
        return quiz;
    }
    async submitQuiz(quizId, payload) {
        const { user_id, answers } = payload;
        const quiz = await this.prisma.quiz.findUnique({
            where: { id: quizId },
            include: {
                Questions: {
                    include: { Options: true },
                },
            },
        });
        if (!quiz)
            throw new common_1.NotFoundException('Quiz not found');
        let correctCount = 0;
        const totalQuestions = quiz.Questions.length;
        for (const userAns of answers) {
            const question = quiz.Questions.find((q) => q.id === userAns.question_id);
            if (!question)
                continue;
            const correctOptionIds = question.Options.filter((opt) => opt.is_correct).map((opt) => opt.id);
            const isExactlyCorrect = correctOptionIds.length === userAns.selected_option_ids.length &&
                correctOptionIds.every((id) => userAns.selected_option_ids.includes(id));
            if (isExactlyCorrect) {
                correctCount++;
            }
        }
        const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
        const is_passed = score >= quiz.passing_score;
        const attempt = await this.prisma.employeeQuizAttempt.create({
            data: {
                user_id,
                quiz_id: quiz.id,
                score,
                is_passed,
            },
        });
        return {
            attempt_id: attempt.id,
            score,
            is_passed,
            passing_score: quiz.passing_score,
        };
    }
};
exports.QuizService = QuizService;
exports.QuizService = QuizService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], QuizService);
//# sourceMappingURL=quiz.service.js.map