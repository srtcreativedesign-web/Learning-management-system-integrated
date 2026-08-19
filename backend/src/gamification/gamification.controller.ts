import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { GamificationService } from './gamification.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Gamification')
@Controller('api/gamification')
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('profile/:hrisUserId')
  @ApiOperation({ summary: 'Get gamification profile (XP & Rank) for a user' })
  async getProfile(@Param('hrisUserId') hrisUserId: string) {
    return this.gamificationService.getProfile(hrisUserId);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get gamification leaderboard' })
  async getLeaderboard(@Query('search') search?: string) {
    return this.gamificationService.getLeaderboard(search);
  }

  @Post('adjust-xp')
  @ApiOperation({ summary: 'Manually adjust XP for a user' })
  async adjustXp(@Body() payload: { hris_user_id: string, new_xp: number, reason: string }) {
    return this.gamificationService.adjustXp(payload);
  }

  @Get('rank-rewards')
  @ApiOperation({ summary: 'Get reward list per rank/level' })
  async getRankRewards() {
    return this.gamificationService.getRankRewards();
  }

  @Get('admin/rank-rewards')
  @ApiOperation({ summary: 'Get all rank rewards for admin panel' })
  async getAllRankRewardsAdmin() {
    return this.gamificationService.getAllRankRewardsAdmin();
  }

  @Post('admin/rank-rewards/:id')
  @ApiOperation({ summary: 'Update a rank reward' })
  async updateRankReward(
    @Param('id') id: string,
    @Body()
    payload: {
      reward_title?: string;
      reward_description?: string;
      min_xp?: number;
      is_active?: boolean;
    },
  ) {
    return this.gamificationService.updateRankReward(id, payload);
  }
}
