import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChecklistService } from './checklist.service';

@Controller('audit')
@ApiTags('audit')
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  // 1. Get Audit Checklist Structure (used by both Web and Mobile)
  @Get('checklist')
  @ApiOperation({ summary: 'Get audit checklist categories and points' })
  async getStructure() {
    const data = await this.checklistService.getCategories();
    return {
      success: true,
      data,
    };
  }

  // 2. Sync Audit Checklist Structure (modified by Web Admin ChecklistBuilder)
  @Post('checklist/sync')
  @ApiOperation({ summary: 'Sync and update audit checklist categories and points' })
  async syncStructure(@Body() payload: { categories: any[] }) {
    const data = await this.checklistService.syncStructure(payload.categories);
    return {
      success: true,
      message: 'Struktur checklist audit berhasil disinkronkan',
      data,
    };
  }

  // 3. Get All Audit Inspections
  @Get('inspections')
  @ApiOperation({ summary: 'Get all submitted audit inspection records' })
  async getInspections() {
    const data = await this.checklistService.getInspections();
    return {
      success: true,
      data,
    };
  }

  // 4. Submit Audit Inspection (submitted by Mobile App Auditor)
  @Post('inspections')
  @ApiOperation({ summary: 'Submit a new audit inspection with OK/NOK findings' })
  async submitInspection(
    @Body()
    payload: {
      outlet_id?: string;
      outlet_name: string;
      auditor_name: string;
      pic_name?: string;
      inspection_date?: string;
      notes?: string;
      auditor_signature?: string;
      pic_signature?: string;
      compliance_score: number;
      is_compliant: boolean;
      total_items: number;
      ok_items: number;
      nok_items: number;
      findings?: Array<{
        checklist_point_id?: string;
        point_text?: string;
        is_compliant: boolean;
        notes?: string;
      }>;
    },
  ) {
    const data = await this.checklistService.saveInspection(payload);
    return {
      success: true,
      message: 'Hasil inspeksi audit lapangan berhasil disimpan',
      data,
    };
  }
}
