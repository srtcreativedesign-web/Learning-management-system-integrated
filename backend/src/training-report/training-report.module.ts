import { Module } from '@nestjs/common';
import { TrainingReportController } from './training-report.controller';
import { TrainingReportService } from './training-report.service';

@Module({
  controllers: [TrainingReportController],
  providers: [TrainingReportService],
  exports: [TrainingReportService],
})
export class TrainingReportModule {}
