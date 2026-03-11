import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
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
            id: string;
            email: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            entityId: string | null;
        };
    }>;
    getMe(user: any): Promise<{
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
        id: string;
        email: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        entityId: string | null;
    }>;
}
