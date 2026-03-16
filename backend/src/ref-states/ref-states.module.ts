import { Module } from '@nestjs/common';
import { RefStatesService } from './ref-states.service';
import { RefStatesController } from './ref-states.controller';

@Module({
  controllers: [RefStatesController],
  providers: [RefStatesService],
  exports: [RefStatesService],
})
export class RefStatesModule {}
