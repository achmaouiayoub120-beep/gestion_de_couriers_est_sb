import { Module } from '@nestjs/common';
import { AttachmentsController } from './attachments.controller';
import { UploadThingService } from './uploadthing.service';

@Module({
  controllers: [AttachmentsController],
  providers: [UploadThingService],
  exports: [UploadThingService],
})
export class AttachmentsModule {}
