import { Body, Controller, Get, Param, Post, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuizService } from './quiz.service';
import { AiService } from './ai.service';
import { PrismaClient } from '@prisma/client';
import { join } from 'path';

@Controller('quizzes')
@ApiTags('quizzes')
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly aiService: AiService,
    private readonly prisma: PrismaClient
  ) {}

  @Post()
  async createQuizDraft(@Body() payload: any) {
    return this.quizService.createQuiz(payload);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all quizzes for admin panel' })
  async getAllQuizzes() {
    return this.quizService.getAllQuizzes();
  }

  @Get('attempts')
  @ApiOperation({ summary: 'Get all quiz attempts history' })
  async getAllAttempts() {
    return this.quizService.getAllAttempts();
  }

  @Get('material/:materialId')
  @ApiOperation({ summary: 'Get quiz by material ID' })
  async getQuizByMaterial(@Param('materialId') materialId: string) {
    return this.quizService.getQuizByMaterialId(materialId);
  }

  @Get('extract-pdf/:courseId')
  async extractPdfText(@Param('courseId') courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: { Materials: true }
    });

    const pdfMat = course?.Materials.find(m => m.type.toUpperCase() === 'PDF');
    if (pdfMat && pdfMat.content_url) {
      try {
        const safeUrl = pdfMat.content_url.replace(/^\/+/, '');
        const localPath = join(__dirname, '..', '..', '..', safeUrl);
        const text = await this.aiService.extractTextFromPdf(localPath);
        return { success: true, text };
      } catch (e) {
        console.error("Failed extracting PDF:", e);
        return { success: false, message: 'Gagal mengekstrak PDF' };
      }
    }
    return { success: false, message: 'File PDF tidak ditemukan' };
  }

  @Post('generate')
  @ApiOperation({ summary: 'Generate Quiz questions using Groq AI' })
  async generateQuiz(@Body() body: { materialText: string }) {
    const text = body.materialText;
    
    if (!text || text.trim() === '') {
      throw new BadRequestException("Teks materi kosong atau gagal diekstrak");
    }

    const aiQuestions = await this.aiService.generateQuiz(text);

    return {
      success: true,
      message: "Soal berhasil di-generate secara cerdas oleh AI Groq",
      data: aiQuestions
    };
  }

  @Post(':quizId/submit')
  async submitQuiz(@Param('quizId') quizId: string, @Body() payload: any) {
    return this.quizService.submitQuiz(quizId, payload);
  }
}
