import { CertificateTemplateService } from './certificate-template.service';
export declare class CertificatesApiController {
    private readonly certificateTemplateService;
    constructor(certificateTemplateService: CertificateTemplateService);
    getUserCertificates(hrisUserId: string): Promise<{
        data: any;
    }>;
}
