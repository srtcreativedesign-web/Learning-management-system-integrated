import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export function determineRank(xp: number): string {
  if (xp <= 100) return 'Pemula';
  if (xp <= 300) return 'Pembelajar Aktif';
  if (xp <= 600) return 'Karyawan Terampil';
  if (xp <= 1000) return 'Master Pengetahuan';
  return 'Pakar SobatHR';
}

@Injectable()
export class GamificationService {
  constructor(private readonly prisma: PrismaClient) {}

  async getProfile(hrisUserId: string) {
    const user = await this.prisma.userShadow.findUnique({
      where: { hris_user_id: hrisUserId },
      include: { QuizAttempts: { where: { is_passed: true }, select: { quiz_id: true } } }
    });

    if (!user) {
      // Return default if user hasn't synced to LMS yet
      return {
        hris_user_id: hrisUserId,
        total_xp: 0,
        current_rank: 'Pemula',
        passed_quiz_ids: []
      };
    }

    return {
      hris_user_id: user.hris_user_id,
      total_xp: user.total_xp,
      current_rank: user.current_rank,
      passed_quiz_ids: user.QuizAttempts.map((a: any) => a.quiz_id)
    };
  }

  async getLeaderboard(search?: string) {
    const users = await this.prisma.userShadow.findMany({
      where: search ? {
        OR: [
          { full_name: { contains: search, mode: 'insensitive' } },
          { hris_user_id: { contains: search, mode: 'insensitive' } }
        ]
      } : undefined,
      orderBy: { total_xp: 'desc' },
      include: {
        _count: { select: { QuizAttempts: true } }
      }
    });

    return users.map(u => ({
      id: u.id,
      hris_user_id: u.hris_user_id,
      full_name: u.full_name,
      total_xp: u.total_xp,
      current_rank: u.current_rank,
      quizzes_completed: u._count.QuizAttempts
    }));
  }

  async adjustXp(payload: { hris_user_id: string, new_xp: number, reason: string }) {
    const { hris_user_id, new_xp, reason } = payload;
    
    const user = await this.prisma.userShadow.findUnique({
      where: { hris_user_id }
    });

    if (!user) throw new Error('User not found');

    const newRank = determineRank(new_xp);
    
    // Create audit trail and update user atomically
    await this.prisma.$transaction(async (tx) => {
      await tx.userShadow.update({
        where: { id: user.id },
        data: {
          total_xp: new_xp,
          current_rank: newRank
        }
      });

      await tx.xpAuditTrail.create({
        data: {
          user_id: user.id,
          old_xp: user.total_xp,
          new_xp: new_xp,
          reason: reason || 'Manual Adjustment'
        }
      });
    });

    return {
      success: true,
      message: 'XP adjusted successfully',
      new_xp,
      new_rank: newRank
    };
  }
}
