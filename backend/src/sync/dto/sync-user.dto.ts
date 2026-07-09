import { ApiProperty } from '@nestjs/swagger';

export class SyncUserDto {
  @ApiProperty({ example: '102', description: 'User ID from HRIS' })
  hris_user_id: string;

  @ApiProperty({ example: 'Budi Santoso' })
  full_name: string;

  @ApiProperty({ example: 'budi@sobathr.com' })
  email: string;
}
