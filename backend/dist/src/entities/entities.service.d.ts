import { PrismaService } from '../prisma/prisma.service';
import { CreateEntityDto } from './dto/create-entity.dto';
import { UpdateEntityDto } from './dto/update-entity.dto';
export declare class EntitiesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        parent: {
            id: string;
            code: string;
            label: string;
        } | null;
        children: {
            id: string;
            code: string;
            label: string;
        }[];
        chef: {
            id: string;
            email: string;
            name: string;
        } | null;
        _count: {
            users: number;
            receivedCouriers: number;
        };
    } & {
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
    })[]>;
    findOne(id: string): Promise<{
        parent: {
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
        children: {
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
        }[];
        chef: {
            id: string;
            email: string;
            name: string;
        } | null;
        users: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
        }[];
    } & {
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
    }>;
    create(dto: CreateEntityDto): Promise<{
        parent: {
            id: string;
            code: string;
            label: string;
        } | null;
        chef: {
            id: string;
            email: string;
            name: string;
        } | null;
    } & {
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
    }>;
    update(id: string, dto: UpdateEntityDto): Promise<{
        parent: {
            id: string;
            code: string;
            label: string;
        } | null;
        chef: {
            id: string;
            email: string;
            name: string;
        } | null;
    } & {
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
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
