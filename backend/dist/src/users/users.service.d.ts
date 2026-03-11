import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        name: string;
        entity: {
            id: string;
            code: string;
            label: string;
        } | null;
        role: import("@prisma/client").$Enums.Role;
        entityId: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        name: string;
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
        role: import("@prisma/client").$Enums.Role;
        entityId: string | null;
    }>;
    create(dto: CreateUserDto): Promise<{
        id: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        entityId: string | null;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        entityId: string | null;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
