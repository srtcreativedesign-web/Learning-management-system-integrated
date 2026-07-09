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
exports.SyncController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sync_service_1 = require("./sync.service");
const sync_user_dto_1 = require("./dto/sync-user.dto");
const sync_division_dto_1 = require("./dto/sync-division.dto");
let SyncController = class SyncController {
    syncService;
    constructor(syncService) {
        this.syncService = syncService;
    }
    async syncUser(dto) {
        return this.syncService.syncUser(dto);
    }
    async syncDivision(dto) {
        return this.syncService.syncDivision(dto);
    }
};
exports.SyncController = SyncController;
__decorate([
    (0, common_1.Post)('user'),
    (0, swagger_1.ApiOperation)({ summary: 'Sync employee data from HRIS' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User data synced successfully.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sync_user_dto_1.SyncUserDto]),
    __metadata("design:returntype", Promise)
], SyncController.prototype, "syncUser", null);
__decorate([
    (0, common_1.Post)('division'),
    (0, swagger_1.ApiOperation)({ summary: 'Sync division data from HRIS' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Division data synced successfully.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sync_division_dto_1.SyncDivisionDto]),
    __metadata("design:returntype", Promise)
], SyncController.prototype, "syncDivision", null);
exports.SyncController = SyncController = __decorate([
    (0, swagger_1.ApiTags)('Sync (Webhook)'),
    (0, common_1.Controller)('sync'),
    __metadata("design:paramtypes", [sync_service_1.SyncService])
], SyncController);
//# sourceMappingURL=sync.controller.js.map