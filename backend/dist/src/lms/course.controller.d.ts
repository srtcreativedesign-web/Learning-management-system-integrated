import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
export declare class CourseController {
    private readonly courseService;
    constructor(courseService: CourseService);
    create(dto: CreateCourseDto): Promise<{
        id: string;
        title: string;
        description: string | null;
        thumbnail_url: string | null;
        reward_points: number;
        due_date: Date | null;
    }>;
    getAllCourses(): Promise<({
        Materials: ({
            Quiz: ({
                Questions: ({
                    Options: {
                        id: string;
                        question_id: string;
                        option_text: string;
                        is_correct: boolean;
                    }[];
                } & {
                    id: string;
                    type: string;
                    quiz_id: string;
                    question_text: string;
                })[];
            } & {
                id: string;
                passing_score: number;
                certificate_template_id: string | null;
                course_material_id: string;
            }) | null;
        } & {
            id: string;
            type: string;
            content_url: string | null;
            min_read_time: number | null;
            course_id: string;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        thumbnail_url: string | null;
        reward_points: number;
        due_date: Date | null;
    })[]>;
    getCourseById(id: string): Promise<({
        Materials: ({
            Quiz: ({
                Questions: ({
                    Options: {
                        id: string;
                        question_id: string;
                        option_text: string;
                        is_correct: boolean;
                    }[];
                } & {
                    id: string;
                    type: string;
                    quiz_id: string;
                    question_text: string;
                })[];
            } & {
                id: string;
                passing_score: number;
                certificate_template_id: string | null;
                course_material_id: string;
            }) | null;
        } & {
            id: string;
            type: string;
            content_url: string | null;
            min_read_time: number | null;
            course_id: string;
        })[];
    } & {
        id: string;
        title: string;
        description: string | null;
        thumbnail_url: string | null;
        reward_points: number;
        due_date: Date | null;
    }) | null>;
    uploadMaterial(file: any): Promise<{
        success: boolean;
        url: string;
        fileName: any;
        mimeType: any;
    }>;
    update(id: string, dto: any): Promise<{
        id: string;
        title: string;
        description: string | null;
        thumbnail_url: string | null;
        reward_points: number;
        due_date: Date | null;
    }>;
}
