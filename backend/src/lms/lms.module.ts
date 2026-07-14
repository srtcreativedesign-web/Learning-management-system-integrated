import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { CertificateTemplateController } from './certificate-template.controller';
import { CertificateTemplateService } from './certificate-template.service';
import { KnowledgeHubController } from './knowledge-hub.controller';
import { AiService } from './ai.service';

@Module({
  controllers: [
    CourseController, 
    QuizController, 
    CertificateTemplateController,
    KnowledgeHubController
  ],
  providers: [CourseService, QuizService, CertificateTemplateService, AiService]
})
export class LmsModule {}
