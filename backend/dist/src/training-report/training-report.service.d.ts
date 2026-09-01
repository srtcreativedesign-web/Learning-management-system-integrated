import { PrismaClient } from '@prisma/client';
export interface OverviewFilter {
    startDate?: string;
    endDate?: string;
    outletId?: string;
}
export interface RecordFilter {
    startDate?: string;
    endDate?: string;
    type?: 'ALL' | 'ONLINE' | 'IN_HOUSE';
    isPassed?: 'ALL' | 'PASSED' | 'FAILED';
    outletId?: string;
    search?: string;
    limit?: number;
    offset?: number;
}
export declare class TrainingReportService {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    getOverview(filter?: OverviewFilter): Promise<{
        summary: {
            totalTrainingEvents: number;
            totalPassedEvents: number;
            overallPassRate: number;
            totalTraineesTrained: number;
            totalXpAwarded: number;
            online: {
                totalAttempts: number;
                passedAttempts: number;
                passRate: number;
                avgScore: number;
                totalXp: number;
                statusDistribution: {
                    passed: number;
                    failed: number;
                };
            };
            inHouse: {
                totalSessions: number;
                passedSessions: number;
                passRate: number;
                avgPercentage: number;
                gradeDistribution: {
                    SB: number;
                    B: number;
                    C: number;
                    K: number;
                };
            };
        };
        monthlyTrend: {
            monthKey: string;
            monthLabel: string;
            onlineAttempts: number;
            onlinePassed: number;
            inHouseSessions: number;
            inHousePassed: number;
            totalParticipants: number;
        }[];
        coursePerformance: {
            courseId: string;
            title: string;
            totalAttempts: number;
            passedCount: number;
            failedCount: number;
            passRate: number;
            avgScore: number;
        }[];
        outletPerformance: {
            outletId: string;
            outletName: string;
            totalSessions: number;
            passedCount: number;
            passRate: number;
            avgPercentage: number;
            gradeSB: number;
            gradeB: number;
            gradeC: number;
            gradeK: number;
        }[];
    }>;
    getDetailedRecords(filter?: RecordFilter): Promise<{
        total: number;
        limit: number;
        offset: number;
        records: {
            id: string;
            type: "ONLINE" | "IN_HOUSE";
            typeLabel: string;
            date: string;
            traineeName: string;
            traineeId: string | null;
            traineeRole: string | null;
            title: string;
            trainerName: string | null;
            outletId: string | null;
            outletName: string | null;
            score: number;
            maxScore: number;
            percentage: number;
            grade: string;
            isPassed: boolean;
            xpAwarded: number;
            notes?: string | null;
            answersDetailCount?: number;
            assessmentsCount?: number;
        }[];
    }>;
    getOutlets(): Promise<{
        id: string;
        name: string;
        hris_id: number;
        status: string;
    }[]>;
}
