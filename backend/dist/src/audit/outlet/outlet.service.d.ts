import { PrismaClient } from '@prisma/client';
import { HttpService } from '@nestjs/axios';
export declare class OutletService {
    private readonly prisma;
    private readonly httpService;
    private readonly logger;
    constructor(prisma: PrismaClient, httpService: HttpService);
    findAll(): Promise<{
        id: string;
        name: string;
        hris_id: number;
        address: string | null;
        latitude: string | null;
        longitude: string | null;
        device_id: number | null;
        device_code: string | null;
        device_name: string | null;
        status: string;
    }[]>;
    syncFromHRIS(): Promise<{
        success: boolean;
        message: string;
    }>;
}
