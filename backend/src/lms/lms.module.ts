import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { CertificateTemplateController } from './certificate-template.controller';
import { CertificatesApiController } from './certificates-api.controller';
import { CertificateTemplateService } from './certificate-template.service';
import { CertificatePdfService } from './certificate-pdf.service';
import { KnowledgeHubController } from './knowledge-hub.controller';
import { AiService } from './ai.service';

@Module({
  controllers: [
    CourseController, 
    QuizController, 
    CertificateTemplateController,
    CertificatesApiController,
    KnowledgeHubController
  ],
  providers: [
    CourseService,
    QuizService,
    CertificateTemplateService,
    CertificatePdfService,
    AiService,
  ]
})
export class LmsModule {}
