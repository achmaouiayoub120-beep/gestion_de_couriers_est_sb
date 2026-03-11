import { PrismaService } from '../prisma/prisma.service';
import { CreateCourierTypeDto } from './dto/create-courier-type.dto';
export declare class CourierTypesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        label: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        label: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
    }>;
    create(dto: CreateCourierTypeDto): Promise<{
        id: string;
        label: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
    }>;
    update(id: string, dto: Partial<CreateCourierTypeDto>): Promise<{
        id: string;
        label: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
