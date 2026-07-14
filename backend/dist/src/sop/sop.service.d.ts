import { PrismaClient } from '@prisma/client';
import { AiService } from '../lms/ai.service';
export declare class SopService {
    private prisma;
    private aiService;
    constructor(prisma: PrismaClient, aiService: AiService);
    getAllSops(category?: string): Promise<({
        _count: {
            Points: number;
        };
        Points: {
            id: string;
            description: string | null;
            title: string;
            order_num: number;
            sop_id: string;
        }[];
    } & {
        id: string;
        created_at: Date;
        title: string;
        category: string;
        source_pdf: string | null;
        updated_at: Date;
    })[]>;
    getSopById(id: string): Promise<({
        Points: {
            id: string;
            description: string | null;
            title: string;
            order_num: number;
            sop_id: string;
        }[];
    } & {
        id: string;
        created_at: Date;
        title: string;
        category: string;
        source_pdf: string | null;
        updated_at: Date;
    }) | null>;
    uploadAndProcessSop(file: any, title: string, category: string): Promise<{
        Points: {
            id: string;
            description: string | null;
            title: string;
            order_num: number;
            sop_id: string;
        }[];
    } & {
        id: string;
        created_at: Date;
        title: string;
        category: string;
        source_pdf: string | null;
        updated_at: Date;
    }>;
}
