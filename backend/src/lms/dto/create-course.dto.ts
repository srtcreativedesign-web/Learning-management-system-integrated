import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ example: 'Pengenalan K3' })
  title: string;

  @ApiPropertyOptional({ example: 'Materi dasar K3 di lingkungan pabrik' })
  description?: string;

  @ApiPropertyOptional({ example: 'https://dummyimage.com/600x400/000/fff' })
  thumbnail_url?: string;
}
