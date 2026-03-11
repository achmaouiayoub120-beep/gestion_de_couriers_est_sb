import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EntitiesModule } from './entities/entities.module';
import { CouriersModule } from './couriers/couriers.module';
import { CategoriesModule } from './categories/categories.module';
import { CourierTypesModule } from './courier-types/courier-types.module';
import { RefStatesModule } from './ref-states/ref-states.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{
      ttl: parseInt(process.env.THROTTLE_TTL || '60', 10) * 1000,
      limit: parseInt(process.env.THROTTLE_LIMIT || '100', 10),
    }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    EntitiesModule,
    CouriersModule,
    CategoriesModule,
    CourierTypesModule,
    RefStatesModule,
    AttachmentsModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
