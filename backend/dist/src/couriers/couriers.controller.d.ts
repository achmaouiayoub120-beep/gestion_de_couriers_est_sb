import { CouriersService } from './couriers.service';
import { CreateCourierDto } from './dto/create-courier.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
export declare class CouriersController {
    private couriersService;
    constructor(couriersService: CouriersService);
    findAll(user: any, pagination: PaginationDto): Promise<{
        data: ({
            category: {
                id: string;
                label: string;
                description: string | null;
                isActive: boolean;
                createdAt: Date;
            };
            fromEntity: {
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
            toEntity: {
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
            };
            type: {
                id: string;
                label: string;
                description: string | null;
                isActive: boolean;
                createdAt: Date;
            };
            createdBy: {
                id: string;
                email: string;
                name: string;
                role: import("@prisma/client").$Enums.Role;
            };
            attachments: {
                id: string;
                name: string;
                fileUrl: string;
                publicId: string | null;
                fileType: string | null;
                fileSize: number | null;
                courierId: string;
                uploadedAt: Date;
            }[];
            history: ({
                changedBy: {
                    id: string;
                    name: string;
                };
            } & {
                id: string;
                state: import("@prisma/client").$Enums.CourierState;
                notes: string | null;
                changedAt: Date;
                changedById: string;
                courierId: string;
            })[];
        } & {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            reference: string;
            subject: string;
            fromEntityId: string | null;
            toEntityId: string;
            categoryId: string;
            typeId: string;
            priority: import("@prisma/client").$Enums.Priority;
            state: import("@prisma/client").$Enums.CourierState;
            createdById: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string, user: any): Promise<{
        category: {
            id: string;
            label: string;
            description: string | null;
            isActive: boolean;
            createdAt: Date;
        };
        fromEntity: {
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
        toEntity: {
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
        };
        type: {
            id: string;
            label: string;
            description: string | null;
            isActive: boolean;
            createdAt: Date;
        };
        createdBy: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
        };
        attachments: {
            id: string;
            name: string;
            fileUrl: string;
            publicId: string | null;
            fileType: string | null;
            fileSize: number | null;
            courierId: string;
            uploadedAt: Date;
        }[];
        history: ({
            changedBy: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            state: import("@prisma/client").$Enums.CourierState;
            notes: string | null;
            changedAt: Date;
            changedById: string;
            courierId: string;
        })[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        reference: string;
        subject: string;
        fromEntityId: string | null;
        toEntityId: string;
        categoryId: string;
        typeId: string;
        priority: import("@prisma/client").$Enums.Priority;
        state: import("@prisma/client").$Enums.CourierState;
        createdById: string;
    }>;
    create(dto: CreateCourierDto, user: any): Promise<{
        category: {
            id: string;
            label: string;
            description: string | null;
            isActive: boolean;
            createdAt: Date;
        };
        fromEntity: {
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
        toEntity: {
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
        };
        type: {
            id: string;
            label: string;
            description: string | null;
            isActive: boolean;
            createdAt: Date;
        };
        createdBy: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
        };
        attachments: {
            id: string;
            name: string;
            fileUrl: string;
            publicId: string | null;
            fileType: string | null;
            fileSize: number | null;
            courierId: string;
            uploadedAt: Date;
        }[];
        history: ({
            changedBy: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            state: import("@prisma/client").$Enums.CourierState;
            notes: string | null;
            changedAt: Date;
            changedById: string;
            courierId: string;
        })[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        reference: string;
        subject: string;
        fromEntityId: string | null;
        toEntityId: string;
        categoryId: string;
        typeId: string;
        priority: import("@prisma/client").$Enums.Priority;
        state: import("@prisma/client").$Enums.CourierState;
        createdById: string;
    }>;
    updateState(id: string, dto: UpdateStateDto, user: any): Promise<{
        category: {
            id: string;
            label: string;
            description: string | null;
            isActive: boolean;
            createdAt: Date;
        };
        fromEntity: {
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
        toEntity: {
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
        };
        type: {
            id: string;
            label: string;
            description: string | null;
            isActive: boolean;
            createdAt: Date;
        };
        createdBy: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
        };
        attachments: {
            id: string;
            name: string;
            fileUrl: string;
            publicId: string | null;
            fileType: string | null;
            fileSize: number | null;
            courierId: string;
            uploadedAt: Date;
        }[];
        history: ({
            changedBy: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            state: import("@prisma/client").$Enums.CourierState;
            notes: string | null;
            changedAt: Date;
            changedById: string;
            courierId: string;
        })[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        reference: string;
        subject: string;
        fromEntityId: string | null;
        toEntityId: string;
        categoryId: string;
        typeId: string;
        priority: import("@prisma/client").$Enums.Priority;
        state: import("@prisma/client").$Enums.CourierState;
        createdById: string;
    }>;
    delete(id: string, user: any): Promise<{
        message: string;
    }>;
}
