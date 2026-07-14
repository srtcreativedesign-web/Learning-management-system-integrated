import { CourseService } from './course.service';
export declare class KnowledgeHubController {
    private readonly courseService;
    constructor(courseService: CourseService);
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
}
