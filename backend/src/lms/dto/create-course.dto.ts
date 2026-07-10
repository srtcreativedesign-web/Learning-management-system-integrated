import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ example: 'Pengenalan K3' })
  title: string;

  @ApiPropertyOptional({ example: 'Materi dasar K3 di lingkungan pabrik' })
  description?: string;

  @ApiPropertyOptional({ example: 'https://dummyimage.com/600x400/000/fff' })
  thumbnail_url?: string;

  @ApiPropertyOptional({ example: 100 })
  reward_points?: number;

  @ApiPropertyOptional()
  due_date?: Date;

  @ApiPropertyOptional()
  materials?: { type: string, content_url: string, min_read_time?: number }[];
}
