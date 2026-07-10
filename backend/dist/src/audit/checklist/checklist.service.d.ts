import { PrismaClient } from '@prisma/client';
export declare class ChecklistService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    getCategories(): Promise<({
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
    })[]>;
    syncStructure(categories: any[]): Promise<({
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
    })[]>;
}
