import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
export declare class CourseController {
    private readonly courseService;
    constructor(courseService: CourseService);
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
