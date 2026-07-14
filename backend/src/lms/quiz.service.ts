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
  async submitQuiz(quizId: string, payload: { hris_user_id?: string; user_id?: string; answers: { question_id: string; selected_option_ids: string[] }[] }) {
    let { hris_user_id, answers } = payload;
    let user_id = payload.user_id;
    
    // Auto-detect if HRIS mobile app mistakenly sends HRIS ID inside user_id
    if (user_id && !user_id.includes('-')) {
      hris_user_id = user_id;
      user_id = undefined;
    }
    
    // Find UserShadow by hris_user_id
    if (hris_user_id && !user_id) {
      const u = await this.prisma.userShadow.findUnique({ where: { hris_user_id } });
      if (u) {
        user_id = u.id;
      }
    }
    
    if (!user_id) throw new NotFoundException('User identity missing or not found in LMS');

    // Fetch the quiz with correct answers to validate
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        Questions: {
          include: { Options: true },
        },
        Material: {
          include: { Course: true }
        }
      },
    });

    if (!quiz) throw new NotFoundException('Quiz not found');

    let correctCount = 0;
    const totalQuestions = quiz.Questions.length;
    const answersDetail: any[] = [];

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
      
      answersDetail.push({
        question_id: question.id,
        question_text: question.question_text,
        user_selected_ids: userAns.selected_option_ids,
        correct_option_ids: correctOptionIds,
        is_correct: isExactlyCorrect,
        options: question.Options.map(opt => ({
          id: opt.id,
          text: opt.option_text,
          is_correct: opt.is_correct
        }))
      });
    }

    // Convert to percentage score
    const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const is_passed = score >= quiz.passing_score;

    let xp_awarded = 0;
    
    // Add XP if passed
    if (is_passed) {
      xp_awarded = quiz.Material?.Course?.reward_points || 0;
      
      // Update UserShadow total_xp and current_rank
      if (xp_awarded > 0) {
        const user = await this.prisma.userShadow.findUnique({ where: { id: user_id } });
        if (user) {
          const newXp = user.total_xp + xp_awarded;
          
          // Determine new rank
          let newRank = 'Pemula';
          if (newXp > 1000) newRank = 'Pakar SobatHR';
          else if (newXp > 600) newRank = 'Master Pengetahuan';
          else if (newXp > 300) newRank = 'Karyawan Terampil';
          else if (newXp > 100) newRank = 'Pembelajar Aktif';

          await this.prisma.userShadow.update({
            where: { id: user_id },
            data: {
              total_xp: newXp,
              current_rank: newRank
            }
          });
        }
      }
    }

    // Save attempt
    const attempt = await this.prisma.employeeQuizAttempt.create({
      data: {
        user_id,
        quiz_id: quiz.id,
        score,
        is_passed,
        xp_awarded,
        answers_detail: answersDetail
      },
    });

    // Trigger Webhook to Laravel HRIS for certificate generation if passed.
    if (is_passed) {
      try {
        const axios = require('axios');
        await axios.post('http://localhost:8000/api/webhooks/lms/certificate-trigger', {
          user_id,
          quiz_id: quiz.id,
          attempt_id: attempt.id,
          score,
          is_passed,
        });
      } catch (err: any) {
        console.error('Failed to trigger webhook to HRIS:', err.message);
      }
    }

    return {
      attempt_id: attempt.id,
      score,
      is_passed,
      passing_score: quiz.passing_score,
      xp_awarded,
    };
  }

  // [Admin] Get all quizzes
  async getAllQuizzes() {
    return this.prisma.quiz.findMany({
      include: {
        Material: {
          include: { Course: true }
        },
        _count: {
          select: { Questions: true, EmployeeQuizAttempts: true }
        }
      },
      orderBy: { id: 'desc' }
    });
  }

  // [Admin] Get all quiz attempts (history)
  async getAllAttempts() {
    return this.prisma.employeeQuizAttempt.findMany({
      include: {
        User: {
          select: { full_name: true, hris_user_id: true, current_rank: true }
        },
        Quiz: {
          include: {
            Material: {
              include: { Course: true }
            }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });
  }
}
