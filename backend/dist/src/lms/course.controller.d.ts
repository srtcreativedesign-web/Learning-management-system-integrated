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
                    quiz_id: string;
                    type: string;
                    question_text: string;
                })[];
                Template: {
                    id: string;
                    name: string;
                    bg_image_url: string;
                    name_pos_x: number;
                    name_pos_y: number;
                    name_font_size: number;
                    name_font_color: string;
                    pdfme_template: import("@prisma/client/runtime/client").JsonValue | null;
                    base_pdf_url: string | null;
                } | null;
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
        description: string | null;
        title: string;
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
                    quiz_id: string;
                    type: string;
                    question_text: string;
                })[];
                Template: {
                    id: string;
                    name: string;
                    bg_image_url: string;
                    name_pos_x: number;
                    name_pos_y: number;
                    name_font_size: number;
                    name_font_color: string;
                    pdfme_template: import("@prisma/client/runtime/client").JsonValue | null;
                    base_pdf_url: string | null;
                } | null;
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
        description: string | null;
        title: string;
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
        description: string | null;
        title: string;
        thumbnail_url: string | null;
        reward_points: number;
        due_date: Date | null;
    }>;
}
