export declare class CreateCourseDto {
    title: string;
    description?: string;
    thumbnail_url?: string;
    reward_points?: number;
    due_date?: Date;
    materials?: {
        type: string;
        content_url: string;
        min_read_time?: number;
    }[];
}
