import { InHouseService } from './in-house.service';
export declare class InHouseController {
    private readonly inHouseService;
    constructor(inHouseService: InHouseService);
    getChecklists(): Promise<{
        success: boolean;
        data: ({
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
        })[];
    }>;
    syncChecklists(payload: {
        categories: any[];
    }): Promise<{
        success: boolean;
        message: string;
        data: ({
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
        })[];
    }>;
    getSessions(outletId?: string, status?: string): Promise<{
        success: boolean;
        data: ({
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
        })[];
    }>;
    getSessionById(id: string): Promise<{
        success: boolean;
        data: ({
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
        }) | null;
    }>;
    createSession(payload: {
        trainer_name?: string;
        outlet_id?: string;
        trainee_name?: string;
        training_date?: string;
        notes?: string;
        assessments: Array<{
            checklist_point_id: string;
            score: number;
            notes?: string;
        }>;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    deleteSession(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
