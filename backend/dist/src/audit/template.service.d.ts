import { PrismaClient } from '@prisma/client';
export declare class TemplateService {
    private prisma;
    constructor(prisma: PrismaClient);
    findAllForOfflineSync(): Promise<({
        Checklists: {
            id: string;
            question_text: string;
            template_id: string;
        }[];
    } & {
        id: string;
        title: string;
        version: number;
    })[]>;
}
