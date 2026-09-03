import { CertificateTemplateService } from './certificate-template.service';
export declare class CertificatePdfService {
    private readonly certificateTemplateService;
    constructor(certificateTemplateService: CertificateTemplateService);
    private getDefaultPdfmeTemplate;
    private buildTemplateFromMeta;
    private readBasePdf;
    private defaultInputs;
    generate(attemptId: string): Promise<Buffer>;
}
