import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
export declare class AuthService {
    private readonly jwtService;
    private readonly prisma;
    constructor(jwtService: JwtService, prisma: PrismaClient);
    login(email: string, password?: string): Promise<{
        success: boolean;
        message: string;
        access_token: string;
        user: {
            id: string;
            hris_user_id: string;
            name: string;
            email: string;
            role: string;
            total_xp: number;
            current_rank: string;
        };
    }>;
    getProfile(token: string): Promise<{
        success: boolean;
        user: {
            id: string;
            hris_user_id: string;
            name: string;
            email: string;
            role: string;
            total_xp: number;
            current_rank: string;
        };
    }>;
}
