import { Controller, Get, Post } from '@nestjs/common';
import { OutletService } from './outlet.service';

@Controller('audit/outlets')
export class OutletController {
  constructor(private readonly outletService: OutletService) {}

  @Get()
  findAll() {
    return this.outletService.findAll();
  }

  @Post('sync-hris')
  syncFromHRIS() {
    return this.outletService.syncFromHRIS();
  }
}
