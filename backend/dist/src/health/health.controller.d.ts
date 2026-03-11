import { HealthCheckService } from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';
export declare class HealthController {
    private health;
    private prisma;
    constructor(health: HealthCheckService, prisma: PrismaService);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult<import("@nestjs/terminus").HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & ({
        database: {
            status: "up";
        };
    } | {
        database: {
            status: "down";
        };
    }), Partial<import("@nestjs/terminus").HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & ({
        database: {
            status: "up";
        };
    } | {
        database: {
            status: "down";
        };
    })> | undefined, Partial<import("@nestjs/terminus").HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & ({
        database: {
            status: "up";
        };
    } | {
        database: {
            status: "down";
        };
    })> | undefined>>;
}
