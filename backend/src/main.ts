import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Security
  app.use(helmet());
  app.use(compression());

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global prefix, pipes, filters, interceptors
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
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

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });

    logger.log('📄 Swagger disponible sur http://localhost:3001/api/docs');
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`🚀 Backend démarré sur http://localhost:${port}/api`);
}

bootstrap();
