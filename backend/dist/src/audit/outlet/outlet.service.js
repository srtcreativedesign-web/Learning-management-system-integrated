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
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(hrisUrl));
            if (!response.data || !response.data.success || !response.data.data) {
                throw new Error('Invalid response format from HRIS');
            }
            const devices = response.data.data;
            let syncedCount = 0;
            for (const device of devices) {
                if (!device.organization)
                    continue;
                const org = device.organization;
                await this.prisma.outlet.upsert({
                    where: { hris_id: org.id },
                    update: {
                        name: org.name,
                        address: org.address,
                        latitude: org.latitude?.toString(),
                        longitude: org.longitude?.toString(),
                        device_id: device.id,
                        device_code: device.device_code,
                        device_name: device.device_name,
                        status: device.status,
                    },
                    create: {
                        hris_id: org.id,
                        name: org.name,
                        address: org.address,
                        latitude: org.latitude?.toString(),
                        longitude: org.longitude?.toString(),
                        device_id: device.id,
                        device_code: device.device_code,
                        device_name: device.device_name,
                        status: device.status,
                    },
                });
                syncedCount++;
            }
            return { success: true, message: `Successfully synced ${syncedCount} outlets from HRIS.` };
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