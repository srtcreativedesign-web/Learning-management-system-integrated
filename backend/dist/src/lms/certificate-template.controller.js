"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateTemplateController = void 0;
const common_1 = require("@nestjs/common");
const certificate_template_service_1 = require("./certificate-template.service");
const certificate_pdf_service_1 = require("./certificate-pdf.service");
let CertificateTemplateController = class CertificateTemplateController {
    certificateTemplateService;
    certificatePdfService;
    constructor(certificateTemplateService, certificatePdfService) {
        this.certificateTemplateService = certificateTemplateService;
        this.certificatePdfService = certificatePdfService;
    }
    async createTemplate(data) {
        return this.certificateTemplateService.createTemplate(data);
    }
    async seedTemplates() {
        await this.certificateTemplateService.seedDefaultTemplates();
        return { message: 'Template bawaan berhasil di-seed' };
    }
    async getAllTemplates() {
        return this.certificateTemplateService.getAllTemplates();
    }
    async getIssuedCertificates() {
        return this.certificateTemplateService.getIssuedCertificates();
    }
    async getCertificatePdf(attemptId, res) {
        const pdfBuffer = await this.certificatePdfService.generate(attemptId);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="Sertifikat-${attemptId.substring(0, 8)}.pdf"`,
            'Content-Length': pdfBuffer.length,
        });
        res.end(pdfBuffer);
    }
    async verifyCertificate(identifier) {
        return this.certificateTemplateService.verifyCertificate(identifier);
    }
    async getUserCertificates(userId) {
        return this.certificateTemplateService.getUserCertificates(userId);
    }
    async getTemplate(id) {
        return this.certificateTemplateService.getTemplateById(id);
    }
    async updateTemplate(id, data) {
        return this.certificateTemplateService.updateTemplate(id, data);
    }
    async deleteTemplate(id) {
        return this.certificateTemplateService.deleteTemplate(id);
    }
};
exports.CertificateTemplateController = CertificateTemplateController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CertificateTemplateController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Post)('seed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CertificateTemplateController.prototype, "seedTemplates", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CertificateTemplateController.prototype, "getAllTemplates", null);
__decorate([
    (0, common_1.Get)('issued/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CertificateTemplateController.prototype, "getIssuedCertificates", null);
__decorate([
    (0, common_1.Get)('issued/:attemptId/pdf'),
    __param(0, (0, common_1.Param)('attemptId')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CertificateTemplateController.prototype, "getCertificatePdf", null);
__decorate([
    (0, common_1.Get)('verify/:identifier'),
    __param(0, (0, common_1.Param)('identifier')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CertificateTemplateController.prototype, "verifyCertificate", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CertificateTemplateController.prototype, "getUserCertificates", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CertificateTemplateController.prototype, "getTemplate", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CertificateTemplateController.prototype, "updateTemplate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CertificateTemplateController.prototype, "deleteTemplate", null);
exports.CertificateTemplateController = CertificateTemplateController = __decorate([
    (0, common_1.Controller)('certificate-templates'),
    __metadata("design:paramtypes", [certificate_template_service_1.CertificateTemplateService,
        certificate_pdf_service_1.CertificatePdfService])
], CertificateTemplateController);
//# sourceMappingURL=certificate-template.controller.js.map