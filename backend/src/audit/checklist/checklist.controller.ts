import { Controller, Get, Post, Body } from '@nestjs/common';
import { ChecklistService } from './checklist.service';

@Controller('audit/checklist')
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Get()
  async getStructure() {
    const data = await this.checklistService.getCategories();
    return {
      success: true,
      data
    };
  }

  @Post('sync')
  async syncStructure(@Body() payload: { categories: any[] }) {
    const data = await this.checklistService.syncStructure(payload.categories);
    return {
      success: true,
      message: 'Checklist structure updated successfully',
      data
    };
  }
}
