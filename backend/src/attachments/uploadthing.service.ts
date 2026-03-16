import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { UTApi } from 'uploadthing/server';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadThingService {
  private readonly logger = new Logger(UploadThingService.name);
  public readonly utapi: UTApi;

  constructor(config: ConfigService) {
    this.utapi = new UTApi({
      token: config.get('UPLOADTHING_SECRET'),
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<{ url: string; publicId: string }> {
    try {
      // Create a File object from the buffer
      const blob = new Blob([new Uint8Array(file.buffer)], { type: file.mimetype });
      const utFile = new File([blob], file.originalname, { type: file.mimetype });

      const response = await this.utapi.uploadFiles(utFile);

      if (response.error || !response.data) {
        this.logger.error('Erreur upload UploadThing:', response.error);
        throw new InternalServerErrorException('Échec du téléchargement du fichier');
      }

      this.logger.log(`Fichier uploadé : ${response.data.key}`);
      return { url: response.data.url, publicId: response.data.key };
    } catch (error) {
      this.logger.error('Exception upload UploadThing:', error);
      throw new InternalServerErrorException('Échec du téléchargement du fichier');
    }
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      await this.utapi.deleteFiles(publicId);
      this.logger.log(`Fichier supprimé : ${publicId}`);
    } catch (error) {
      this.logger.error('Exception suppression UploadThing:', error);
      throw new InternalServerErrorException('Échec de suppression du fichier');
    }
  }
}
