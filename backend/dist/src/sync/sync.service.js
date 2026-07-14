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
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let SyncService = class SyncService {
    prisma;
    httpService;
    constructor(prisma, httpService) {
        this.prisma = prisma;
        this.httpService = httpService;
    }
    async syncUser(dto) {
        return this.prisma.userShadow.upsert({
            where: { hris_user_id: dto.hris_user_id },
            update: {
                full_name: dto.full_name,
                email: dto.email,
                ...(dto.join_date && { join_date: new Date(dto.join_date) }),
            },
            create: {
                hris_user_id: dto.hris_user_id,
                full_name: dto.full_name,
                email: dto.email,
                join_date: dto.join_date ? new Date(dto.join_date) : null,
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
    async syncEmployeesFromHRIS() {
        const hrisUrl = (process.env.HRIS_BASE_URL || 'http://localhost:8000') + '/api/v1/lms/employees';
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(hrisUrl));
            if (!response.data || !response.data.success || !response.data.data) {
                throw new Error('Invalid response format from HRIS');
            }
            const employees = response.data.data;
            let syncedCount = 0;
            for (const emp of employees) {
                await this.prisma.userShadow.upsert({
                    where: { hris_user_id: String(emp.id) },
                    update: {
                        full_name: emp.name,
                        email: emp.email,
                        ...(emp.join_date && { join_date: new Date(emp.join_date) }),
                    },
                    create: {
                        hris_user_id: String(emp.id),
                        full_name: emp.name,
                        email: emp.email,
                        join_date: emp.join_date ? new Date(emp.join_date) : null,
                    },
                });
                syncedCount++;
            }
            return { success: true, message: `Successfully synced ${syncedCount} employees from HRIS.` };
        }
        catch (error) {
            throw new Error('Sync failed: ' + error.message);
        }
    }
    async getEmployees() {
        return this.prisma.userShadow.findMany({
            orderBy: { full_name: 'asc' },
        });
    }
};
exports.SyncService = SyncService;
exports.SyncService = SyncService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_1.PrismaClient,
        axios_1.HttpService])
], SyncService);
//# sourceMappingURL=sync.service.js.map