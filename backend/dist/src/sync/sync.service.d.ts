import { PrismaClient } from '@prisma/client';
import { SyncUserDto } from './dto/sync-user.dto';
import { SyncDivisionDto } from './dto/sync-division.dto';
export declare class SyncService {
    private prisma;
    constructor(prisma: PrismaClient);
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
}
