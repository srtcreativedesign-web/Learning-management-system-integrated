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
var OutletService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutletService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let OutletService = OutletService_1 = class OutletService {
    prisma;
    httpService;
    logger = new common_1.Logger(OutletService_1.name);
    constructor(prisma, httpService) {
        this.prisma = prisma;
        this.httpService = httpService;
    }
    async findAll() {
        return this.prisma.outlet.findMany({
            orderBy: { name: 'asc' },
        });
    }
    async syncFromHRIS() {
        const hrisUrl = (process.env.HRIS_BASE_URL || 'http://localhost:8000') + '/api/v1/lms/outlets';
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(hrisUrl, {
                timeout: 10000,
            }));
            if (!response.data || !response.data.success || !response.data.data) {
                throw new Error('Invalid response format from HRIS');
            }
            const items = response.data.data;
            let syncedCount = 0;
            for (const item of items) {
                const org = item.organization || item;
                if (!org || !org.id || !org.name)
                    continue;
                const hrisId = Number(org.id);
                const name = String(org.name);
                const address = org.address ? String(org.address) : null;
                const latitude = org.latitude != null ? String(org.latitude) : null;
                const longitude = org.longitude != null ? String(org.longitude) : null;
                const deviceCode = item.device_code || org.code || null;
                const deviceName = item.device_name || (org.code ? `Outlet ${org.code}` : null);
                const deviceId = item.device_id || (item.id !== org.id ? item.id : null);
                const status = item.status || 'active';
                await this.prisma.outlet.upsert({
                    where: { hris_id: hrisId },
                    update: {
                        name,
                        address,
                        latitude,
                        longitude,
                        device_id: deviceId ? Number(deviceId) : null,
                        device_code: deviceCode,
                        device_name: deviceName,
                        status,
                    },
                    create: {
                        hris_id: hrisId,
                        name,
                        address,
                        latitude,
                        longitude,
                        device_id: deviceId ? Number(deviceId) : null,
                        device_code: deviceCode,
                        device_name: deviceName,
                        status,
                    },
                });
                syncedCount++;
            }
            this.logger.log(`Successfully synced ${syncedCount} outlets from HRIS.`);
            return {
                success: true,
                message: `Berhasil sinkronisasi ${syncedCount} outlet dari SobatHR.`,
                count: syncedCount
            };
        }
        catch (error) {
            this.logger.error(`Failed to sync from HRIS: ${error.message}`);
            throw new Error('Sync failed: ' + error.message);
        }
    }
};
exports.OutletService = OutletService;
exports.OutletService = OutletService = OutletService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_1.PrismaClient,
        axios_1.HttpService])
], OutletService);
//# sourceMappingURL=outlet.service.js.map