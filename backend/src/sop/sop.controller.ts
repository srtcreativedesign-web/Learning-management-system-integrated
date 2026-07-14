import { Controller, Get, Post, Body, Param, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SopService } from './sop.service';

@Controller('api/sop')
export class SopController {
  constructor(private readonly sopService: SopService) {}

  @Get()
  async getAllSops(@Query('category') category?: string) {
    return this.sopService.getAllSops(category);
  }

  @Get(':id')
  async getSopById(@Param('id') id: string) {
    return this.sopService.getSopById(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSop(
    @UploadedFile() file: any,
    @Body('title') title: string,
    @Body('category') category: string
  ) {
    if (!file) {
      return { success: false, message: 'File is required' };
    }
    
    try {
      const sop = await this.sopService.uploadAndProcessSop(file, title, category);
      return { success: true, data: sop };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }
}
