export declare class AiService {
    private groq;
    constructor();
    extractTextFromPdf(filePath: string): Promise<string>;
    generateQuiz(text: string): Promise<{
        summary: string;
        questions: any[];
    }>;
    extractSopPoints(text: string): Promise<{
        points: {
            title: string;
            description: string;
        }[];
    }>;
}
