import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateCourseDto } from './dto/create-course.dto';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaClient) {}

  async create(dto: CreateCourseDto) {
    return this.prisma.course.create({
      data: {
        title: dto.title,
        description: dto.description,
        thumbnail_url: dto.thumbnail_url,
      },
    });
  }

  async findAll() {
    return this.prisma.course.findMany({
      include: {
        Materials: true,
      },
    });
  }
}
