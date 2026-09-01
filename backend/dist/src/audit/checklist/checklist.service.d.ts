import { PrismaClient } from '@prisma/client';
export declare class ChecklistService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    private inspectionsStore;
    getCategories(): Promise<({
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
    })[]>;
    syncStructure(categories: any[]): Promise<({
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
    })[]>;
    getInspections(): Promise<any[]>;
    saveInspection(payload: {
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
    }>;
}
