"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamificationService = void 0;
exports.determineRank = determineRank;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
function determineRank(xp) {
    if (xp <= 100)
        return 'Pemula';
    if (xp <= 300)
        return 'Pembelajar Aktif';
    if (xp <= 600)
        return 'Karyawan Terampil';
    if (xp <= 1000)
        return 'Master Pengetahuan';
    return 'Pakar SobatHR';
}
let GamificationService = class GamificationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProfile(hrisUserId) {
        const user = await this.prisma.userShadow.findUnique({
            where: { hris_user_id: hrisUserId },
            include: { QuizAttempts: { where: { is_passed: true }, select: { quiz_id: true } } }
        });
        if (!user) {
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
            passed_quiz_ids: user.QuizAttempts.map((a) => a.quiz_id)
        };
    }
    async getLeaderboard(search) {
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
    async adjustXp(payload) {
        const { hris_user_id, new_xp, reason } = payload;
        const user = await this.prisma.userShadow.findUnique({
            where: { hris_user_id }
        });
        if (!user)
            throw new Error('User not found');
        const newRank = determineRank(new_xp);
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
};
exports.GamificationService = GamificationService;
exports.GamificationService = GamificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], GamificationService);
//# sourceMappingURL=gamification.service.js.map