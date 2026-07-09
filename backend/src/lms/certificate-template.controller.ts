import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CertificateTemplateService } from './certificate-template.service';

@Controller('certificate-templates')
export class CertificateTemplateController {
  constructor(private readonly certificateTemplateService: CertificateTemplateService) {}

  @Post()
  async createTemplate(@Body() data: any) {
    return this.certificateTemplateService.createTemplate(data);
  }

  @Get()
  async getAllTemplates() {
    return this.certificateTemplateService.getAllTemplates();
  }

  @Get(':id')
  async getTemplate(@Param('id') id: string) {
    return this.certificateTemplateService.getTemplateById(id);
  }
}
