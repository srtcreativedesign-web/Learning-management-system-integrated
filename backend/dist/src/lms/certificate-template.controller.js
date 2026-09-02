"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateTemplateController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const fs = __importStar(require("fs"));
const certificate_template_service_1 = require("./certificate-template.service");
const certificate_pdf_service_1 = require("./certificate-pdf.service");
let CertificateTemplateController = class CertificateTemplateController {
    certificateTemplateService;
    certificatePdfService;
    constructor(certificateTemplateService, certificatePdfService) {
        this.certificateTemplateService = certificateTemplateService;
        this.certificatePdfService = certificatePdfService;
    }
    async uploadBackground(file) {
        return {
            success: true,
            url: `/uploads/certificates/${file.filename}`,
            fileName: file.originalname,
            mimeType: file.mimetype,
        };
    }
    async uploadSignature(file) {
        return {
            success: true,
            url: `/uploads/certificates/signatures/${file.filename}`,
            fileName: file.originalname,
            mimeType: file.mimetype,
        };
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
    (0, common_1.Post)('upload-bg'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                const uploadPath = './uploads/certificates';
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath, { recursive: true });
                }
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, 'bg-' + uniqueSuffix + (0, path_1.extname)(file.originalname));
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CertificateTemplateController.prototype, "uploadBackground", null);
__decorate([
    (0, common_1.Post)('upload-signature'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (req, file, cb) => {
                const uploadPath = './uploads/certificates/signatures';
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath, { recursive: true });
                }
                cb(null, uploadPath);
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, 'sig-' + uniqueSuffix + (0, path_1.extname)(file.originalname));
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CertificateTemplateController.prototype, "uploadSignature", null);
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