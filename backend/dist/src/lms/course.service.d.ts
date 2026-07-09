import { PrismaClient } from '@prisma/client';
import { CreateCourseDto } from './dto/create-course.dto';
export declare class CourseService {
    private prisma;
    constructor(prisma: PrismaClient);
    create(dto: CreateCourseDto): Promise<{
        id: string;
        description: string | null;
        title: string;
        thumbnail_url: string | null;
    }>;
    findAll(): Promise<({
        Materials: {
            id: string;
            type: string;
            course_id: string;
            content_url: string | null;
            min_read_time: number | null;
        }[];
    } & {
        id: string;
        description: string | null;
        title: string;
        thumbnail_url: string | null;
    })[]>;
}
