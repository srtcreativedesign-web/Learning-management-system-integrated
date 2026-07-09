import { ApiProperty } from '@nestjs/swagger';

export class SyncDivisionDto {
  @ApiProperty({ example: '5', description: 'Division ID from HRIS' })
  hris_division_id: string;

  @ApiProperty({ example: 'Information Technology' })
  name: string;
}
