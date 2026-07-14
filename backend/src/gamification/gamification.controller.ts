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
}
