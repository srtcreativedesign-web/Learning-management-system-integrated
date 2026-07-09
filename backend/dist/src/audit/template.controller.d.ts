import { TemplateService } from './template.service';
export declare class TemplateController {
    private readonly templateService;
    constructor(templateService: TemplateService);
    findAllForOfflineSync(): Promise<({
        Checklists: {
            id: string;
            question_text: string;
            template_id: string;
        }[];
    } & {
        id: string;
        title: string;
        version: number;
    })[]>;
}
