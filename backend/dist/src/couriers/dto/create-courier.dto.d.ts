import { Priority } from '@prisma/client';
export declare class CreateCourierDto {
    subject: string;
    description?: string;
    toEntityId: string;
    fromEntityId?: string;
    categoryId: string;
    typeId: string;
    priority?: Priority;
}
