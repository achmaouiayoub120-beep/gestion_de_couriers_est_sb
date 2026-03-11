import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoriesService {
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
    create(dto: CreateCategoryDto): Promise<{
        id: string;
        label: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
    }>;
    update(id: string, dto: Partial<CreateCategoryDto>): Promise<{
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
