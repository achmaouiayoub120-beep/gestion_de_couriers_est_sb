import { UTApi } from 'uploadthing/server';
import { ConfigService } from '@nestjs/config';
export declare class UploadThingService {
    private readonly logger;
    readonly utapi: UTApi;
    constructor(config: ConfigService);
    uploadFile(file: Express.Multer.File): Promise<{
        url: string;
        publicId: string;
    }>;
    deleteFile(publicId: string): Promise<void>;
}
