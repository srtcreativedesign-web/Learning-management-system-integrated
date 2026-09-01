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
                question: string;
                category_id: string;
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
                question: string;
                category_id: string;
            }[];
        } & {
            id: string;
            name: string;
            sort_order: number;
        })[];
    }>;
    getInspections(): Promise<{
        success: boolean;
        data: any[];
    }>;
    submitInspection(payload: {
        outlet_id?: string;
        outlet_name: string;
        auditor_name: string;
        pic_name?: string;
        inspection_date?: string;
        notes?: string;
        auditor_signature?: string;
        pic_signature?: string;
        compliance_score: number;
        is_compliant: boolean;
        total_items: number;
        ok_items: number;
        nok_items: number;
        findings?: Array<{
            checklist_point_id?: string;
            point_text?: string;
            is_compliant: boolean;
            notes?: string;
        }>;
    }): Promise<{
        success: boolean;
        message: string;
        data: {
            inspection_date: string;
            outlet_id?: string;
            outlet_name: string;
            auditor_name: string;
            pic_name?: string;
            notes?: string;
            auditor_signature?: string;
            pic_signature?: string;
            compliance_score: number;
            is_compliant: boolean;
            total_items: number;
            ok_items: number;
            nok_items: number;
            findings?: Array<{
                checklist_point_id?: string;
                point_text?: string;
                is_compliant: boolean;
                notes?: string;
            }>;
            id: string;
        };
    }>;
}
