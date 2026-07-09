import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
export declare class AuthService {
    private readonly jwtService;
    private readonly prisma;
    constructor(jwtService: JwtService, prisma: PrismaClient);
    mockSsoLogin(email: string): Promise<{
        access_token: string;
        user: {
            id: string;
            name: string;
            email: string;
        };
    }>;
}
