import { ChecklistService } from './checklist.service';
export declare class ChecklistController {
    private readonly checklistService;
    constructor(checklistService: ChecklistService);
    getStructure(): Promise<{
        success: boolean;
        data: ({
            checklists: {
                id: string;
                sort_order: number;
                category_id: string;
                question: string;
            }[];
        } & {
            id: string;
            name: string;
            sort_order: number;
        })[];
    }>;
    syncStructure(payload: {
        categories: any[];
    }): Promise<{
        success: boolean;
        message: string;
        data: ({
            checklists: {
                id: string;
                sort_order: number;
                category_id: string;
                question: string;
            }[];
        } & {
            id: string;
            name: string;
            sort_order: number;
        })[];
    }>;
}
