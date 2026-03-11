import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            entity: {
                id: string;
                code: string;
                label: string;
                description: string | null;
                email: string | null;
                phone: string | null;
                parentEntityId: string | null;
                chefId: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            } | null;
            id: string;
            email: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            entityId: string | null;
        };
    }>;
    getMe(userId: string): Promise<{
        entity: {
            id: string;
            code: string;
            label: string;
            description: string | null;
            email: string | null;
            phone: string | null;
            parentEntityId: string | null;
            chefId: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        id: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        entityId: string | null;
    }>;
}
