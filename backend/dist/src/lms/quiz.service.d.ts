import { PrismaClient } from '@prisma/client';
export declare class QuizService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    createQuiz(data: any): Promise<{
        id: string;
        course_material_id: string;
        passing_score: number;
        certificate_template_id: string | null;
    }>;
    getQuizByMaterialId(materialId: string): Promise<{
        Questions: ({
            Options: {
                id: string;
                question_id: string;
                option_text: string;
            }[];
        } & {
            id: string;
            type: string;
            quiz_id: string;
            question_text: string;
        })[];
    } & {
        id: string;
        course_material_id: string;
        passing_score: number;
        certificate_template_id: string | null;
    }>;
    submitQuiz(quizId: string, payload: {
        user_id: string;
        answers: {
            question_id: string;
            selected_option_ids: string[];
        }[];
    }): Promise<{
        attempt_id: string;
        score: number;
        is_passed: boolean;
        passing_score: number;
    }>;
}
