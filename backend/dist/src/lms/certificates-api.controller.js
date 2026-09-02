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
exports.CertificatesApiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const certificate_template_service_1 = require("./certificate-template.service");
let CertificatesApiController = class CertificatesApiController {
    certificateTemplateService;
    constructor(certificateTemplateService) {
        this.certificateTemplateService = certificateTemplateService;
    }
    async getUserCertificates(hrisUserId) {
        return this.certificateTemplateService.getUserCertificatesContract(hrisUserId);
    }
};
exports.CertificatesApiController = CertificatesApiController;
__decorate([
    (0, common_1.Get)('user/:hris_user_id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Daftar sertifikat kelulusan karyawan untuk aplikasi mobile SobatHR',
        description: 'Mengembalikan daftar sertifikat dengan field id, certificate_number, course_title, score, completed_at, dan file_url.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Daftar sertifikat (bisa kosong jika belum ada)',
    }),
    __param(0, (0, common_1.Param)('hris_user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CertificatesApiController.prototype, "getUserCertificates", null);
exports.CertificatesApiController = CertificatesApiController = __decorate([
    (0, swagger_1.ApiTags)('Certificates API (SobatHR Contract)'),
    (0, common_1.Controller)('api/certificates'),
    __metadata("design:paramtypes", [certificate_template_service_1.CertificateTemplateService])
], CertificatesApiController);
//# sourceMappingURL=certificates-api.controller.js.map