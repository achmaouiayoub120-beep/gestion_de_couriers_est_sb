"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var UploadThingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadThingService = void 0;
const common_1 = require("@nestjs/common");
const server_1 = require("uploadthing/server");
const config_1 = require("@nestjs/config");
let UploadThingService = UploadThingService_1 = class UploadThingService {
    logger = new common_1.Logger(UploadThingService_1.name);
    utapi;
    constructor(config) {
        this.utapi = new server_1.UTApi({
            token: config.get('UPLOADTHING_SECRET'),
        });
    }
    async uploadFile(file) {
        try {
            const blob = new Blob([new Uint8Array(file.buffer)], { type: file.mimetype });
            const utFile = new File([blob], file.originalname, { type: file.mimetype });
            const response = await this.utapi.uploadFiles(utFile);
            if (response.error || !response.data) {
                this.logger.error('Erreur upload UploadThing:', response.error);
                throw new common_1.InternalServerErrorException('Échec du téléchargement du fichier');
            }
            this.logger.log(`Fichier uploadé : ${response.data.key}`);
            return { url: response.data.url, publicId: response.data.key };
        }
        catch (error) {
            this.logger.error('Exception upload UploadThing:', error);
            throw new common_1.InternalServerErrorException('Échec du téléchargement du fichier');
        }
    }
    async deleteFile(publicId) {
        try {
            await this.utapi.deleteFiles(publicId);
            this.logger.log(`Fichier supprimé : ${publicId}`);
        }
        catch (error) {
            this.logger.error('Exception suppression UploadThing:', error);
            throw new common_1.InternalServerErrorException('Échec de suppression du fichier');
        }
    }
};
exports.UploadThingService = UploadThingService;
exports.UploadThingService = UploadThingService = UploadThingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadThingService);
//# sourceMappingURL=uploadthing.service.js.map