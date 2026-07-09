import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TemplateService } from './template.service';

@ApiTags('Audit Templates (Offline Sync)')
@Controller('audit/templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Get()
  @ApiOperation({ summary: 'Get all audit templates with checklists for offline sync' })
  @ApiResponse({ status: 200, description: 'List of templates and nested checklists.' })
  async findAllForOfflineSync() {
    return this.templateService.findAllForOfflineSync();
  }
}
