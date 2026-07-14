import { Controller, Post, Get, Patch, Param, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';

@ApiTags('LMS Courses')
@Controller('lms/courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({ status: 201, description: 'Course created successfully.' })
  async create(@Body() dto: CreateCourseDto) {
    return this.courseService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses/materials' })
  @ApiResponse({ status: 200, description: 'List of all courses.' })
  async getAllCourses() {
    return this.courseService.findAll();
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get course by ID' })
  async getCourseById(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload a course material file (PDF, MP4, etc)' })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = './uploads/materials';
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + extname(file.originalname));
      },
    }),
  }))
  async uploadMaterial(@UploadedFile() file: any) {
    return {
      success: true,
      url: `/uploads/materials/${file.filename}`,
      fileName: file.originalname,
      mimeType: file.mimetype
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a course' })
  async update(@Param('id') id: string, @Body() dto: any) {
    return this.courseService.update(id, dto);
  }
}
