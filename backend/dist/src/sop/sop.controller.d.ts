import { SopService } from './sop.service';
export declare class SopController {
    private readonly sopService;
    constructor(sopService: SopService);
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
    uploadSop(file: any, title: string, category: string): Promise<{
        success: boolean;
        data: {
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
        };
        message?: undefined;
    } | {
        success: boolean;
        message: any;
        data?: undefined;
    }>;
}
