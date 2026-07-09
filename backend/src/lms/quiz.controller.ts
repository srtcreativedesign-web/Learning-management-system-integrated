import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { QuizService } from './quiz.service';

@Controller('quizzes')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  async createQuizDraft(@Body() payload: any) {
    return this.quizService.createQuiz(payload);
  }

  @Get('material/:materialId')
  async getQuizForTake(@Param('materialId') materialId: string) {
    return this.quizService.getQuizByMaterialId(materialId);
  }

  @Post(':quizId/submit')
  async submitQuiz(@Param('quizId') quizId: string, @Body() payload: any) {
    return this.quizService.submitQuiz(quizId, payload);
  }
}
