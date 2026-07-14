import { SyncService } from './sync.service';
import { SyncUserDto } from './dto/sync-user.dto';
import { SyncDivisionDto } from './dto/sync-division.dto';
export declare class SyncController {
    private readonly syncService;
    constructor(syncService: SyncService);
    syncUser(dto: SyncUserDto): Promise<{
        id: string;
        hris_user_id: string;
        full_name: string;
        email: string;
        join_date: Date | null;
        total_xp: number;
        current_rank: string;
    }>;
    syncDivision(dto: SyncDivisionDto): Promise<{
        id: string;
        name: string;
        hris_division_id: string;
    }>;
    syncEmployeesFromHRIS(): Promise<{
        success: boolean;
        message: string;
    }>;
    getEmployees(): Promise<{
        id: string;
        hris_user_id: string;
        full_name: string;
        email: string;
        join_date: Date | null;
        total_xp: number;
        current_rank: string;
    }[]>;
}
