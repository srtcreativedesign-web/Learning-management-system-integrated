import { PrismaClient } from '@prisma/client';
export declare class TemplateService {
    private prisma;
    constructor(prisma: PrismaClient);
    findAllForOfflineSync(): Promise<({
        Checklists: {
            id: string;
            template_id: string;
            question_text: string;
        }[];
    } & {
        id: string;
        title: string;
        version: number;
    })[]>;
}
