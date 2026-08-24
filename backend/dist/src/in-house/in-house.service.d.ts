import { PrismaClient } from '@prisma/client';
export declare class InHouseService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    getGradeFromScore(score: number): 'SB' | 'B' | 'C' | 'K';
    getOverallGrade(percentage: number): 'SB' | 'B' | 'C' | 'K';
    getCategories(): Promise<({
        checklists: {
            id: string;
            description: string | null;
            sort_order: number;
            category_id: string;
            question: string;
            max_score: number;
        }[];
    } & {
        id: string;
        name: string;
        sort_order: number;
    })[]>;
    syncStructure(categories: any[]): Promise<({
        checklists: {
            id: string;
            description: string | null;
            sort_order: number;
            category_id: string;
            question: string;
            max_score: number;
        }[];
    } & {
        id: string;
        name: string;
        sort_order: number;
    })[]>;
    getSessions(filters?: {
        outletId?: string;
        status?: string;
    }): Promise<({
        assessments: ({
            checklistPoint: {
                category: {
                    id: string;
                    name: string;
                    sort_order: number;
                };
            } & {
                id: string;
                description: string | null;
                sort_order: number;
                category_id: string;
                question: string;
                max_score: number;
            };
        } & {
            id: string;
            score: number;
            grade: string;
            notes: string | null;
            checklist_point_id: string;
            session_id: string;
        })[];
    } & {
        id: string;
        is_passed: boolean;
        created_at: Date;
        status: string;
        updated_at: Date;
        max_score: number;
        trainer_name: string | null;
        outlet_id: string | null;
        trainee_name: string | null;
        training_date: Date;
        total_score: number;
        percentage: number;
        grade: string;
        pic_name: string | null;
        trainer_signature: string | null;
        pic_signature: string | null;
        notes: string | null;
    })[]>;
    getSessionById(id: string): Promise<({
        assessments: ({
            checklistPoint: {
                category: {
                    id: string;
                    name: string;
                    sort_order: number;
                };
            } & {
                id: string;
                description: string | null;
                sort_order: number;
                category_id: string;
                question: string;
                max_score: number;
            };
        } & {
            id: string;
            score: number;
            grade: string;
            notes: string | null;
            checklist_point_id: string;
            session_id: string;
        })[];
    } & {
        id: string;
        is_passed: boolean;
        created_at: Date;
        status: string;
        updated_at: Date;
        max_score: number;
        trainer_name: string | null;
        outlet_id: string | null;
        trainee_name: string | null;
        training_date: Date;
        total_score: number;
        percentage: number;
        grade: string;
        pic_name: string | null;
        trainer_signature: string | null;
        pic_signature: string | null;
        notes: string | null;
    }) | null>;
    saveSession(payload: {
        trainer_name?: string;
        outlet_id?: string;
        trainee_name?: string;
        training_date?: string;
        pic_name?: string;
        trainer_signature?: string;
        pic_signature?: string;
        notes?: string;
        assessments: Array<{
            checklist_point_id: string;
            score: number;
            notes?: string;
        }>;
    }): Promise<{
        assessments: ({
            checklistPoint: {
                id: string;
                description: string | null;
                sort_order: number;
                category_id: string;
                question: string;
                max_score: number;
            };
        } & {
            id: string;
            score: number;
            grade: string;
            notes: string | null;
            checklist_point_id: string;
            session_id: string;
        })[];
    } & {
        id: string;
        is_passed: boolean;
        created_at: Date;
        status: string;
        updated_at: Date;
        max_score: number;
        trainer_name: string | null;
        outlet_id: string | null;
        trainee_name: string | null;
        training_date: Date;
        total_score: number;
        percentage: number;
        grade: string;
        pic_name: string | null;
        trainer_signature: string | null;
        pic_signature: string | null;
        notes: string | null;
    }>;
    deleteSession(id: string): Promise<{
        id: string;
        is_passed: boolean;
        created_at: Date;
        status: string;
        updated_at: Date;
        max_score: number;
        trainer_name: string | null;
        outlet_id: string | null;
        trainee_name: string | null;
        training_date: Date;
        total_score: number;
        percentage: number;
        grade: string;
        pic_name: string | null;
        trainer_signature: string | null;
        pic_signature: string | null;
        notes: string | null;
    }>;
}
