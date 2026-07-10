import { Module } from '@nestjs/common';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { ChecklistController } from './checklist/checklist.controller';
import { ChecklistService } from './checklist/checklist.service';
import { OutletController } from './outlet/outlet.controller';
import { OutletService } from './outlet/outlet.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [TemplateController, ChecklistController, OutletController],
  providers: [TemplateService, ChecklistService, OutletService]
})
export class AuditModule {}
