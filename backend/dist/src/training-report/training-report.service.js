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
exports.TrainingReportService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
let TrainingReportService = class TrainingReportService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOverview(filter) {
        const startDate = filter?.startDate ? new Date(filter.startDate) : undefined;
        const endDate = filter?.endDate ? new Date(filter.endDate) : undefined;
        const quizDateFilter = {};
        const sessionDateFilter = {};
        if (startDate || endDate) {
            if (startDate && endDate) {
                quizDateFilter.created_at = { gte: startDate, lte: endDate };
                sessionDateFilter.training_date = { gte: startDate, lte: endDate };
            }
            else if (startDate) {
                quizDateFilter.created_at = { gte: startDate };
                sessionDateFilter.training_date = { gte: startDate };
            }
            else if (endDate) {
                quizDateFilter.created_at = { lte: endDate };
                sessionDateFilter.training_date = { lte: endDate };
            }
        }
        const sessionWhere = { ...sessionDateFilter };
        if (filter?.outletId) {
            sessionWhere.outlet_id = filter.outletId;
        }
        const quizAttempts = await this.prisma.employeeQuizAttempt.findMany({
            where: quizDateFilter,
            include: {
                User: true,
                Quiz: {
                    include: {
                        Material: {
                            include: {
                                Course: true,
                            },
                        },
                    },
                },
            },
            orderBy: { created_at: 'desc' },
        });
        const inHouseSessions = await this.prisma.inHouseSession.findMany({
            where: sessionWhere,
            include: {
                assessments: {
                    include: {
                        checklistPoint: {
                            include: { category: true },
                        },
                    },
                },
            },
            orderBy: { training_date: 'desc' },
        });
        const outlets = await this.prisma.outlet.findMany();
        const outletMap = new Map();
        outlets.forEach((o) => {
            outletMap.set(o.id, o.name);
            outletMap.set(String(o.hris_id), o.name);
        });
        const totalOnlineAttempts = quizAttempts.length;
        const passedOnlineAttempts = quizAttempts.filter((q) => q.is_passed).length;
        const onlinePassRate = totalOnlineAttempts > 0
            ? Math.round((passedOnlineAttempts / totalOnlineAttempts) * 1000) / 10
            : 0;
        const totalOnlineScore = quizAttempts.reduce((acc, q) => acc + (q.score || 0), 0);
        const avgOnlineScore = totalOnlineAttempts > 0
            ? Math.round((totalOnlineScore / totalOnlineAttempts) * 10) / 10
            : 0;
        const totalXpAwarded = quizAttempts.reduce((acc, q) => acc + (q.xp_awarded || 0), 0);
        const totalInHouseSessions = inHouseSessions.length;
        const passedInHouseSessions = inHouseSessions.filter((s) => s.is_passed).length;
        const inHousePassRate = totalInHouseSessions > 0
            ? Math.round((passedInHouseSessions / totalInHouseSessions) * 1000) / 10
            : 0;
        const totalInHousePercentage = inHouseSessions.reduce((acc, s) => acc + (s.percentage || 0), 0);
        const avgInHousePercentage = totalInHouseSessions > 0
            ? Math.round((totalInHousePercentage / totalInHouseSessions) * 10) / 10
            : 0;
        const uniqueOnlineUsers = new Set(quizAttempts.map((q) => q.user_id));
        const uniqueInHouseNames = new Set(inHouseSessions.map((s) => s.trainee_name?.trim().toLowerCase()).filter(Boolean));
        const totalTraineesTrained = uniqueOnlineUsers.size + uniqueInHouseNames.size;
        const totalTrainingEvents = totalOnlineAttempts + totalInHouseSessions;
        const totalPassedEvents = passedOnlineAttempts + passedInHouseSessions;
        const overallPassRate = totalTrainingEvents > 0
            ? Math.round((totalPassedEvents / totalTrainingEvents) * 1000) / 10
            : 0;
        const inHouseGrades = {
            SB: inHouseSessions.filter((s) => s.grade === 'SB').length,
            B: inHouseSessions.filter((s) => s.grade === 'B').length,
            C: inHouseSessions.filter((s) => s.grade === 'C').length,
            K: inHouseSessions.filter((s) => s.grade === 'K').length,
        };
        const onlineStatus = {
            passed: passedOnlineAttempts,
            failed: totalOnlineAttempts - passedOnlineAttempts,
        };
        const monthlyMap = new Map();
        const getMonthKey = (d) => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            return `${year}-${month}`;
        };
        const getMonthLabel = (d) => {
            return d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
        };
        quizAttempts.forEach((q) => {
            const d = new Date(q.created_at);
            const key = getMonthKey(d);
            if (!monthlyMap.has(key)) {
                monthlyMap.set(key, {
                    monthKey: key,
                    monthLabel: getMonthLabel(d),
                    onlineAttempts: 0,
                    onlinePassed: 0,
                    inHouseSessions: 0,
                    inHousePassed: 0,
                    totalParticipants: 0,
                });
            }
            const entry = monthlyMap.get(key);
            entry.onlineAttempts += 1;
            if (q.is_passed)
                entry.onlinePassed += 1;
            entry.totalParticipants += 1;
        });
        inHouseSessions.forEach((s) => {
            const d = new Date(s.training_date || s.created_at);
            const key = getMonthKey(d);
            if (!monthlyMap.has(key)) {
                monthlyMap.set(key, {
                    monthKey: key,
                    monthLabel: getMonthLabel(d),
                    onlineAttempts: 0,
                    onlinePassed: 0,
                    inHouseSessions: 0,
                    inHousePassed: 0,
                    totalParticipants: 0,
                });
            }
            const entry = monthlyMap.get(key);
            entry.inHouseSessions += 1;
            if (s.is_passed)
                entry.inHousePassed += 1;
            entry.totalParticipants += 1;
        });
        const monthlyTrend = Array.from(monthlyMap.values())
            .sort((a, b) => a.monthKey.localeCompare(b.monthKey))
            .slice(-12);
        const courseMap = new Map();
        quizAttempts.forEach((q) => {
            const course = q.Quiz?.Material?.Course;
            const courseId = course?.id || 'unknown';
            const courseTitle = course?.title || 'Modul Tanpa Judul';
            if (!courseMap.has(courseId)) {
                courseMap.set(courseId, {
                    courseId,
                    title: courseTitle,
                    totalAttempts: 0,
                    passedCount: 0,
                    totalScore: 0,
                });
            }
            const entry = courseMap.get(courseId);
            entry.totalAttempts += 1;
            if (q.is_passed)
                entry.passedCount += 1;
            entry.totalScore += q.score || 0;
        });
        const coursePerformance = Array.from(courseMap.values()).map((c) => ({
            courseId: c.courseId,
            title: c.title,
            totalAttempts: c.totalAttempts,
            passedCount: c.passedCount,
            failedCount: c.totalAttempts - c.passedCount,
            passRate: c.totalAttempts > 0 ? Math.round((c.passedCount / c.totalAttempts) * 1000) / 10 : 0,
            avgScore: c.totalAttempts > 0 ? Math.round((c.totalScore / c.totalAttempts) * 10) / 10 : 0,
        })).sort((a, b) => b.totalAttempts - a.totalAttempts);
        const outletStatsMap = new Map();
        inHouseSessions.forEach((s) => {
            const outletId = s.outlet_id || 'unassigned';
            const outletName = s.outlet_id ? (outletMap.get(s.outlet_id) || `Outlet #${s.outlet_id}`) : 'Semua Outlet / Kantor Pusat';
            if (!outletStatsMap.has(outletId)) {
                outletStatsMap.set(outletId, {
                    outletId,
                    outletName,
                    totalSessions: 0,
                    passedCount: 0,
                    totalPercentage: 0,
                    gradeSB: 0,
                    gradeB: 0,
                    gradeC: 0,
                    gradeK: 0,
                });
            }
            const entry = outletStatsMap.get(outletId);
            entry.totalSessions += 1;
            if (s.is_passed)
                entry.passedCount += 1;
            entry.totalPercentage += s.percentage || 0;
            if (s.grade === 'SB')
                entry.gradeSB += 1;
            else if (s.grade === 'B')
                entry.gradeB += 1;
            else if (s.grade === 'C')
                entry.gradeC += 1;
            else if (s.grade === 'K')
                entry.gradeK += 1;
        });
        const outletPerformance = Array.from(outletStatsMap.values()).map((o) => ({
            outletId: o.outletId,
            outletName: o.outletName,
            totalSessions: o.totalSessions,
            passedCount: o.passedCount,
            passRate: o.totalSessions > 0 ? Math.round((o.passedCount / o.totalSessions) * 1000) / 10 : 0,
            avgPercentage: o.totalSessions > 0 ? Math.round((o.totalPercentage / o.totalSessions) * 10) / 10 : 0,
            gradeSB: o.gradeSB,
            gradeB: o.gradeB,
            gradeC: o.gradeC,
            gradeK: o.gradeK,
        })).sort((a, b) => b.totalSessions - a.totalSessions);
        return {
            summary: {
                totalTrainingEvents,
                totalPassedEvents,
                overallPassRate,
                totalTraineesTrained,
                totalXpAwarded,
                online: {
                    totalAttempts: totalOnlineAttempts,
                    passedAttempts: passedOnlineAttempts,
                    passRate: onlinePassRate,
                    avgScore: avgOnlineScore,
                    totalXp: totalXpAwarded,
                    statusDistribution: onlineStatus,
                },
                inHouse: {
                    totalSessions: totalInHouseSessions,
                    passedSessions: passedInHouseSessions,
                    passRate: inHousePassRate,
                    avgPercentage: avgInHousePercentage,
                    gradeDistribution: inHouseGrades,
                },
            },
            monthlyTrend,
            coursePerformance,
            outletPerformance,
        };
    }
    async getDetailedRecords(filter) {
        const startDate = filter?.startDate ? new Date(filter.startDate) : undefined;
        const endDate = filter?.endDate ? new Date(filter.endDate) : undefined;
        const quizDateFilter = {};
        const sessionDateFilter = {};
        if (startDate || endDate) {
            if (startDate && endDate) {
                quizDateFilter.created_at = { gte: startDate, lte: endDate };
                sessionDateFilter.training_date = { gte: startDate, lte: endDate };
            }
            else if (startDate) {
                quizDateFilter.created_at = { gte: startDate };
                sessionDateFilter.training_date = { gte: startDate };
            }
            else if (endDate) {
                quizDateFilter.created_at = { lte: endDate };
                sessionDateFilter.training_date = { lte: endDate };
            }
        }
        const type = filter?.type || 'ALL';
        const isPassedFilter = filter?.isPassed || 'ALL';
        const searchQuery = filter?.search?.trim().toLowerCase() || '';
        const outlets = await this.prisma.outlet.findMany();
        const outletMap = new Map();
        outlets.forEach((o) => {
            outletMap.set(o.id, o.name);
            outletMap.set(String(o.hris_id), o.name);
        });
        const records = [];
        if (type === 'ALL' || type === 'ONLINE') {
            const quizWhere = { ...quizDateFilter };
            if (isPassedFilter === 'PASSED')
                quizWhere.is_passed = true;
            if (isPassedFilter === 'FAILED')
                quizWhere.is_passed = false;
            const quizAttempts = await this.prisma.employeeQuizAttempt.findMany({
                where: quizWhere,
                include: {
                    User: true,
                    Quiz: {
                        include: {
                            Material: {
                                include: {
                                    Course: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { created_at: 'desc' },
            });
            for (const q of quizAttempts) {
                const traineeName = q.User?.full_name || 'Karyawan Tanpa Nama';
                const courseTitle = q.Quiz?.Material?.Course?.title || 'E-Learning Modul Quiz';
                const answers = Array.isArray(q.answers_detail) ? q.answers_detail : [];
                records.push({
                    id: `quiz_${q.id}`,
                    type: 'ONLINE',
                    typeLabel: 'Online E-Learning (Quiz)',
                    date: q.created_at.toISOString(),
                    traineeName,
                    traineeId: q.User?.hris_user_id || null,
                    traineeRole: q.User?.role || 'EMPLOYEE',
                    title: courseTitle,
                    trainerName: 'AI Assessment Engine',
                    outletId: null,
                    outletName: 'Online Platform',
                    score: q.score,
                    maxScore: 100,
                    percentage: q.score,
                    grade: q.is_passed ? 'LULUS' : 'REMIDI',
                    isPassed: q.is_passed,
                    xpAwarded: q.xp_awarded || 0,
                    notes: q.is_passed ? 'Lulus passing score kuis' : 'Belum mencapai passing score',
                    answersDetailCount: answers.length,
                });
            }
        }
        if (type === 'ALL' || type === 'IN_HOUSE') {
            const sessionWhere = { ...sessionDateFilter };
            if (filter?.outletId)
                sessionWhere.outlet_id = filter.outletId;
            if (isPassedFilter === 'PASSED')
                sessionWhere.is_passed = true;
            if (isPassedFilter === 'FAILED')
                sessionWhere.is_passed = false;
            const inHouseSessions = await this.prisma.inHouseSession.findMany({
                where: sessionWhere,
                include: {
                    assessments: true,
                },
                orderBy: { training_date: 'desc' },
            });
            for (const s of inHouseSessions) {
                const outletName = s.outlet_id ? (outletMap.get(s.outlet_id) || `Outlet #${s.outlet_id}`) : 'Outlet / Operasional';
                const traineeName = s.trainee_name || 'Trainee Outlet';
                records.push({
                    id: `inhouse_${s.id}`,
                    type: 'IN_HOUSE',
                    typeLabel: 'In-House Outlet Training',
                    date: (s.training_date || s.created_at).toISOString(),
                    traineeName,
                    traineeId: null,
                    traineeRole: 'CREW_OUTLET',
                    title: `Training Lapangan (${outletName})`,
                    trainerName: s.trainer_name || 'Trainer TnD',
                    outletId: s.outlet_id || null,
                    outletName,
                    score: s.total_score,
                    maxScore: s.max_score || 100,
                    percentage: s.percentage,
                    grade: s.grade || (s.is_passed ? 'B' : 'K'),
                    isPassed: s.is_passed,
                    xpAwarded: 0,
                    notes: s.notes || (s.pic_name ? `PIC: ${s.pic_name}` : null),
                    assessmentsCount: s.assessments?.length || 0,
                });
            }
        }
        let filteredRecords = records;
        if (searchQuery) {
            filteredRecords = records.filter((r) => {
                return (r.traineeName.toLowerCase().includes(searchQuery) ||
                    (r.traineeId && r.traineeId.toLowerCase().includes(searchQuery)) ||
                    r.title.toLowerCase().includes(searchQuery) ||
                    (r.trainerName && r.trainerName.toLowerCase().includes(searchQuery)) ||
                    (r.outletName && r.outletName.toLowerCase().includes(searchQuery)) ||
                    r.grade.toLowerCase().includes(searchQuery));
            });
        }
        filteredRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const totalCount = filteredRecords.length;
        const offset = filter?.offset ?? 0;
        const limit = filter?.limit ?? 50;
        const paginatedRecords = filteredRecords.slice(offset, offset + limit);
        return {
            total: totalCount,
            limit,
            offset,
            records: paginatedRecords,
        };
    }
    async getOutlets() {
        return this.prisma.outlet.findMany({
            orderBy: { name: 'asc' },
            select: {
                id: true,
                hris_id: true,
                name: true,
                status: true,
            },
        });
    }
};
exports.TrainingReportService = TrainingReportService;
exports.TrainingReportService = TrainingReportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [client_1.PrismaClient])
], TrainingReportService);
//# sourceMappingURL=training-report.service.js.map