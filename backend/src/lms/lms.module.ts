import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { CertificateTemplateController } from './certificate-template.controller';
import { CertificateTemplateService } from './certificate-template.service';

@Module({
  controllers: [CourseController, QuizController, CertificateTemplateController],
  providers: [CourseService, QuizService, CertificateTemplateService]
})
export class LmsModule {}
