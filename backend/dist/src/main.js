"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const response_interceptor_1 = require("./common/interceptors/response.interceptor");
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = new common_1.Logger('Bootstrap');
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.useGlobalFilters(new http_exception_filter_1.GlobalExceptionFilter());
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    if (process.env.NODE_ENV !== 'production') {
        const config = new swagger_1.DocumentBuilder()
            .setTitle('EST SB — API Gestion Courrier')
            .setDescription('Documentation complète de l\'API de gestion du courrier interne')
            .setVersion('1.0')
            .addBearerAuth()
            .addTag('Auth', 'Authentification JWT')
            .addTag('Couriers', 'Gestion des courriers')
            .addTag('Users', 'Gestion des utilisateurs')
            .addTag('Entities', 'Gestion des entités/départements')
            .addTag('Categories', 'Catégories de courrier')
            .addTag('CourierTypes', 'Types de courrier')
            .addTag('RefStates', 'États référentiels')
            .addTag('Attachments', 'Gestion des pièces jointes (UploadThing)')
            .addTag('Health', 'Vérification de santé')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document, {
            swaggerOptions: { persistAuthorization: true },
        });
        logger.log('📄 Swagger disponible sur http://localhost:3001/api/docs');
    }
    const port = process.env.PORT || 3001;
    await app.listen(port);
    logger.log(`🚀 Backend démarré sur http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map