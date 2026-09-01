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
exports.ChecklistController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const checklist_service_1 = require("./checklist.service");
let ChecklistController = class ChecklistController {
    checklistService;
    constructor(checklistService) {
        this.checklistService = checklistService;
    }
    async getStructure() {
        const data = await this.checklistService.getCategories();
        return {
            success: true,
            data,
        };
    }
    async syncStructure(payload) {
        const data = await this.checklistService.syncStructure(payload.categories);
        return {
            success: true,
            message: 'Struktur checklist audit berhasil disinkronkan',
            data,
        };
    }
    async getInspections() {
        const data = await this.checklistService.getInspections();
        return {
            success: true,
            data,
        };
    }
    async submitInspection(payload) {
        const data = await this.checklistService.saveInspection(payload);
        return {
            success: true,
            message: 'Hasil inspeksi audit lapangan berhasil disimpan',
            data,
        };
    }
};
exports.ChecklistController = ChecklistController;
__decorate([
    (0, common_1.Get)('checklist'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit checklist categories and points' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChecklistController.prototype, "getStructure", null);
__decorate([
    (0, common_1.Post)('checklist/sync'),
    (0, swagger_1.ApiOperation)({ summary: 'Sync and update audit checklist categories and points' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChecklistController.prototype, "syncStructure", null);
__decorate([
    (0, common_1.Get)('inspections'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all submitted audit inspection records' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChecklistController.prototype, "getInspections", null);
__decorate([
    (0, common_1.Post)('inspections'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a new audit inspection with OK/NOK findings' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChecklistController.prototype, "submitInspection", null);
exports.ChecklistController = ChecklistController = __decorate([
    (0, common_1.Controller)('audit'),
    (0, swagger_1.ApiTags)('audit'),
    __metadata("design:paramtypes", [checklist_service_1.ChecklistService])
], ChecklistController);
//# sourceMappingURL=checklist.controller.js.map