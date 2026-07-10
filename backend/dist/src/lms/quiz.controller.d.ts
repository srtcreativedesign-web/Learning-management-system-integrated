import { QuizService } from './quiz.service';
import { AiService } from './ai.service';
import { PrismaClient } from '@prisma/client';
export declare class QuizController {
    private readonly quizService;
    private readonly aiService;
    private readonly prisma;
    constructor(quizService: QuizService, aiService: AiService, prisma: PrismaClient);
    createQuizDraft(payload: any): Promise<{
        id: string;
        passing_score: number;
        course_material_id: string;
        certificate_template_id: string | null;
    }>;
    getQuizByMaterial(materialId: string): Promise<{
        Questions: ({
            Options: {
                id: string;
                question_id: string;
                option_text: string;
            }[];
        } & {
            id: string;
            quiz_id: string;
            question_text: string;
            type: string;
        })[];
    } & {
        id: string;
        passing_score: number;
        course_material_id: string;
        certificate_template_id: string | null;
    }>;
    extractPdfText(courseId: string): Promise<{
        success: boolean;
        text: string;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
        text?: undefined;
    }>;
    generateQuiz(body: {
        materialText: string;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            summary: string;
            questions: any[];
        };
    }>;
    submitQuiz(quizId: string, payload: any): Promise<{
        attempt_id: string;
        score: number;
        is_passed: boolean;
        passing_score: number;
    }>;
}
