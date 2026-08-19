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
exports.InHouseController = void 0;
const common_1 = require("@nestjs/common");
const in_house_service_1 = require("./in-house.service");
let InHouseController = class InHouseController {
    inHouseService;
    constructor(inHouseService) {
        this.inHouseService = inHouseService;
    }
    async getChecklists() {
        const data = await this.inHouseService.getCategories();
        return {
            success: true,
            data,
        };
    }
    async syncChecklists(payload) {
        const data = await this.inHouseService.syncStructure(payload.categories);
        return {
            success: true,
            message: 'Checklist in-house training berhasil diperbarui',
            data,
        };
    }
    async getSessions(outletId, status) {
        const data = await this.inHouseService.getSessions({ outletId, status });
        return {
            success: true,
            data,
        };
    }
    async getSessionById(id) {
        const data = await this.inHouseService.getSessionById(id);
        return {
            success: true,
            data,
        };
    }
    async createSession(payload) {
        const data = await this.inHouseService.saveSession(payload);
        return {
            success: true,
            message: 'Penilaian sesi in-house training berhasil disimpan dan dikalkulasi',
            data,
        };
    }
    async deleteSession(id) {
        await this.inHouseService.deleteSession(id);
        return {
            success: true,
            message: 'Sesi training berhasil dihapus',
        };
    }
};
exports.InHouseController = InHouseController;
__decorate([
    (0, common_1.Get)('checklists'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InHouseController.prototype, "getChecklists", null);
__decorate([
    (0, common_1.Post)('checklists/sync'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InHouseController.prototype, "syncChecklists", null);
__decorate([
    (0, common_1.Get)('sessions'),
    __param(0, (0, common_1.Query)('outlet_id')),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], InHouseController.prototype, "getSessions", null);
__decorate([
    (0, common_1.Get)('sessions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InHouseController.prototype, "getSessionById", null);
__decorate([
    (0, common_1.Post)('sessions'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InHouseController.prototype, "createSession", null);
__decorate([
    (0, common_1.Delete)('sessions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InHouseController.prototype, "deleteSession", null);
exports.InHouseController = InHouseController = __decorate([
    (0, common_1.Controller)('in-house'),
    __metadata("design:paramtypes", [in_house_service_1.InHouseService])
], InHouseController);
//# sourceMappingURL=in-house.controller.js.map