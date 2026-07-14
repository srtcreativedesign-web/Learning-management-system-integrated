import { PrismaClient } from '@prisma/client';
export declare class QuizService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    createQuiz(data: any): Promise<{
        id: string;
        passing_score: number;
        certificate_template_id: string | null;
        course_material_id: string;
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
    submitQuiz(quizId: string, payload: {
        hris_user_id?: string;
        user_id?: string;
        answers: {
            question_id: string;
            selected_option_ids: string[];
        }[];
    }): Promise<{
        attempt_id: string;
        score: number;
        is_passed: boolean;
        passing_score: number;
        xp_awarded: number;
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
}
