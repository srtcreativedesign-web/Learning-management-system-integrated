import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: {
        email: string;
        password?: string;
    }): Promise<{
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
    getProfile(authHeader?: string): Promise<{
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
