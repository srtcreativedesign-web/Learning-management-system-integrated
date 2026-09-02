import { PrismaClient } from '@prisma/client';
export declare class CertificateTemplateService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    createTemplate(data: {
        name: string;
        bg_image_url?: string;
        base_pdf_url?: string;
        pdfme_template?: any;
        name_pos_x?: number;
        name_pos_y?: number;
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
        pdfme_template: import("@prisma/client/runtime/client").JsonValue | null;
        base_pdf_url: string | null;
    }>;
    getAllTemplates(): Promise<({
        _count: {
            Quizzes: number;
        };
    } & {
        id: string;
        name: string;
        bg_image_url: string;
        name_pos_x: number;
        name_pos_y: number;
        name_font_size: number;
        name_font_color: string;
        pdfme_template: import("@prisma/client/runtime/client").JsonValue | null;
        base_pdf_url: string | null;
    })[]>;
    getTemplateById(id: string): Promise<{
        Quizzes: ({
            Material: {
                Course: {
                    id: string;
                    description: string | null;
                    title: string;
                    thumbnail_url: string | null;
                    reward_points: number;
                    due_date: Date | null;
                };
            } & {
                id: string;
                type: string;
                content_url: string | null;
                min_read_time: number | null;
                course_id: string;
            };
        } & {
            id: string;
            passing_score: number;
            certificate_template_id: string | null;
            course_material_id: string;
        })[];
    } & {
        id: string;
        name: string;
        bg_image_url: string;
        name_pos_x: number;
        name_pos_y: number;
        name_font_size: number;
        name_font_color: string;
        pdfme_template: import("@prisma/client/runtime/client").JsonValue | null;
        base_pdf_url: string | null;
    }>;
    updateTemplate(id: string, data: {
        name?: string;
        bg_image_url?: string;
        base_pdf_url?: string;
        pdfme_template?: any;
        name_pos_x?: number;
        name_pos_y?: number;
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
        pdfme_template: import("@prisma/client/runtime/client").JsonValue | null;
        base_pdf_url: string | null;
    }>;
    deleteTemplate(id: string): Promise<{
        id: string;
        name: string;
        bg_image_url: string;
        name_pos_x: number;
        name_pos_y: number;
        name_font_size: number;
        name_font_color: string;
        pdfme_template: import("@prisma/client/runtime/client").JsonValue | null;
        base_pdf_url: string | null;
    }>;
    seedDefaultTemplates(): Promise<void>;
    getIssuedCertificates(): Promise<any>;
    verifyCertificate(identifier: string): Promise<{
        valid: boolean;
        certificate: any;
        issuer: string;
        verification_timestamp: string;
    }>;
    getUserCertificates(userId: string): Promise<any>;
    getUserCertificatesContract(hrisUserId: string): Promise<{
        data: any;
    }>;
}
