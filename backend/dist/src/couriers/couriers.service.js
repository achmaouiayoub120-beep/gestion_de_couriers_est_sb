"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CouriersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouriersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const COURIER_INCLUDE = {
    fromEntity: true,
    toEntity: true,
    category: true,
    type: true,
    createdBy: { select: { id: true, name: true, email: true, role: true } },
    attachments: true,
    history: {
        include: {
            changedBy: { select: { id: true, name: true } },
        },
        orderBy: { changedAt: 'asc' },
    },
};
let CouriersService = CouriersService_1 = class CouriersService {
    prisma;
    logger = new common_1.Logger(CouriersService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(user, pagination) {
        const { page = 1, limit = 20, search } = pagination;
        const skip = (page - 1) * limit;
        let roleFilter = {};
        if (user.role === client_1.Role.AGENT) {
            roleFilter = { OR: [{ toEntityId: user.entityId }, { createdById: user.id }] };
        }
        else if (user.role === client_1.Role.CHEF) {
            roleFilter = { toEntityId: user.entityId };
        }
        const searchFilter = search
            ? {
                OR: [
                    { reference: { contains: search, mode: 'insensitive' } },
                    { subject: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};
        const where = { ...roleFilter, ...searchFilter };
        const [data, total] = await Promise.all([
            this.prisma.courier.findMany({
                where,
                include: COURIER_INCLUDE,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.courier.count({ where }),
        ]);
        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async findOne(id, user) {
        const courier = await this.prisma.courier.findUnique({
            where: { id },
            include: COURIER_INCLUDE,
        });
        if (!courier)
            throw new common_1.NotFoundException('Courrier non trouvé');
        if (user.role === client_1.Role.AGENT &&
            courier.toEntityId !== user.entityId &&
            courier.createdById !== user.id) {
            throw new common_1.ForbiddenException('Accès non autorisé');
        }
        return courier;
    }
    async create(dto, userId) {
        const reference = this.generateReference();
        const courier = await this.prisma.courier.create({
            data: {
                reference,
                subject: dto.subject,
                description: dto.description,
                toEntityId: dto.toEntityId,
                fromEntityId: dto.fromEntityId,
                categoryId: dto.categoryId,
                typeId: dto.typeId,
                priority: dto.priority,
                createdById: userId,
                state: client_1.CourierState.NEW,
                history: {
                    create: { state: client_1.CourierState.NEW, changedById: userId },
                },
            },
            include: COURIER_INCLUDE,
        });
        this.logger.log(`Nouveau courrier créé : ${reference} par user ${userId}`);
        return courier;
    }
    async updateState(id, dto, userId, userRole) {
        const courier = await this.prisma.courier.findUnique({ where: { id } });
        if (!courier)
            throw new common_1.NotFoundException('Courrier non trouvé');
        this.validateStateTransition(courier.state, dto.state, userRole);
        const updated = await this.prisma.courier.update({
            where: { id },
            data: {
                state: dto.state,
                history: {
                    create: { state: dto.state, changedById: userId, notes: dto.notes },
                },
            },
            include: COURIER_INCLUDE,
        });
        this.logger.log(`Courrier ${id} : ${courier.state} → ${dto.state} par user ${userId}`);
        return updated;
    }
    async delete(id, userId, userRole) {
        const courier = await this.prisma.courier.findUnique({ where: { id } });
        if (!courier)
            throw new common_1.NotFoundException('Courrier non trouvé');
        if (userRole !== client_1.Role.SUPER_ADMIN && userRole !== client_1.Role.ADMIN) {
            if (courier.createdById !== userId) {
                throw new common_1.ForbiddenException('Vous ne pouvez supprimer que vos propres courriers');
            }
        }
        await this.prisma.courier.delete({ where: { id } });
        this.logger.log(`Courrier supprimé : ${id} par user ${userId}`);
        return { message: 'Courrier supprimé avec succès' };
    }
    validateStateTransition(current, next, role) {
        const allowedTransitions = {
            NEW: [client_1.CourierState.IN_PROGRESS, client_1.CourierState.REJECTED],
            IN_PROGRESS: [client_1.CourierState.TREATED, client_1.CourierState.REJECTED],
            TREATED: [client_1.CourierState.ARCHIVED],
            REJECTED: [client_1.CourierState.ARCHIVED],
            ARCHIVED: [],
        };
        if (!allowedTransitions[current].includes(next) && role !== client_1.Role.SUPER_ADMIN) {
            throw new common_1.ForbiddenException(`Transition ${current} → ${next} non autorisée`);
        }
    }
    generateReference() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const random = Math.random().toString(36).substring(2, 7).toUpperCase();
        return `ESTSB-${year}${month}-${random}`;
    }
};
exports.CouriersService = CouriersService;
exports.CouriersService = CouriersService = CouriersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CouriersService);
//# sourceMappingURL=couriers.service.js.map