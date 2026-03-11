import { PrismaService } from '../prisma/prisma.service';
import { CreateRefStateDto } from './dto/create-ref-state.dto';
export declare class RefStatesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        label: string;
        description: string | null;
        createdAt: Date;
        color: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        label: string;
        description: string | null;
        createdAt: Date;
        color: string | null;
    }>;
    create(dto: CreateRefStateDto): Promise<{
        id: string;
        label: string;
        description: string | null;
        createdAt: Date;
        color: string | null;
    }>;
    update(id: string, dto: Partial<CreateRefStateDto>): Promise<{
        id: string;
        label: string;
        description: string | null;
        createdAt: Date;
        color: string | null;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
