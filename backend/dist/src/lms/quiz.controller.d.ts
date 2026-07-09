import { QuizService } from './quiz.service';
export declare class QuizController {
    private readonly quizService;
    constructor(quizService: QuizService);
    createQuizDraft(payload: any): Promise<{
        id: string;
        course_material_id: string;
        passing_score: number;
        certificate_template_id: string | null;
    }>;
    getQuizForTake(materialId: string): Promise<{
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
    submitQuiz(quizId: string, payload: any): Promise<{
        attempt_id: string;
        score: number;
        is_passed: boolean;
        passing_score: number;
    }>;
}
