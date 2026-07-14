import { PrismaClient } from '@prisma/client';
export declare function determineRank(xp: number): string;
export declare class GamificationService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    getProfile(hrisUserId: string): Promise<{
        hris_user_id: string;
        total_xp: number;
        current_rank: string;
        passed_quiz_ids: any[];
    }>;
    getLeaderboard(search?: string): Promise<{
        id: string;
        hris_user_id: string;
        full_name: string;
        total_xp: number;
        current_rank: string;
        quizzes_completed: number;
    }[]>;
    adjustXp(payload: {
        hris_user_id: string;
        new_xp: number;
        reason: string;
    }): Promise<{
        success: boolean;
        message: string;
        new_xp: number;
        new_rank: string;
    }>;
}
