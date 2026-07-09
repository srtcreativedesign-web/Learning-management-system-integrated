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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let SyncService = class SyncService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async syncUser(dto) {
        return this.prisma.userShadow.upsert({
            where: { hris_user_id: dto.hris_user_id },
            update: {
                full_name: dto.full_name,
                email: dto.email,
            },
            create: {
                hris_user_id: dto.hris_user_id,
                full_name: dto.full_name,
                email: dto.email,
            },
        });
    }
    async syncDivision(dto) {
        return this.prisma.divisionShadow.upsert({
            where: { hris_division_id: dto.hris_division_id },
            update: {
                name: dto.name,
            },
            create: {
                hris_division_id: dto.hris_division_id,
                name: dto.name,
            },
        });
    }
};
exports.SyncService = SyncService;
exports.SyncService = SyncService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], SyncService);
//# sourceMappingURL=sync.service.js.map