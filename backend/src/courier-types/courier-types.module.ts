import { Module } from '@nestjs/common';
import { CourierTypesService } from './courier-types.service';
import { CourierTypesController } from './courier-types.controller';

@Module({
  controllers: [CourierTypesController],
  providers: [CourierTypesService],
  exports: [CourierTypesService],
})
export class CourierTypesModule {}
