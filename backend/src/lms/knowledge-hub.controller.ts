import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CourseService } from './course.service';

@ApiTags('Knowledge Hub')
@Controller('api/knowledge-hub')
export class KnowledgeHubController {
  constructor(private readonly courseService: CourseService) {}

  @Get('courses')
  @ApiOperation({ summary: 'Get all courses for Knowledge Hub (Mobile)' })
  @ApiResponse({ status: 200, description: 'List of all courses.' })
  async getAllCourses() {
    return this.courseService.findAll();
  }
}
