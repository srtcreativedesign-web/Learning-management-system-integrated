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
        reward_points: dto.reward_points ? Number(dto.reward_points) : 0,
        due_date: dto.due_date ? new Date(dto.due_date) : null,
        Materials: dto.materials && dto.materials.length > 0 ? {
          create: dto.materials.map(m => ({
            type: m.type,
            content_url: m.content_url,
            min_read_time: m.min_read_time ? Number(m.min_read_time) : 0
          }))
        } : undefined
      },
    });
  }

  async findAll() {
    return this.prisma.course.findMany({
      include: {
        Materials: {
          include: {
            Quiz: {
              include: {
                Questions: {
                  include: {
                    Options: true
                  }
                }
              }
            }
          }
        },
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.course.findUnique({
      where: { id },
      include: {
        Materials: {
          include: {
            Quiz: {
              include: {
                Questions: {
                  include: {
                    Options: true
                  }
                }
              }
            }
          }
        },
      },
    });
  }

  async update(id: string, dto: any) {
    // Basic update for now
    return this.prisma.course.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        thumbnail_url: dto.thumbnail_url,
        reward_points: dto.reward_points ? Number(dto.reward_points) : undefined,
        due_date: dto.due_date ? new Date(dto.due_date) : undefined,
      },
    });
  }
}
