import { CourierTypesService } from './courier-types.service';
import { CreateCourierTypeDto } from './dto/create-courier-type.dto';
export declare class CourierTypesController {
    private courierTypesService;
    constructor(courierTypesService: CourierTypesService);
    findAll(): Promise<{
        id: string;
        label: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
    }[]>;
    create(dto: CreateCourierTypeDto): Promise<{
        id: string;
        label: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
    }>;
    update(id: string, dto: CreateCourierTypeDto): Promise<{
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
