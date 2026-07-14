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
        certificate_template_id: string | null;
        course_material_id: string;
    }>;
    getAllQuizzes(): Promise<({
        _count: {
            Questions: number;
            EmployeeQuizAttempts: number;
        };
        Material: {
            Course: {
                id: string;
                description: string | null;
                title: string;
                thumbnail_url: string | null;
                reward_points: number;
                due_date: Date | null;
            };
        } & {
            id: string;
            type: string;
            content_url: string | null;
            min_read_time: number | null;
            course_id: string;
        };
    } & {
        id: string;
        passing_score: number;
        certificate_template_id: string | null;
        course_material_id: string;
    })[]>;
    getAllAttempts(): Promise<({
        User: {
            hris_user_id: string;
            full_name: string;
            current_rank: string;
        };
        Quiz: {
            Material: {
                Course: {
                    id: string;
                    description: string | null;
                    title: string;
                    thumbnail_url: string | null;
                    reward_points: number;
                    due_date: Date | null;
                };
            } & {
                id: string;
                type: string;
                content_url: string | null;
                min_read_time: number | null;
                course_id: string;
            };
        } & {
            id: string;
            passing_score: number;
            certificate_template_id: string | null;
            course_material_id: string;
        };
    } & {
        id: string;
        user_id: string;
        quiz_id: string;
        score: number;
        is_passed: boolean;
        xp_awarded: number;
        answers_detail: import("@prisma/client/runtime/client").JsonValue | null;
        created_at: Date;
    })[]>;
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
            type: string;
            question_text: string;
        })[];
    } & {
        id: string;
        passing_score: number;
        certificate_template_id: string | null;
        course_material_id: string;
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
        xp_awarded: number;
    }>;
}
