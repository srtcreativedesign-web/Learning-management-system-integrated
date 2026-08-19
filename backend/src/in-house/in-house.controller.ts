import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { InHouseService } from './in-house.service';

@Controller('in-house')
export class InHouseController {
  constructor(private readonly inHouseService: InHouseService) {}

  // 1. Get checklist structure
  @Get('checklists')
  async getChecklists() {
    const data = await this.inHouseService.getCategories();
    return {
      success: true,
      data,
    };
  }

  // 2. Sync / Save checklist structure
  @Post('checklists/sync')
  async syncChecklists(@Body() payload: { categories: any[] }) {
    const data = await this.inHouseService.syncStructure(payload.categories);
    return {
      success: true,
      message: 'Checklist in-house training berhasil diperbarui',
      data,
    };
  }

  // 3. Get sessions
  @Get('sessions')
  async getSessions(
    @Query('outlet_id') outletId?: string,
    @Query('status') status?: string,
  ) {
    const data = await this.inHouseService.getSessions({ outletId, status });
    return {
      success: true,
      data,
    };
  }

  // 4. Get single session
  @Get('sessions/:id')
  async getSessionById(@Param('id') id: string) {
    const data = await this.inHouseService.getSessionById(id);
    return {
      success: true,
      data,
    };
  }

  // 5. Submit session evaluation
  @Post('sessions')
  async createSession(
    @Body()
    payload: {
      trainer_name?: string;
      outlet_id?: string;
      trainee_name?: string;
      training_date?: string;
      notes?: string;
      assessments: Array<{
        checklist_point_id: string;
        score: number;
        notes?: string;
      }>;
    },
  ) {
    const data = await this.inHouseService.saveSession(payload);
    return {
      success: true,
      message: 'Penilaian sesi in-house training berhasil disimpan dan dikalkulasi',
      data,
    };
  }

  // 6. Delete session
  @Delete('sessions/:id')
  async deleteSession(@Param('id') id: string) {
    await this.inHouseService.deleteSession(id);
    return {
      success: true,
      message: 'Sesi training berhasil dihapus',
    };
  }
}
