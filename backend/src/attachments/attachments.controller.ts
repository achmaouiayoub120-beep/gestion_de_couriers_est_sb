import {
  Controller, Post, UseGuards, UseInterceptors,
  UploadedFile, BadRequestException, Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UploadThingService } from './uploadthing.service';
import { PrismaService } from '../prisma/prisma.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'image/jpeg', 'image/png', 'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

@ApiTags('Attachments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('attachments')
export class AttachmentsController {
  constructor(
    private uploadThing: UploadThingService,
    private prisma: PrismaService,
  ) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload un fichier joint à un courrier' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (_req, file, cb) => {
      if (ALLOWED_TYPES.includes(file.mimetype)) cb(null, true);
      else cb(new BadRequestException('Type de fichier non autorisé'), false);
    },
  }))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('courierId') courierId: string,
    @CurrentUser() _user: any,
  ) {
    if (!file) throw new BadRequestException('Aucun fichier fourni');

    const { url, publicId } = await this.uploadThing.uploadFile(file);

    const attachment = await this.prisma.attachment.create({
      data: {
        name: file.originalname,
        fileUrl: url,
        publicId,
        fileType: file.mimetype,
        fileSize: file.size,
        courierId,
      },
    });

    return attachment;
  }
}
