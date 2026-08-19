import { Module } from '@nestjs/common';
import { InHouseController } from './in-house.controller';
import { InHouseService } from './in-house.service';

@Module({
  controllers: [InHouseController],
  providers: [InHouseService],
  exports: [InHouseService],
})
export class InHouseModule {}
