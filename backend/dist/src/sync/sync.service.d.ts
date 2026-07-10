import { PrismaClient } from '@prisma/client';
import { HttpService } from '@nestjs/axios';
import { SyncUserDto } from './dto/sync-user.dto';
import { SyncDivisionDto } from './dto/sync-division.dto';
export declare class SyncService {
    private readonly prisma;
    private readonly httpService;
    constructor(prisma: PrismaClient, httpService: HttpService);
    syncUser(dto: SyncUserDto): Promise<{
        id: string;
        hris_user_id: string;
        email: string;
        full_name: string;
    }>;
    syncDivision(dto: SyncDivisionDto): Promise<{
        id: string;
        hris_division_id: string;
        name: string;
    }>;
    syncEmployeesFromHRIS(): Promise<{
        success: boolean;
        message: string;
    }>;
    getEmployees(): Promise<{
        id: string;
        hris_user_id: string;
        email: string;
        full_name: string;
    }[]>;
}
