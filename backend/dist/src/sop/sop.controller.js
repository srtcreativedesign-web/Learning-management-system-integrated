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
exports.SopController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const sop_service_1 = require("./sop.service");
let SopController = class SopController {
    sopService;
    constructor(sopService) {
        this.sopService = sopService;
    }
    async getAllSops(category) {
        return this.sopService.getAllSops(category);
    }
    async getSopById(id) {
        return this.sopService.getSopById(id);
    }
    async uploadSop(file, title, category) {
        if (!file) {
            return { success: false, message: 'File is required' };
        }
        try {
            const sop = await this.sopService.uploadAndProcessSop(file, title, category);
            return { success: true, data: sop };
        }
        catch (error) {
            return { success: false, message: error.message };
        }
    }
};
exports.SopController = SopController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SopController.prototype, "getAllSops", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SopController.prototype, "getSopById", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('title')),
    __param(2, (0, common_1.Body)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], SopController.prototype, "uploadSop", null);
exports.SopController = SopController = __decorate([
    (0, common_1.Controller)('api/sop'),
    __metadata("design:paramtypes", [sop_service_1.SopService])
], SopController);
//# sourceMappingURL=sop.controller.js.map