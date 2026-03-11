import { RefStatesService } from './ref-states.service';
import { CreateRefStateDto } from './dto/create-ref-state.dto';
export declare class RefStatesController {
    private refStatesService;
    constructor(refStatesService: RefStatesService);
    findAll(): Promise<{
        id: string;
        label: string;
        description: string | null;
        createdAt: Date;
        color: string | null;
    }[]>;
    create(dto: CreateRefStateDto): Promise<{
        id: string;
        label: string;
        description: string | null;
        createdAt: Date;
        color: string | null;
    }>;
    update(id: string, dto: CreateRefStateDto): Promise<{
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
