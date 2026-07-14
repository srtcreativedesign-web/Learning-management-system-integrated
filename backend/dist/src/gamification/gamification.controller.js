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
exports.GamificationController = void 0;
const common_1 = require("@nestjs/common");
const gamification_service_1 = require("./gamification.service");
const swagger_1 = require("@nestjs/swagger");
let GamificationController = class GamificationController {
    gamificationService;
    constructor(gamificationService) {
        this.gamificationService = gamificationService;
    }
    async getProfile(hrisUserId) {
        return this.gamificationService.getProfile(hrisUserId);
    }
    async getLeaderboard(search) {
        return this.gamificationService.getLeaderboard(search);
    }
    async adjustXp(payload) {
        return this.gamificationService.adjustXp(payload);
    }
};
exports.GamificationController = GamificationController;
__decorate([
    (0, common_1.Get)('profile/:hrisUserId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get gamification profile (XP & Rank) for a user' }),
    __param(0, (0, common_1.Param)('hrisUserId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)('leaderboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get gamification leaderboard' }),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "getLeaderboard", null);
__decorate([
    (0, common_1.Post)('adjust-xp'),
    (0, swagger_1.ApiOperation)({ summary: 'Manually adjust XP for a user' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GamificationController.prototype, "adjustXp", null);
exports.GamificationController = GamificationController = __decorate([
    (0, swagger_1.ApiTags)('Gamification'),
    (0, common_1.Controller)('api/gamification'),
    __metadata("design:paramtypes", [gamification_service_1.GamificationService])
], GamificationController);
//# sourceMappingURL=gamification.controller.js.map