import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TrainingReportService } from './training-report.service';

@Controller('training-report')
@ApiTags('training-report')
export class TrainingReportController {
  constructor(private readonly reportService: TrainingReportService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get aggregated training report analytics and KPI metrics' })
  async getOverview(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('outletId') outletId?: string,
  ) {
    const data = await this.reportService.getOverview({ startDate, endDate, outletId });
    return {
      success: true,
      data,
    };
  }

  @Get('records')
  @ApiOperation({ summary: 'Get normalized and filterable training participation records' })
  async getRecords(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('type') type?: 'ALL' | 'ONLINE' | 'IN_HOUSE',
    @Query('isPassed') isPassed?: 'ALL' | 'PASSED' | 'FAILED',
    @Query('outletId') outletId?: string,
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const data = await this.reportService.getDetailedRecords({
      startDate,
      endDate,
      type,
      isPassed,
      outletId,
      search,
      limit: limit ? parseInt(limit, 10) : 100,
      offset: offset ? parseInt(offset, 10) : 0,
    });
    return {
      success: true,
      data,
    };
  }

  @Get('outlets')
  @ApiOperation({ summary: 'Get outlets list for training report filter' })
  async getOutlets() {
    const data = await this.reportService.getOutlets();
    return {
      success: true,
      data,
    };
  }
}
