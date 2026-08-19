import { GamificationService } from './gamification.service';
export declare class GamificationController {
    private readonly gamificationService;
    constructor(gamificationService: GamificationService);
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
    getRankRewards(): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        rank_name: string;
        min_xp: number;
        reward_title: string;
        reward_description: string | null;
        is_active: boolean;
    }[]>;
    getAllRankRewardsAdmin(): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        rank_name: string;
        min_xp: number;
        reward_title: string;
        reward_description: string | null;
        is_active: boolean;
    }[]>;
    updateRankReward(id: string, payload: {
        reward_title?: string;
        reward_description?: string;
        min_xp?: number;
        is_active?: boolean;
    }): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        rank_name: string;
        min_xp: number;
        reward_title: string;
        reward_description: string | null;
        is_active: boolean;
    }>;
}
