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
let CertificateTemplateController = class CertificateTemplateController {
    certificateTemplateService;
    constructor(certificateTemplateService) {
        this.certificateTemplateService = certificateTemplateService;
    }
    async createTemplate(data) {
        return this.certificateTemplateService.createTemplate(data);
    }
    async getAllTemplates() {
        return this.certificateTemplateService.getAllTemplates();
    }
    async getTemplate(id) {
        return this.certificateTemplateService.getTemplateById(id);
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
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CertificateTemplateController.prototype, "getAllTemplates", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CertificateTemplateController.prototype, "getTemplate", null);
exports.CertificateTemplateController = CertificateTemplateController = __decorate([
    (0, common_1.Controller)('certificate-templates'),
    __metadata("design:paramtypes", [certificate_template_service_1.CertificateTemplateService])
], CertificateTemplateController);
//# sourceMappingURL=certificate-template.controller.js.map