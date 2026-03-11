import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<{
        id: string;
        label: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
    }[]>;
    create(dto: CreateCategoryDto): Promise<{
        id: string;
        label: string;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
    }>;
    update(id: string, dto: CreateCategoryDto): Promise<{
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
