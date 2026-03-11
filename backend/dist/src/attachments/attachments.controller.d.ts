import { UploadThingService } from './uploadthing.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class AttachmentsController {
    private uploadThing;
    private prisma;
    constructor(uploadThing: UploadThingService, prisma: PrismaService);
    upload(file: Express.Multer.File, courierId: string, _user: any): Promise<{
        id: string;
        name: string;
        fileUrl: string;
        publicId: string | null;
        fileType: string | null;
        fileSize: number | null;
        courierId: string;
        uploadedAt: Date;
    }>;
}
