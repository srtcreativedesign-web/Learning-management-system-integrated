import { CertificateTemplateService } from './certificate-template.service';
export declare class CertificateTemplateController {
    private readonly certificateTemplateService;
    constructor(certificateTemplateService: CertificateTemplateService);
    createTemplate(data: any): Promise<{
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
    getTemplate(id: string): Promise<{
        id: string;
        name: string;
        bg_image_url: string;
        name_pos_x: number;
        name_pos_y: number;
        name_font_size: number;
        name_font_color: string;
    }>;
}
