import { PrismaClient } from '@prisma/client';
export declare class CertificateTemplateService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    createTemplate(data: {
        name: string;
        bg_image_url: string;
        name_pos_x: number;
        name_pos_y: number;
        name_font_size?: number;
        name_font_color?: string;
    }): Promise<{
        id: string;
        name: string;
        bg_image_url: string;
        name_pos_x: number;
        name_pos_y: number;
        name_font_size: number;
        name_font_color: string;
    }>;
    getAllTemplates(): Promise<{
        id: string;
        name: string;
        bg_image_url: string;
        name_pos_x: number;
        name_pos_y: number;
        name_font_size: number;
        name_font_color: string;
    }[]>;
    getTemplateById(id: string): Promise<{
        id: string;
        name: string;
        bg_image_url: string;
        name_pos_x: number;
        name_pos_y: number;
        name_font_size: number;
        name_font_color: string;
    }>;
}
