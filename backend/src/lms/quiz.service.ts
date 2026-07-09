import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class QuizService {
  constructor(private readonly prisma: PrismaClient) {}

  // [Admin] Create a quiz draft
  async createQuiz(data: any) {
    const { course_material_id, passing_score, certificate_template_id, questions } = data;

    // We use Prisma transactions to create Quiz, Questions, and Options atomically
    return this.prisma.$transaction(async (tx) => {
      // 1. Create the Quiz entity
      const quiz = await tx.quiz.create({
        data: {
          course_material_id,
          passing_score,
          certificate_template_id,
        },
      });

      // 2. Insert Questions and Options
      for (const q of questions) {
        await tx.quizQuestion.create({
          data: {
            quiz_id: quiz.id,
            question_text: q.text,
            type: q.type || 'MULTIPLE_CHOICE',
            Options: {
              create: q.options.map((opt: any) => ({
                option_text: opt.text,
                is_correct: opt.is_correct,
              })),
            },
          },
        });
      }

      return quiz;
    });
  }

  // [Mobile/Web] Get Quiz for taking (HIDDEN is_correct)
  async getQuizByMaterialId(materialId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { course_material_id: materialId },
      include: {
        Questions: {
          include: {
            // Include options but omit is_correct to prevent cheating
            Options: {
              select: {
                id: true,
                question_id: true,
                option_text: true,
                // is_correct is intentionally OMITTED
              },
            },
          },
        },
      },
    });

    if (!quiz) throw new NotFoundException('Quiz not found for this material');
    return quiz;
  }

  // [Mobile/Web] Submit answers
  async submitQuiz(quizId: string, payload: { user_id: string; answers: { question_id: string; selected_option_ids: string[] }[] }) {
    const { user_id, answers } = payload;

    // Fetch the quiz with correct answers to validate
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        Questions: {
          include: { Options: true },
        },
      },
    });

    if (!quiz) throw new NotFoundException('Quiz not found');

    let correctCount = 0;
    const totalQuestions = quiz.Questions.length;

    // Calculate score
    for (const userAns of answers) {
      const question = quiz.Questions.find((q) => q.id === userAns.question_id);
      if (!question) continue;

      const correctOptionIds = question.Options.filter((opt) => opt.is_correct).map((opt) => opt.id);

      // Check if user selected exactly the correct options
      const isExactlyCorrect = 
        correctOptionIds.length === userAns.selected_option_ids.length &&
        correctOptionIds.every((id) => userAns.selected_option_ids.includes(id));

      if (isExactlyCorrect) {
        correctCount++;
      }
    }

    // Convert to percentage score
    const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const is_passed = score >= quiz.passing_score;

    // Save attempt
    const attempt = await this.prisma.employeeQuizAttempt.create({
      data: {
        user_id,
        quiz_id: quiz.id,
        score,
        is_passed,
      },
    });

    // TODO: Trigger Webhook to Laravel HRIS for certificate generation if passed.

    return {
      attempt_id: attempt.id,
      score,
      is_passed,
      passing_score: quiz.passing_score,
    };
  }
}
