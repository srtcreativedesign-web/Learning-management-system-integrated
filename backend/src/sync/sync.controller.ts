import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SyncService } from './sync.service';
import { SyncUserDto } from './dto/sync-user.dto';
import { SyncDivisionDto } from './dto/sync-division.dto';

@ApiTags('Sync (Webhook)')
@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('user')
  @ApiOperation({ summary: 'Sync employee data from HRIS' })
  @ApiResponse({ status: 201, description: 'User data synced successfully.' })
  async syncUser(@Body() dto: SyncUserDto) {
    return this.syncService.syncUser(dto);
  }

  @Post('division')
  @ApiOperation({ summary: 'Sync division data from HRIS' })
  @ApiResponse({ status: 201, description: 'Division data synced successfully.' })
  async syncDivision(@Body() dto: SyncDivisionDto) {
    return this.syncService.syncDivision(dto);
  }
}
