import { OutletService } from './outlet.service';
export declare class OutletController {
    private readonly outletService;
    constructor(outletService: OutletService);
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
